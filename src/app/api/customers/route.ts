import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { customerSchema } from "@/lib/validations";

export async function GET() {
    try {
        const customers = await prisma.customer.findMany({
            include: {
                frequentFlyer: true,
                regularCustomer: true,
                passport: true,
                bookings: true,
            },
            orderBy: { createdAt: "desc" },
        });
        return NextResponse.json(customers);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch customers" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const data = customerSchema.parse(body);

        // Validate passport expiry date
        if (new Date(data.expiryDate) <= new Date()) {
            return NextResponse.json(
                { error: "Passport expiry date must be in the future" },
                { status: 400 }
            );
        }

        const customer = await prisma.customer.create({
            data: {
                fname: data.fname,
                lname: data.lname,
                email: data.email,
                dob: new Date(data.dob),
                passport: {
                    create: {
                        pno: data.passportNo,
                        country: data.country,
                        issueDate: new Date(data.issueDate),
                        expiryDate: new Date(data.expiryDate),
                    },
                },
                ...(data.customerType === "frequent"
                    ? {
                        frequentFlyer: {
                            create: {
                                mileagePoints: data.mileagePoints || 0,
                                loyaltyTier: data.loyaltyTier || "Silver",
                            },
                        },
                    }
                    : {
                        regularCustomer: {
                            create: {
                                travelFrequency: data.travelFrequency || 0,
                                preferredAirline: data.preferredAirline || "",
                            },
                        },
                    }),
            },
            include: {
                frequentFlyer: true,
                regularCustomer: true,
                passport: true,
            },
        });

        return NextResponse.json(customer, { status: 201 });
    } catch (error: any) {
        return NextResponse.json(
            { error: error.errors || error.message || "Failed to create customer" },
            { status: 400 }
        );
    }
}
