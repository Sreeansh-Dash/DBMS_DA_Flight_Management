import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const customer = await prisma.customer.findUnique({
            where: { cusId: parseInt(id) },
            include: {
                frequentFlyer: true,
                regularCustomer: true,
                passport: true,
                bookings: true,
                flightCustomers: { include: { flight: true } },
            },
        });
        if (!customer) return NextResponse.json({ error: "Customer not found" }, { status: 404 });
        return NextResponse.json(customer);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch customer" }, { status: 500 });
    }
}
