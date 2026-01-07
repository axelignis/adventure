"use server";

import { prisma } from "@/lib/prisma";
import { cache } from "react";

/**
 * Get service by slug with all related data
 */
export const getServiceBySlug = cache(async (slug: string) => {
  const service = await prisma.service.findUnique({
    where: {
      slug,
      status: "APPROVED",
    },
    include: {
      images: {
        orderBy: { order: "asc" },
      },
      region: true,
      comuna: true,
      guide: {
        select: {
          id: true,
          name: true,
          image: true,
          createdAt: true,
          guideProfile: {
            select: {
              bio: true,
              bioEn: true,
              languages: true,
              yearsExperience: true,
              totalBookings: true,
              averageRating: true,
              responseTime: true,
              verified: true,
            },
          },
        },
      },
      addOns: {
        orderBy: { createdAt: "asc" },
      },
      faqs: {
        orderBy: { order: "asc" },
      },
      _count: {
        select: {
          reviews: {
            where: { status: "PUBLISHED" },
          },
          bookings: {
            where: { status: "COMPLETED" },
          },
        },
      },
    },
  });

  return service;
});

/**
 * Get reviews for a service with pagination
 */
export const getServiceReviews = cache(
  async (serviceId: string, page: number = 1, limit: number = 10) => {
    const skip = (page - 1) * limit;

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where: {
          serviceId,
          status: "PUBLISHED",
        },
        include: {
          user: {
            select: {
              name: true,
              image: true,
            },
          },
          images: {
            orderBy: { order: "asc" },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.review.count({
        where: {
          serviceId,
          status: "PUBLISHED",
        },
      }),
    ]);

    return {
      reviews,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page,
    };
  }
);

/**
 * Get rating breakdown for a service
 */
export const getRatingBreakdown = cache(async (serviceId: string) => {
  const reviews = await prisma.review.findMany({
    where: {
      serviceId,
      status: "PUBLISHED",
    },
    select: {
      rating: true,
    },
  });

  const breakdown = {
    5: 0,
    4: 0,
    3: 0,
    2: 0,
    1: 0,
  };

  reviews.forEach((review) => {
    if (review.rating >= 1 && review.rating <= 5) {
      breakdown[review.rating as keyof typeof breakdown]++;
    }
  });

  const total = reviews.length;
  const average =
    total > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / total
      : 0;

  return {
    breakdown,
    total,
    average: Math.round(average * 10) / 10, // Round to 1 decimal
  };
});

/**
 * Get related services (same category or region)
 */
export const getRelatedServices = cache(
  async (
    serviceId: string,
    category: string,
    regionId: string,
    limit: number = 4
  ) => {
    // First try to get services from same category and region
    let services = await prisma.service.findMany({
      where: {
        id: { not: serviceId },
        status: "APPROVED",
        verified: true,
        OR: [{ category: category as any }, { regionId }],
      },
      include: {
        region: true,
        comuna: true,
        _count: {
          select: {
            reviews: {
              where: { status: "PUBLISHED" },
            },
          },
        },
      },
      orderBy: [
        { featured: "desc" },
        { rating: "desc" },
        { reviewCount: "desc" },
      ],
      take: limit,
    });

    // If not enough results, get any verified services
    if (services.length < limit) {
      const additional = await prisma.service.findMany({
        where: {
          id: {
            not: serviceId,
            notIn: services.map((s) => s.id),
          },
          status: "APPROVED",
          verified: true,
        },
        include: {
          region: true,
          comuna: true,
          _count: {
            select: {
              reviews: {
                where: { status: "PUBLISHED" },
              },
            },
          },
        },
        orderBy: [{ rating: "desc" }, { reviewCount: "desc" }],
        take: limit - services.length,
      });

      services = [...services, ...additional];
    }

    return services;
  }
);

/**
 * Get available dates for a service (next 90 days)
 */
export const getServiceAvailability = cache(async (serviceId: string) => {
  const today = new Date();
  const ninetyDaysFromNow = new Date();
  ninetyDaysFromNow.setDate(today.getDate() + 90);

  const availability = await prisma.serviceAvailability.findMany({
    where: {
      serviceId,
      date: {
        gte: today,
        lte: ninetyDaysFromNow,
      },
      capacity: {
        gt: 0,
      },
    },
    orderBy: {
      date: "asc",
    },
  });

  return availability;
});

/**
 * Increment view count for analytics
 */
export async function incrementViewCount(serviceId: string) {
  try {
    await prisma.service.update({
      where: { id: serviceId },
      data: {
        viewCount: {
          increment: 1,
        },
      },
    });
  } catch (error) {
    console.error("Failed to increment view count:", error);
    // Don't throw - this is non-critical
  }
}
