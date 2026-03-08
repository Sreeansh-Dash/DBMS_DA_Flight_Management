import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { flightSchema } from "@/lib/validations";

export async function GET() {
    try {
        const flights = await prisma.flight.findMany({
            include: {
                worksOn: { include: { staff: true } },
                flightCustomers: { include: { customer: true } },
            },
            orderBy: { createdAt: "desc" },
        });
        return NextResponse.json(flights);
    } catch (error: any) {
        console.error("GET Flights Error:", error);
        return NextResponse.json({ error: "Failed to fetch flights: " + (error?.message || String(error)) }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const data = flightSchema.parse(body);
        const flight = await prisma.flight.create({ data });
        return NextResponse.json(flight, { status: 201 });
    } catch (error: any) {
        return NextResponse.json(
            { error: error.errors || error.message || "Failed to create flight" },
            { status: 400 }
        );
    }
}
