import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const staff = await prisma.flightStaff.findUnique({
            where: { staffId: parseInt(id) },
            include: {
                dependents: true,
                worksOn: { include: { flight: true } },
            },
        });
        if (!staff) return NextResponse.json({ error: "Staff not found" }, { status: 404 });
        return NextResponse.json(staff);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch staff" }, { status: 500 });
    }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const body = await req.json();
        const staff = await prisma.flightStaff.update({
            where: { staffId: parseInt(id) },
            data: body,
            include: { dependents: true, worksOn: { include: { flight: true } } },
        });
        return NextResponse.json(staff);
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || "Failed to update staff" },
            { status: 400 }
        );
    }
}
