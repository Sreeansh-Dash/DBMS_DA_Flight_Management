import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    console.log("🌱 Seeding database...");

    // Clean existing data
    await prisma.flightCustomer.deleteMany();
    await prisma.worksOn.deleteMany();
    await prisma.booking.deleteMany();
    await prisma.passport.deleteMany();
    await prisma.dependent.deleteMany();
    await prisma.frequentFlyer.deleteMany();
    await prisma.regularCustomer.deleteMany();
    await prisma.customer.deleteMany();
    await prisma.flightStaff.deleteMany();
    await prisma.flightIdentification.deleteMany();
    await prisma.flightDetails.deleteMany();

    // ─── Flight Details ────────────────────────────────────
    const flightDetailsData = [
        { fnumber: "AI-101", totalSeats: 180, arrivalCity: "Mumbai", departureCity: "Delhi" },
        { fnumber: "6E-205", totalSeats: 220, arrivalCity: "Bangalore", departureCity: "Chennai" },
        { fnumber: "SG-312", totalSeats: 150, arrivalCity: "Kolkata", departureCity: "Hyderabad" },
        { fnumber: "UK-478", totalSeats: 200, arrivalCity: "Delhi", departureCity: "Pune" },
        { fnumber: "AI-890", totalSeats: 300, arrivalCity: "London", departureCity: "Delhi" },
        { fnumber: "6E-550", totalSeats: 180, arrivalCity: "Goa", departureCity: "Mumbai" },
        { fnumber: "SG-777", totalSeats: 160, arrivalCity: "Jaipur", departureCity: "Delhi" },
        { fnumber: "UK-900", totalSeats: 250, arrivalCity: "Singapore", departureCity: "Chennai" },
    ];

    await Promise.all(flightDetailsData.map(data => 
        prisma.flightDetails.create({ data })
    ));

    console.log(`✅ Created ${flightDetailsData.length} flight details`);

    // ─── Flight Identifications ──────────────────────────
    const flights = await Promise.all([
        prisma.flightIdentification.create({ data: { fnumber: "AI-101", status: "Departed" } }),
        prisma.flightIdentification.create({ data: { fnumber: "6E-205", status: "Arrived" } }),
        prisma.flightIdentification.create({ data: { fnumber: "SG-312", status: "Delayed" } }),
        prisma.flightIdentification.create({ data: { fnumber: "UK-478", status: "Cancelled" } }),
        prisma.flightIdentification.create({ data: { fnumber: "AI-890", status: "Departed" } }),
        prisma.flightIdentification.create({ data: { fnumber: "6E-550", status: "Arrived" } }),
        prisma.flightIdentification.create({ data: { fnumber: "SG-777", status: "Delayed" } }),
        prisma.flightIdentification.create({ data: { fnumber: "UK-900", status: "Departed" } }),
    ]);

    console.log(`✅ Created ${flights.length} flight identifications`);

    console.log(`✅ Created ${flights.length} flights`);

    // ─── Customers (Frequent Flyers) ──────────────────────
    const customer1 = await prisma.customer.create({
        data: {
            fname: "Arjun",
            lname: "Sharma",
            email: "arjun.sharma@email.com",
            dob: new Date("1990-05-15"),
            frequentFlyer: {
                create: { mileagePoints: 45000, loyaltyTier: "Gold" },
            },
            passport: {
                create: {
                    pno: "J1234567",
                    country: "India",
                    issueDate: new Date("2020-01-10"),
                    expiryDate: new Date("2030-01-10"),
                },
            },
        },
    });

    const customer2 = await prisma.customer.create({
        data: {
            fname: "Priya",
            lname: "Patel",
            email: "priya.patel@email.com",
            dob: new Date("1985-11-20"),
            frequentFlyer: {
                create: { mileagePoints: 72000, loyaltyTier: "Platinum" },
            },
            passport: {
                create: {
                    pno: "K9876543",
                    country: "India",
                    issueDate: new Date("2019-06-22"),
                    expiryDate: new Date("2029-06-22"),
                },
            },
        },
    });

    const customer3 = await prisma.customer.create({
        data: {
            fname: "Vikram",
            lname: "Reddy",
            email: "vikram.reddy@email.com",
            dob: new Date("1988-03-08"),
            frequentFlyer: {
                create: { mileagePoints: 120000, loyaltyTier: "Diamond" },
            },
            passport: {
                create: {
                    pno: "L5551234",
                    country: "India",
                    issueDate: new Date("2021-09-01"),
                    expiryDate: new Date("2031-09-01"),
                },
            },
        },
    });

    // ─── Customers (Regular) ──────────────────────────────
    const customer4 = await prisma.customer.create({
        data: {
            fname: "Sneha",
            lname: "Gupta",
            email: "sneha.gupta@email.com",
            dob: new Date("1995-07-12"),
            regularCustomer: {
                create: { travelFrequency: 3, preferredAirline: "IndiGo" },
            },
            passport: {
                create: {
                    pno: "M3332211",
                    country: "India",
                    issueDate: new Date("2022-03-15"),
                    expiryDate: new Date("2032-03-15"),
                },
            },
        },
    });

    const customer5 = await prisma.customer.create({
        data: {
            fname: "Rahul",
            lname: "Verma",
            email: "rahul.verma@email.com",
            dob: new Date("1992-12-25"),
            regularCustomer: {
                create: { travelFrequency: 1, preferredAirline: "Air India" },
            },
            passport: {
                create: {
                    pno: "N7778899",
                    country: "India",
                    issueDate: new Date("2023-01-05"),
                    expiryDate: new Date("2033-01-05"),
                },
            },
        },
    });

    const customer6 = await prisma.customer.create({
        data: {
            fname: "Meera",
            lname: "Nair",
            email: "meera.nair@email.com",
            dob: new Date("1998-09-30"),
            regularCustomer: {
                create: { travelFrequency: 5, preferredAirline: "Vistara" },
            },
            passport: {
                create: {
                    pno: "O1122334",
                    country: "India",
                    issueDate: new Date("2021-07-20"),
                    expiryDate: new Date("2031-07-20"),
                },
            },
        },
    });

    console.log("✅ Created 6 customers (3 frequent, 3 regular)");

    // ─── Flight Staff ─────────────────────────────────────
    const staff = await Promise.all([
        prisma.flightStaff.create({
            data: {
                firstN: "Rajesh",
                lastN: "Kumar",
                role: "Pilot",
                email: "rajesh.kumar@airline.com",
                dependents: {
                    create: [
                        {
                            name: "Anita Kumar",
                            relationship: "Spouse",
                            dob: new Date("1988-04-12"),
                            contact: "+91-9876543210",
                        },
                        {
                            name: "Rohan Kumar",
                            relationship: "Son",
                            dob: new Date("2015-08-20"),
                            contact: "+91-9876543211",
                        },
                    ],
                },
            },
        }),
        prisma.flightStaff.create({
            data: {
                firstN: "Sunita",
                lastN: "Desai",
                role: "Flight Attendant",
                email: "sunita.desai@airline.com",
                dependents: {
                    create: [
                        {
                            name: "Deepak Desai",
                            relationship: "Spouse",
                            dob: new Date("1985-11-30"),
                            contact: "+91-9988776655",
                        },
                    ],
                },
            },
        }),
        prisma.flightStaff.create({
            data: {
                firstN: "Amit",
                lastN: "Singh",
                role: "Co-Pilot",
                email: "amit.singh@airline.com",
                dependents: {
                    create: [
                        {
                            name: "Kavita Singh",
                            relationship: "Mother",
                            dob: new Date("1960-02-14"),
                            contact: "+91-9112233445",
                        },
                    ],
                },
            },
        }),
        prisma.flightStaff.create({
            data: {
                firstN: "Neha",
                lastN: "Joshi",
                role: "Flight Attendant",
                email: "neha.joshi@airline.com",
            },
        }),
    ]);

    console.log(`✅ Created ${staff.length} staff members with dependents`);

    // ─── WorksOn (Staff ↔ Flight assignments) ─────────────
    await Promise.all([
        prisma.worksOn.create({ data: { fid: flights[0].fid, staffId: staff[0].staffId, hours: 4.5 } }),
        prisma.worksOn.create({ data: { fid: flights[0].fid, staffId: staff[1].staffId, hours: 4.5 } }),
        prisma.worksOn.create({ data: { fid: flights[1].fid, staffId: staff[0].staffId, hours: 3.0 } }),
        prisma.worksOn.create({ data: { fid: flights[1].fid, staffId: staff[2].staffId, hours: 3.0 } }),
        prisma.worksOn.create({ data: { fid: flights[2].fid, staffId: staff[1].staffId, hours: 5.0 } }),
        prisma.worksOn.create({ data: { fid: flights[2].fid, staffId: staff[3].staffId, hours: 5.0 } }),
        prisma.worksOn.create({ data: { fid: flights[4].fid, staffId: staff[0].staffId, hours: 9.5 } }),
        prisma.worksOn.create({ data: { fid: flights[4].fid, staffId: staff[2].staffId, hours: 9.5 } }),
    ]);

    console.log("✅ Created works-on assignments");

    // ─── Flight-Customer (M:N) ────────────────────────────
    await Promise.all([
        prisma.flightCustomer.create({ data: { fid: flights[0].fid, cusId: customer1.cusId } }),
        prisma.flightCustomer.create({ data: { fid: flights[0].fid, cusId: customer4.cusId } }),
        prisma.flightCustomer.create({ data: { fid: flights[1].fid, cusId: customer2.cusId } }),
        prisma.flightCustomer.create({ data: { fid: flights[1].fid, cusId: customer5.cusId } }),
        prisma.flightCustomer.create({ data: { fid: flights[2].fid, cusId: customer3.cusId } }),
        prisma.flightCustomer.create({ data: { fid: flights[4].fid, cusId: customer1.cusId } }),
        prisma.flightCustomer.create({ data: { fid: flights[4].fid, cusId: customer6.cusId } }),
    ]);

    console.log("✅ Created flight-customer mappings");

    // ─── Bookings ─────────────────────────────────────────
    await Promise.all([
        prisma.booking.create({
            data: { cusId: customer1.cusId, bookingDate: new Date("2026-02-20"), status: "Paid", price: 5500.0 },
        }),
        prisma.booking.create({
            data: { cusId: customer2.cusId, bookingDate: new Date("2026-02-22"), status: "Paid", price: 4200.0 },
        }),
        prisma.booking.create({
            data: { cusId: customer3.cusId, bookingDate: new Date("2026-02-25"), status: "Changed", price: 6800.0 },
        }),
        prisma.booking.create({
            data: { cusId: customer4.cusId, bookingDate: new Date("2026-03-01"), status: "Paid", price: 3900.0 },
        }),
        prisma.booking.create({
            data: { cusId: customer5.cusId, bookingDate: new Date("2026-03-03"), status: "Cancelled", price: 4500.0 },
        }),
        prisma.booking.create({
            data: { cusId: customer6.cusId, bookingDate: new Date("2026-03-05"), status: "Paid", price: 12500.0 },
        }),
    ]);

    console.log("✅ Created 6 bookings");
    console.log("🎉 Seeding complete!");
}

main()
    .catch((e) => {
        console.error("❌ Seed error:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
