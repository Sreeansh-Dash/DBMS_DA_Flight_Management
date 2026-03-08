import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { flightStatusSchema } from "@/lib/validations";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const flight = await prisma.flight.findUnique({
            where: { fid: parseInt(id) },
            include: {
                worksOn: { include: { staff: true } },
                flightCustomers: { include: { customer: true } },
            },
        });
        if (!flight) return NextResponse.json({ error: "Flight not found" }, { status: 404 });
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
        const flight = await prisma.flight.update({
            where: { fid: parseInt(id) },
            data,
        });
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
        await prisma.flight.delete({ where: { fid: parseInt(id) } });
        return NextResponse.json({ message: "Flight deleted" });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete flight" }, { status: 500 });
    }
}
