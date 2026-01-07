import { z } from "zod";

/**
 * Validation schemas for checkout flow
 */

// Step 1: Service Details & Add-ons
export const checkoutStep1Schema = z.object({
  serviceId: z.string().min(1, "Service ID is required"),
  date: z.string().min(1, "Date is required"),
  participants: z.number().min(1, "At least 1 participant required"),
  addOns: z.array(z.string()).optional().default([]),
  acceptedPolicies: z.boolean().refine((val) => val === true, {
    message: "You must accept the cancellation policies",
  }),
});

export type CheckoutStep1Input = z.infer<typeof checkoutStep1Schema>;

// Step 2: User Details
export const checkoutStep2Schema = z.object({
  // Authentication
  isGuest: z.boolean(),
  email: z.string().email("Invalid email address"),

  // Phone verification
  phone: z.string().min(9, "Phone number must be at least 9 digits"),
  phoneVerified: z.boolean().refine((val) => val === true, {
    message: "Phone number must be verified",
  }),

  // Personal details
  fullName: z.string().min(2, "Full name is required"),
  dietaryRestrictions: z.string().optional(),
  specialConsiderations: z.string().optional(),
});

export type CheckoutStep2Input = z.infer<typeof checkoutStep2Schema>;

// Phone verification
export const phoneVerificationSchema = z.object({
  phone: z.string().min(9),
  code: z.string().length(6, "Code must be 6 digits"),
});

export type PhoneVerificationInput = z.infer<typeof phoneVerificationSchema>;

// Complete booking creation
export const createBookingSchema = z.object({
  // Service details
  serviceId: z.string().min(1),
  serviceDate: z.date(),
  participants: z.number().min(1),

  // Add-ons
  addOnIds: z.array(z.string()).optional().default([]),

  // User details
  userId: z.string().optional(), // Optional if guest
  guestEmail: z.string().email().optional(),
  guestPhone: z.string().optional(),
  guestName: z.string().optional(),

  // Additional info
  dietaryRestrictions: z.string().optional(),
  specialConsiderations: z.string().optional(),

  // Pricing
  totalAmount: z.number().min(0),

  // Policies acceptance
  acceptedPolicies: z.boolean().refine((val) => val === true),
});

export type CreateBookingInput = z.infer<typeof createBookingSchema>;

// Calculate total
export const calculateTotalSchema = z.object({
  serviceId: z.string().min(1),
  participants: z.number().min(1),
  addOnIds: z.array(z.string()).optional().default([]),
});

export type CalculateTotalInput = z.infer<typeof calculateTotalSchema>;
