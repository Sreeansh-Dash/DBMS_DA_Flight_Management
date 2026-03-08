import { z } from "zod";

// ─── Flight ───────────────────────────────────────────

export const flightSchema = z.object({
    fnumber: z.string().min(1, "Flight number is required"),
    totalSeats: z.coerce.number().int().positive("Seats must be positive"),
    arrivalCity: z.string().min(1, "Arrival city is required"),
    departureCity: z.string().min(1, "Departure city is required"),
    status: z.enum(["Arrived", "Cancelled", "Departed", "Delayed"]),
});

export const flightStatusSchema = z.object({
    status: z.enum(["Arrived", "Cancelled", "Departed", "Delayed"]),
});

// ─── Customer ─────────────────────────────────────────

export const customerSchema = z.object({
    fname: z.string().min(1, "First name is required"),
    lname: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email"),
    dob: z.string().min(1, "Date of birth is required"),
    customerType: z.enum(["frequent", "regular"]),
    // Frequent flyer fields
    mileagePoints: z.coerce.number().int().min(0).optional(),
    loyaltyTier: z.string().optional(),
    // Regular customer fields
    travelFrequency: z.coerce.number().int().min(0).optional(),
    preferredAirline: z.string().optional(),
    // Passport fields
    passportNo: z.string().min(1, "Passport number is required"),
    country: z.string().min(1, "Country is required"),
    issueDate: z.string().min(1, "Issue date is required"),
    expiryDate: z.string().min(1, "Expiry date is required"),
});

export const passportDateSchema = z.object({
    expiryDate: z.string().refine(
        (date) => new Date(date) > new Date(),
        "Expiry date must be in the future"
    ),
});

// ─── Booking ──────────────────────────────────────────

export const bookingSchema = z.object({
    cusId: z.coerce.number().int().positive(),
    fid: z.coerce.number().int().positive(),
    price: z.coerce.number().positive("Price must be positive"),
    status: z.enum(["Paid", "Cancelled", "Changed"]).default("Paid"),
    superBookingId: z.coerce.number().int().positive().optional().nullable(),
});

export const bookingStatusSchema = z.object({
    status: z.enum(["Paid", "Cancelled", "Changed"]),
});

// ─── Staff ────────────────────────────────────────────

export const staffSchema = z.object({
    firstN: z.string().min(1, "First name is required"),
    lastN: z.string().min(1, "Last name is required"),
    role: z.string().min(1, "Role is required"),
    email: z.string().email("Invalid email"),
});

// ─── Dependent ────────────────────────────────────────

export const dependentSchema = z.object({
    name: z.string().min(1, "Name is required"),
    relationship: z.string().min(1, "Relationship is required"),
    dob: z.string().min(1, "Date of birth is required"),
    contact: z.string().min(1, "Contact is required"),
});

// ─── WorksOn ──────────────────────────────────────────

export const worksOnSchema = z.object({
    fid: z.coerce.number().int().positive(),
    staffId: z.coerce.number().int().positive(),
    hours: z.coerce.number().min(0, "Hours must be non-negative"),
});
