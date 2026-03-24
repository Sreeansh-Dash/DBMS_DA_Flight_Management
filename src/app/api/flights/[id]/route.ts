import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { flightStatusSchema } from "@/lib/validations";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const fi = await prisma.flightIdentification.findUnique({
            where: { fid: parseInt(id) },
            include: {
                details: true,
                worksOn: { include: { staff: true } },
                flightCustomers: { include: { customer: true } },
            },
        });
        if (!fi) return NextResponse.json({ error: "Flight not found" }, { status: 404 });

        // Flatten for frontend
        const flight = {
            fid: fi.fid,
            fnumber: fi.fnumber,
            status: fi.status,
            totalSeats: fi.details.totalSeats,
            arrivalCity: fi.details.arrivalCity,
            departureCity: fi.details.departureCity,
            worksOn: fi.worksOn,
            flightCustomers: fi.flightCustomers
        };

        return NextResponse.json(flight);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch flight" }, { status: 500 });
    }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const body = await req.json();
        const data = flightStatusSchema.parse(body);
        const fi = await prisma.flightIdentification.update({
            where: { fid: parseInt(id) },
            data,
            include: { details: true }
        });

        // Flatten for frontend
        const flight = {
            fid: fi.fid,
            fnumber: fi.fnumber,
            status: fi.status,
            totalSeats: fi.details.totalSeats,
            arrivalCity: fi.details.arrivalCity,
            departureCity: fi.details.departureCity,
        };

        return NextResponse.json(flight);
    } catch (error: any) {
        return NextResponse.json(
            { error: error.errors || error.message || "Failed to update flight" },
            { status: 400 }
        );
    }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        await prisma.flightIdentification.delete({ where: { fid: parseInt(id) } });
        return NextResponse.json({ message: "Flight deleted" });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete flight" }, { status: 500 });
    }
}
