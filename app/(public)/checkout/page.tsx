import { redirect } from "next/navigation";
import { Suspense } from "react";
import { auth } from "@/lib/auth";
import { Header } from "@/components/layout/header";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckoutWizard } from "./_components/checkout-wizard";
import { getServiceForCheckout } from "./actions";

interface CheckoutPageProps {
  searchParams: Promise<{
    serviceId?: string;
    date?: string;
    participants?: string;
  }>;
}

async function CheckoutContent({
  searchParams,
}: {
  searchParams: {
    serviceId?: string;
    date?: string;
    participants?: string;
  };
}) {
  const session = await auth();

  // Validate required params
  if (!searchParams.serviceId || !searchParams.date || !searchParams.participants) {
    redirect("/explorar");
  }

  // Parse params
  const serviceId = searchParams.serviceId;
  const date = new Date(searchParams.date);
  const participants = parseInt(searchParams.participants);

  // Validate date is valid and in the future
  if (isNaN(date.getTime()) || date < new Date()) {
    redirect(`/experiencias/${serviceId}`);
  }

  // Validate participants
  if (isNaN(participants) || participants < 1) {
    redirect(`/experiencias/${serviceId}`);
  }

  // Get service details
  const serviceResult = await getServiceForCheckout(serviceId);

  if (!serviceResult.success || !serviceResult.data) {
    redirect("/explorar");
  }

  const service = serviceResult.data;

  // Check participants are within limits
  if (
    participants < service.minParticipants ||
    participants > service.maxParticipants
  ) {
    redirect(`/experiencias/${service.slug}`);
  }

  return (
    <div className="container max-w-4xl py-8">
      <CheckoutWizard
        service={service}
        date={date}
        participants={participants}
        isAuthenticated={!!session}
        userEmail={session?.user?.email || undefined}
        userName={session?.user?.name || undefined}
        userPhone={session?.user?.phone || undefined}
        userId={session?.user?.id}
      />
    </div>
  );
}

function CheckoutSkeleton() {
  return (
    <div className="container max-w-4xl py-8 space-y-6">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-64 w-full" />
      <Skeleton className="h-64 w-full" />
      <Skeleton className="h-16 w-full" />
    </div>
  );
}

export default async function CheckoutPage({ searchParams }: CheckoutPageProps) {
  const params = await searchParams;

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Suspense fallback={<CheckoutSkeleton />}>
          <CheckoutContent searchParams={params} />
        </Suspense>
      </main>
    </div>
  );
}
