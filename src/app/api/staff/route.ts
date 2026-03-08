import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { staffSchema } from "@/lib/validations";

export async function GET() {
    try {
        const staff = await prisma.flightStaff.findMany({
            include: {
                dependents: true,
                worksOn: { include: { flight: true } },
            },
            orderBy: { createdAt: "desc" },
        });
        return NextResponse.json(staff);
    } catch (error: any) {
        console.error("GET Staff Error:", error);
        return NextResponse.json({ error: "Failed to fetch staff: " + (error?.message || String(error)) }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const data = staffSchema.parse(body);
        const staff = await prisma.flightStaff.create({
            data,
            include: { dependents: true },
        });
        return NextResponse.json(staff, { status: 201 });
    } catch (error: any) {
        return NextResponse.json(
            { error: error.errors || error.message || "Failed to create staff" },
            { status: 400 }
        );
    }
}
