import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { bookingStatusSchema } from "@/lib/validations";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const body = await req.json();
        const data = bookingStatusSchema.parse(body);
        const booking = await prisma.booking.update({
            where: { bookingId: parseInt(id) },
            data,
            include: { customer: true },
        });
        return NextResponse.json(booking);
    } catch (error: any) {
        return NextResponse.json(
            { error: error.errors || error.message || "Failed to update booking" },
            { status: 400 }
        );
    }
}
