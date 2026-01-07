"use server";

import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import {
  createBookingSchema,
  calculateTotalSchema,
  phoneVerificationSchema,
  type CreateBookingInput,
  type CalculateTotalInput,
  type PhoneVerificationInput,
} from "@/lib/validations/checkout";
import { revalidatePath } from "next/cache";

/**
 * Calculate total price for booking
 */
export async function calculateTotal(input: CalculateTotalInput) {
  try {
    const validated = calculateTotalSchema.parse(input);

    // Get service
    const service = await prisma.service.findUnique({
      where: { id: validated.serviceId },
      select: { priceBase: true },
    });

    if (!service) {
      return {
        success: false,
        error: "Service not found",
      };
    }

    // Get add-ons if any
    let addOnsTotal = 0;
    if (validated.addOnIds.length > 0) {
      const addOns = await prisma.serviceAddOn.findMany({
        where: {
          id: { in: validated.addOnIds },
          serviceId: validated.serviceId,
        },
        select: { price: true },
      });

      addOnsTotal = addOns.reduce((sum, addOn) => sum + addOn.price, 0);
    }

    // Calculate total
    const serviceTotal = service.priceBase * validated.participants;
    const total = serviceTotal + addOnsTotal;

    return {
      success: true,
      data: {
        serviceTotal,
        addOnsTotal,
        total,
        breakdown: {
          pricePerPerson: service.priceBase,
          participants: validated.participants,
          addOns: addOnsTotal,
        },
      },
    };
  } catch (error) {
    console.error("Calculate total error:", error);
    return {
      success: false,
      error: "Failed to calculate total price",
    };
  }
}

/**
 * Send phone verification code (simulated for now)
 */
export async function sendPhoneVerificationCode(phone: string) {
  try {
    // Simulate sending SMS/WhatsApp
    // In production, integrate with Twilio, Vonage, or similar
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    console.log(`📱 Phone verification code for ${phone}: ${code}`);

    // In production, store code in Redis with TTL
    // For now, we'll use a simple approach: code is always "123456" for demo
    return {
      success: true,
      message: "Verification code sent successfully",
      // In dev mode, return the code (remove in production)
      devCode: process.env.NODE_ENV === "development" ? "123456" : undefined,
    };
  } catch (error) {
    console.error("Send verification code error:", error);
    return {
      success: false,
      error: "Failed to send verification code",
    };
  }
}

/**
 * Verify phone code (simulated for now)
 */
export async function verifyPhoneCode(input: PhoneVerificationInput) {
  try {
    const validated = phoneVerificationSchema.parse(input);

    // Simulated verification
    // In production, check against stored code in Redis
    const isValid = validated.code === "123456";

    if (!isValid) {
      return {
        success: false,
        error: "Invalid verification code",
      };
    }

    return {
      success: true,
      message: "Phone verified successfully",
    };
  } catch (error) {
    console.error("Verify phone code error:", error);
    return {
      success: false,
      error: "Failed to verify phone code",
    };
  }
}

/**
 * Create or get guest user
 */
async function getOrCreateGuestUser(
  email: string,
  phone: string,
  name: string
) {
  // Check if user exists by email
  let user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    // Create guest user account
    user = await prisma.user.create({
      data: {
        email,
        name,
        phone,
        role: "USER",
        emailVerified: null, // Guest users aren't email verified initially
      },
    });
  }

  return user;
}

/**
 * Create booking
 */
export async function createBooking(input: CreateBookingInput) {
  try {
    const validated = createBookingSchema.parse(input);

    // Get session if authenticated
    const session = await auth();

    // Determine user ID
    let userId = validated.userId || session?.user?.id;

    // If guest checkout, create/get user
    if (!userId && validated.guestEmail && validated.guestPhone && validated.guestName) {
      const guestUser = await getOrCreateGuestUser(
        validated.guestEmail,
        validated.guestPhone,
        validated.guestName
      );
      userId = guestUser.id;
    }

    if (!userId) {
      return {
        success: false,
        error: "User authentication required",
      };
    }

    // Verify service exists and get details
    const service = await prisma.service.findUnique({
      where: { id: validated.serviceId },
      select: {
        id: true,
        title: true,
        guideId: true,
        priceBase: true,
      },
    });

    if (!service) {
      return {
        success: false,
        error: "Service not found",
      };
    }

    // Create booking
    const booking = await prisma.booking.create({
      data: {
        userId,
        serviceId: service.id,
        guideId: service.guideId,
        serviceDate: validated.serviceDate,
        participants: validated.participants,
        totalAmount: validated.totalAmount,
        status: "REQUESTED",
        paymentStatus: "PENDING",
        dietaryRestrictions: validated.dietaryRestrictions,
        specialConsiderations: validated.specialConsiderations,
      },
    });

    // Create add-on connections if any
    if (validated.addOnIds && validated.addOnIds.length > 0) {
      await prisma.bookingAddOn.createMany({
        data: validated.addOnIds.map((addOnId) => ({
          bookingId: booking.id,
          addOnId,
        })),
      });
    }

    // Revalidate relevant paths
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/bookings");

    return {
      success: true,
      data: {
        bookingId: booking.id,
        bookingNumber: booking.bookingNumber,
      },
    };
  } catch (error) {
    console.error("Create booking error:", error);
    return {
      success: false,
      error: "Failed to create booking. Please try again.",
    };
  }
}

/**
 * Get service details for checkout
 */
export async function getServiceForCheckout(serviceId: string) {
  try {
    const service = await prisma.service.findUnique({
      where: { id: serviceId },
      select: {
        id: true,
        title: true,
        slug: true,
        coverImage: true,
        priceBase: true,
        minParticipants: true,
        maxParticipants: true,
        duration: true,
        guide: {
          select: {
            name: true,
            image: true,
            guideProfile: {
              select: {
                verified: true,
              },
            },
          },
        },
        addOns: {
          select: {
            id: true,
            name: true,
            description: true,
            price: true,
            type: true,
          },
        },
      },
    });

    if (!service) {
      return {
        success: false,
        error: "Service not found",
      };
    }

    return {
      success: true,
      data: service,
    };
  } catch (error) {
    console.error("Get service for checkout error:", error);
    return {
      success: false,
      error: "Failed to load service details",
    };
  }
}

/**
 * Get booking details
 */
export async function getBookingDetails(bookingId: string) {
  try {
    const session = await auth();

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        service: {
          select: {
            title: true,
            slug: true,
            coverImage: true,
            duration: true,
          },
        },
        guide: {
          select: {
            user: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
        addOns: {
          include: {
            addOn: {
              select: {
                name: true,
                price: true,
              },
            },
          },
        },
      },
    });

    if (!booking) {
      return {
        success: false,
        error: "Booking not found",
      };
    }

    // Verify user has access to this booking
    if (session?.user?.id !== booking.userId) {
      return {
        success: false,
        error: "Unauthorized access",
      };
    }

    return {
      success: true,
      data: booking,
    };
  } catch (error) {
    console.error("Get booking details error:", error);
    return {
      success: false,
      error: "Failed to load booking details",
    };
  }
}
