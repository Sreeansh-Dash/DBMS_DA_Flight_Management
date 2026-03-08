import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { bookingSchema, bookingStatusSchema } from "@/lib/validations";

export async function GET() {
    try {
        const bookings = await prisma.booking.findMany({
            include: {
                customer: true,
                superBooking: true,
            },
            orderBy: { createdAt: "desc" },
        });
        return NextResponse.json(bookings);
    } catch (error: any) {
        console.error("GET Bookings Error:", error);
        return NextResponse.json({ error: "Failed to fetch bookings: " + (error?.message || String(error)) }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const data = bookingSchema.parse(body);

        // Also add flight-customer mapping
        const booking = await prisma.$transaction(async (tx) => {
            const newBooking = await tx.booking.create({
                data: {
                    cusId: data.cusId,
                    price: data.price,
                    status: data.status || "Paid",
                    superBookingId: data.superBookingId || null,
                },
                include: { customer: true },
            });

            // Create FlightCustomer mapping if it doesn't exist
            await tx.flightCustomer.upsert({
                where: {
                    fid_cusId: { fid: data.fid, cusId: data.cusId },
                },
                update: {},
                create: { fid: data.fid, cusId: data.cusId },
            });

            return newBooking;
        });

        return NextResponse.json(booking, { status: 201 });
    } catch (error: any) {
        return NextResponse.json(
            { error: error.errors || error.message || "Failed to create booking" },
            { status: 400 }
        );
    }
}
