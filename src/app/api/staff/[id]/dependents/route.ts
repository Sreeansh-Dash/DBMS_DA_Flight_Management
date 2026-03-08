import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { dependentSchema } from "@/lib/validations";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const body = await req.json();
        const data = dependentSchema.parse(body);
        const dependent = await prisma.dependent.create({
            data: {
                staffId: parseInt(id),
                name: data.name,
                relationship: data.relationship,
                dob: new Date(data.dob),
                contact: data.contact,
            },
        });
        return NextResponse.json(dependent, { status: 201 });
    } catch (error: any) {
        return NextResponse.json(
            { error: error.errors || error.message || "Failed to add dependent" },
            { status: 400 }
        );
    }
}
