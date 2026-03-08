"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plane, Users, BookOpen, UserCog, TrendingUp, ArrowUpRight } from "lucide-react";

interface Stats {
  flights: number;
  customers: number;
  bookings: number;
  staff: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats>({ flights: 0, customers: 0, bookings: 0, staff: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [flights, customers, bookings, staff] = await Promise.all([
          fetch("/api/flights").then((r) => r.json()),
          fetch("/api/customers").then((r) => r.json()),
          fetch("/api/bookings").then((r) => r.json()),
          fetch("/api/staff").then((r) => r.json()),
        ]);
        setStats({
          flights: flights.length,
          customers: customers.length,
          bookings: bookings.length,
          staff: staff.length,
        });
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  const cards = [
    {
      title: "Total Flights",
      value: stats.flights,
      icon: Plane,
      gradient: "from-sky-500 to-blue-600",
      shadow: "shadow-sky-500/25",
      bg: "bg-sky-500/10",
    },
    {
      title: "Customers",
      value: stats.customers,
      icon: Users,
      gradient: "from-violet-500 to-purple-600",
      shadow: "shadow-violet-500/25",
      bg: "bg-violet-500/10",
    },
    {
      title: "Bookings",
      value: stats.bookings,
      icon: BookOpen,
      gradient: "from-amber-500 to-orange-600",
      shadow: "shadow-amber-500/25",
      bg: "bg-amber-500/10",
    },
    {
      title: "Crew Members",
      value: stats.staff,
      icon: UserCog,
      gradient: "from-emerald-500 to-green-600",
      shadow: "shadow-emerald-500/25",
      bg: "bg-emerald-500/10",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="mt-1 text-muted-foreground">
          Welcome to SkyOps Flight Management System
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <Card
            key={card.title}
            className="group relative overflow-hidden border-border/40 bg-card/50 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 transition-opacity duration-300 group-hover:opacity-5`} />
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {card.title}
              </CardTitle>
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${card.bg}`}>
                <card.icon className={`h-5 w-5 bg-gradient-to-br ${card.gradient} bg-clip-text text-transparent`} style={{ stroke: "url(#grad)" }} />
                <card.icon className={`absolute h-5 w-5 text-sky-500 opacity-0`} />
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="h-9 w-20 animate-pulse rounded-lg bg-muted" />
              ) : (
                <div className="flex items-baseline gap-2">
                  <p className="text-3xl font-bold">{card.value}</p>
                  <ArrowUpRight className="h-4 w-4 text-emerald-500" />
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Info */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <TrendingUp className="h-5 w-5 text-sky-500" />
              System Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg bg-accent/50 p-4">
              <h3 className="font-semibold">Flight Management</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Track all scheduled flights, monitor status updates (Arrived, Departed, Delayed, Cancelled), and manage seat capacity.
              </p>
            </div>
            <div className="rounded-lg bg-accent/50 p-4">
              <h3 className="font-semibold">Customer & Passport Portal</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Register customers with passport validation, manage Frequent Flyer and Regular Customer profiles with loyalty tiers.
              </p>
            </div>
            <div className="rounded-lg bg-accent/50 p-4">
              <h3 className="font-semibold">Booking System</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Create and manage flight reservations, track payment status (Paid, Cancelled, Changed), and handle super-bookings.
              </p>
            </div>
            <div className="rounded-lg bg-accent/50 p-4">
              <h3 className="font-semibold">Staff Management</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Manage flight crew assignments, track working hours, and maintain emergency contact information for dependents.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg">Database Schema</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              {[
                { model: "Flight", desc: "FID, fnumber, seats, cities, status", badge: "Primary" },
                { model: "Customer", desc: "CusID, name, email, DOB", badge: "Primary" },
                { model: "FrequentFlyer", desc: "Mileage points, loyalty tier", badge: "1:1 Subtype" },
                { model: "RegularCustomer", desc: "Travel frequency, preferred airline", badge: "1:1 Subtype" },
                { model: "Passport", desc: "PNo, country, issue/expiry dates", badge: "1:1" },
                { model: "Booking", desc: "ID, date, status, price", badge: "1:N" },
                { model: "FlightStaff", desc: "StaffID, name, role, email", badge: "Primary" },
                { model: "Dependent", desc: "Name, relationship, DOB, contact", badge: "Weak Entity" },
                { model: "WorksOn", desc: "Flight-Staff mapping + hours", badge: "M:N Join" },
                { model: "FlightCustomer", desc: "Flight-Customer mapping", badge: "M:N Join" },
              ].map((item) => (
                <div key={item.model} className="flex items-center justify-between rounded-lg bg-accent/30 px-3 py-2">
                  <div>
                    <span className="font-medium">{item.model}</span>
                    <span className="ml-2 text-muted-foreground">{item.desc}</span>
                  </div>
                  <span className="rounded-full bg-sky-500/10 px-2 py-0.5 text-xs font-medium text-sky-400">
                    {item.badge}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
