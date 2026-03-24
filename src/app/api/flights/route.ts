import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { flightSchema } from "@/lib/validations";

export async function GET() {
    try {
        const flightIdentifications = await prisma.flightIdentification.findMany({
            include: {
                details: true,
                worksOn: { include: { staff: true } },
                flightCustomers: { include: { customer: true } },
            },
            orderBy: { createdAt: "desc" },
        });

        // Flatten for frontend compatibility
        const flights = flightIdentifications.map(fi => ({
            fid: fi.fid,
            fnumber: fi.fnumber,
            status: fi.status,
            totalSeats: fi.details.totalSeats,
            arrivalCity: fi.details.arrivalCity,
            departureCity: fi.details.departureCity,
            createdAt: fi.createdAt,
            updatedAt: fi.updatedAt,
            worksOn: fi.worksOn,
            flightCustomers: fi.flightCustomers
        }));

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

        // 1. Ensure FlightDetails exists (upsert)
        await prisma.flightDetails.upsert({
            where: { fnumber: data.fnumber },
            update: {
                totalSeats: data.totalSeats,
                arrivalCity: data.arrivalCity,
                departureCity: data.departureCity,
            },
            create: {
                fnumber: data.fnumber,
                totalSeats: data.totalSeats,
                arrivalCity: data.arrivalCity,
                departureCity: data.departureCity,
            },
        });

        // 2. Create FlightIdentification
        const flightIdentification = await prisma.flightIdentification.create({
            data: {
                fnumber: data.fnumber,
                status: data.status,
            },
            include: { details: true }
        });

        // Flatten for frontend
        const flight = {
            fid: flightIdentification.fid,
            fnumber: flightIdentification.fnumber,
            status: flightIdentification.status,
            totalSeats: flightIdentification.details.totalSeats,
            arrivalCity: flightIdentification.details.arrivalCity,
            departureCity: flightIdentification.details.departureCity,
        };

        return NextResponse.json(flight, { status: 201 });
    } catch (error: any) {
        return NextResponse.json(
            { error: error.errors || error.message || "Failed to create flight" },
            { status: 400 }
        );
    }
}

