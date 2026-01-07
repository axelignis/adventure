"use server";

import { prisma } from "@/lib/db";
import { Prisma, ActivityCategory, DifficultyLevel, Duration } from "@prisma/client";

export interface SearchFilters {
  categories?: ActivityCategory[];
  regions?: string[];
  difficulties?: DifficultyLevel[];
  durations?: Duration[];
  priceMin?: number;
  priceMax?: number;
  minRating?: number;
}

export interface SearchParams {
  query?: string;
  filters?: SearchFilters;
  page?: number;
  limit?: number;
}

export interface SearchResult {
  services: Array<{
    id: string;
    slug: string;
    title: string;
    description: string;
    category: ActivityCategory;
    difficulty: DifficultyLevel;
    duration: Duration;
    priceBase: number;
    rating: number | null;
    reviewCount: number;
    coverImage: string | null;
    region: {
      id: string;
      name: string;
      slug: string;
    };
    comuna: {
      id: string;
      name: string;
      slug: string;
    };
  }>;
  total: number;
  page: number;
  totalPages: number;
}

/**
 * Search services with full-text search and filters
 */
export async function searchServices({
  query = "",
  filters = {},
  page = 1,
  limit = 12,
}: SearchParams): Promise<SearchResult> {
  const offset = (page - 1) * limit;

  // Build WHERE clause for filters
  const whereConditions: string[] = [
    `s.status = 'APPROVED'::"ServiceStatus"`,
    `s.verified = true`,
  ];

  const params: any[] = [];
  let paramIndex = 1;

  // Category filter
  if (filters.categories && filters.categories.length > 0) {
    const categoryPlaceholders = filters.categories.map(() => `$${paramIndex++}`).join(", ");
    whereConditions.push(`s.category::text IN (${categoryPlaceholders})`);
    params.push(...filters.categories);
  }

  // Region filter
  if (filters.regions && filters.regions.length > 0) {
    const regionPlaceholders = filters.regions.map(() => `$${paramIndex++}`).join(", ");
    whereConditions.push(`s."regionId" IN (${regionPlaceholders})`);
    params.push(...filters.regions);
  }

  // Difficulty filter
  if (filters.difficulties && filters.difficulties.length > 0) {
    const difficultyPlaceholders = filters.difficulties.map(() => `$${paramIndex++}`).join(", ");
    whereConditions.push(`s.difficulty::text IN (${difficultyPlaceholders})`);
    params.push(...filters.difficulties);
  }

  // Duration filter
  if (filters.durations && filters.durations.length > 0) {
    const durationPlaceholders = filters.durations.map(() => `$${paramIndex++}`).join(", ");
    whereConditions.push(`s.duration::text IN (${durationPlaceholders})`);
    params.push(...filters.durations);
  }

  // Price range filter
  if (filters.priceMin !== undefined) {
    whereConditions.push(`s."priceBase" >= $${paramIndex++}`);
    params.push(filters.priceMin);
  }

  if (filters.priceMax !== undefined) {
    whereConditions.push(`s."priceBase" <= $${paramIndex++}`);
    params.push(filters.priceMax);
  }

  // Rating filter
  if (filters.minRating !== undefined) {
    whereConditions.push(`s.rating >= $${paramIndex++}`);
    params.push(filters.minRating);
  }

  const whereClause = whereConditions.join(" AND ");

  // Build search query
  let searchQuery: string;
  let orderBy: string;

  if (query && query.trim()) {
    // Full-text search with ranking
    const searchTerm = query.trim();
    params.push(searchTerm);
    const searchParamIndex = paramIndex++;

    searchQuery = `
      SELECT
        s.id,
        s.slug,
        s.title,
        s.description,
        s.category::text as category,
        s.difficulty::text as difficulty,
        s.duration::text as duration,
        s."priceBase" as "priceBase",
        s.rating,
        s."reviewCount" as "reviewCount",
        s."coverImage" as "coverImage",
        r.id as "region_id",
        r.name as "region_name",
        r.slug as "region_slug",
        c.id as "comuna_id",
        c.name as "comuna_name",
        c.slug as "comuna_slug",
        ts_rank_cd(
          to_tsvector('spanish', unaccent(s.title || ' ' || s.description)),
          websearch_to_tsquery('spanish', unaccent($${searchParamIndex}))
        ) + (COALESCE(s.rating, 0) * 0.1) as rank
      FROM "Service" s
      INNER JOIN "Region" r ON s."regionId" = r.id
      INNER JOIN "Comuna" c ON s."comunaId" = c.id
      WHERE ${whereClause}
        AND to_tsvector('spanish', unaccent(s.title || ' ' || s.description)) @@
            websearch_to_tsquery('spanish', unaccent($${searchParamIndex}))
      ORDER BY rank DESC, s."createdAt" DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;

    params.push(limit, offset);
    orderBy = "rank DESC, s.\"createdAt\" DESC";
  } else {
    // No search query, just filter and sort
    searchQuery = `
      SELECT
        s.id,
        s.slug,
        s.title,
        s.description,
        s.category::text as category,
        s.difficulty::text as difficulty,
        s.duration::text as duration,
        s."priceBase" as "priceBase",
        s.rating,
        s."reviewCount" as "reviewCount",
        s."coverImage" as "coverImage",
        r.id as "region_id",
        r.name as "region_name",
        r.slug as "region_slug",
        c.id as "comuna_id",
        c.name as "comuna_name",
        c.slug as "comuna_slug"
      FROM "Service" s
      INNER JOIN "Region" r ON s."regionId" = r.id
      INNER JOIN "Comuna" c ON s."comunaId" = c.id
      WHERE ${whereClause}
      ORDER BY s.featured DESC, s.rating DESC NULLS LAST, s."createdAt" DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;

    params.push(limit, offset);
    orderBy = "s.featured DESC, s.rating DESC NULLS LAST, s.\"createdAt\" DESC";
  }

  // Execute search query
  const services = await prisma.$queryRawUnsafe<any[]>(searchQuery, ...params);

  // Get total count with same filters
  // For count query, we need all params except limit and offset (last 2)
  const countParams = params.slice(0, -2);

  // Build count query with correct parameter indices
  let countParamIndex = 1;
  const countWhereConditions: string[] = [
    `s.status = 'APPROVED'::"ServiceStatus"`,
    `s.verified = true`,
  ];

  // Add the same filters
  if (filters.categories && filters.categories.length > 0) {
    const categoryPlaceholders = filters.categories.map(() => `$${countParamIndex++}`).join(", ");
    countWhereConditions.push(`s.category::text IN (${categoryPlaceholders})`);
  }

  if (filters.regions && filters.regions.length > 0) {
    const regionPlaceholders = filters.regions.map(() => `$${countParamIndex++}`).join(", ");
    countWhereConditions.push(`s."regionId" IN (${regionPlaceholders})`);
  }

  if (filters.difficulties && filters.difficulties.length > 0) {
    const difficultyPlaceholders = filters.difficulties.map(() => `$${countParamIndex++}`).join(", ");
    countWhereConditions.push(`s.difficulty::text IN (${difficultyPlaceholders})`);
  }

  if (filters.durations && filters.durations.length > 0) {
    const durationPlaceholders = filters.durations.map(() => `$${countParamIndex++}`).join(", ");
    countWhereConditions.push(`s.duration::text IN (${durationPlaceholders})`);
  }

  // Add search condition if query exists
  if (query && query.trim()) {
    countWhereConditions.push(
      `to_tsvector('spanish', unaccent(s.title || ' ' || s.description)) @@ websearch_to_tsquery('spanish', unaccent($${countParamIndex}))`
    );
  }

  const countWhereClause = countWhereConditions.join(" AND ");
  const countQuery = `
    SELECT COUNT(*) as count
    FROM "Service" s
    WHERE ${countWhereClause}
  `;

  const [{ count }] = await prisma.$queryRawUnsafe<[{ count: bigint }]>(
    countQuery,
    ...countParams
  );

  const total = Number(count);
  const totalPages = Math.ceil(total / limit);

  // Transform results
  const transformedServices = services.map((s) => ({
    id: s.id,
    slug: s.slug,
    title: s.title,
    description: s.description,
    category: s.category as ActivityCategory,
    difficulty: s.difficulty as DifficultyLevel,
    duration: s.duration as Duration,
    priceBase: s.priceBase,
    rating: s.rating,
    reviewCount: s.reviewCount,
    coverImage: s.coverImage,
    region: {
      id: s.region_id,
      name: s.region_name,
      slug: s.region_slug,
    },
    comuna: {
      id: s.comuna_id,
      name: s.comuna_name,
      slug: s.comuna_slug,
    },
  }));

  return {
    services: transformedServices,
    total,
    page,
    totalPages,
  };
}

