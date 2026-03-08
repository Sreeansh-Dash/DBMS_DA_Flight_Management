import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { worksOnSchema } from "@/lib/validations";

export async function GET() {
    try {
        const assignments = await prisma.worksOn.findMany({
            include: {
                flight: true,
                staff: true,
            },
        });
        return NextResponse.json(assignments);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch assignments" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const data = worksOnSchema.parse(body);
        const assignment = await prisma.worksOn.upsert({
            where: {
                fid_staffId: { fid: data.fid, staffId: data.staffId },
            },
            update: { hours: data.hours },
            create: data,
            include: { flight: true, staff: true },
        });
        return NextResponse.json(assignment, { status: 201 });
    } catch (error: any) {
        return NextResponse.json(
            { error: error.errors || error.message || "Failed to create assignment" },
            { status: 400 }
        );
    }
}