/**
 * Get available filter options from the database
 */
export async function getFilterOptions() {
  const [regions, categories, difficulties, durations] = await Promise.all([
    // Get regions with service count
    prisma.$queryRaw<
      Array<{ id: string; name: string; slug: string; count: bigint }>
    >`
      SELECT r.id, r.name, r.slug, COUNT(s.id)::int as count
      FROM "Region" r
      LEFT JOIN "Service" s ON s."regionId" = r.id AND s.status = 'APPROVED' AND s.verified = true
      GROUP BY r.id, r.name, r.slug
      HAVING COUNT(s.id) > 0
      ORDER BY r."order", r.name
    `,

    // Get available categories
    prisma.$queryRaw<Array<{ category: string; count: bigint }>>`
      SELECT category::text, COUNT(*)::int as count
      FROM "Service"
      WHERE status = 'APPROVED' AND verified = true
      GROUP BY category
      ORDER BY count DESC
    `,

    // Get available difficulties
    prisma.$queryRaw<Array<{ difficulty: string; count: bigint }>>`
      SELECT difficulty::text, COUNT(*)::int as count
      FROM "Service"
      WHERE status = 'APPROVED' AND verified = true
      GROUP BY difficulty
      ORDER BY
        CASE difficulty::text
          WHEN 'PRINCIPIANTE' THEN 1
          WHEN 'BASICO' THEN 2
          WHEN 'INTERMEDIO' THEN 3
          WHEN 'AVANZADO' THEN 4
          WHEN 'EXPERTO' THEN 5
        END
    `,

    // Get available durations
    prisma.$queryRaw<Array<{ duration: string; count: bigint }>>`
      SELECT duration::text, COUNT(*)::int as count
      FROM "Service"
      WHERE status = 'APPROVED' AND verified = true
      GROUP BY duration
      ORDER BY
        CASE duration::text
          WHEN 'MEDIO_DIA' THEN 1
          WHEN 'DIA_COMPLETO' THEN 2
          WHEN 'MULTI_DIA' THEN 3
        END
    `,
  ]);

  return {
    regions: regions.map((r) => ({
      id: r.id,
      name: r.name,
      slug: r.slug,
      count: Number(r.count),
    })),
    categories: categories.map((c) => ({
      value: c.category as ActivityCategory,
      count: Number(c.count),
    })),
    difficulties: difficulties.map((d) => ({
      value: d.difficulty as DifficultyLevel,
      count: Number(d.count),
    })),
    durations: durations.map((d) => ({
      value: d.duration as Duration,
      count: Number(d.count),
    })),
  };
}

/**
 * Get price range from available services
 */
export async function getPriceRange() {
  const result = await prisma.$queryRaw<
    Array<{ min: number; max: number }>
  >`
    SELECT
      MIN("priceBase")::int as min,
      MAX("priceBase")::int as max
    FROM "Service"
    WHERE status = 'APPROVED' AND verified = true
  `;

  return result[0] || { min: 0, max: 1000000 };
}
