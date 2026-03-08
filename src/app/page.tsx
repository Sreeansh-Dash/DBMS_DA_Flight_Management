"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plane, Users, BookOpen, UserCog, TrendingUp, ArrowUpRight, Sparkles } from "lucide-react";

interface Stats {
  flights: number;
  customers: number;
  bookings: number;
  staff: number;
}

const cards = [
  {
    title: "Total Flights",
    key: "flights" as keyof Stats,
    icon: Plane,
    href: "/flights",
    gradient: "from-sky-500 to-blue-600",
    glow: "0 0 30px oklch(0.65 0.22 220 / 25%)",
    border: "oklch(0.65 0.22 220 / 20%)",
    iconBg: "oklch(0.65 0.22 220 / 12%)",
    iconColor: "oklch(0.75 0.20 220)",
    delay: 0,
  },
  {
    title: "Customers",
    key: "customers" as keyof Stats,
    icon: Users,
    href: "/customers",
    gradient: "from-violet-500 to-purple-600",
    glow: "0 0 30px oklch(0.60 0.22 280 / 25%)",
    border: "oklch(0.60 0.22 280 / 20%)",
    iconBg: "oklch(0.60 0.22 280 / 12%)",
    iconColor: "oklch(0.70 0.22 280)",
    delay: 100,
  },
  {
    title: "Bookings",
    key: "bookings" as keyof Stats,
    icon: BookOpen,
    href: "/bookings",
    gradient: "from-amber-500 to-orange-600",
    glow: "0 0 30px oklch(0.70 0.18 60 / 25%)",
    border: "oklch(0.70 0.18 60 / 20%)",
    iconBg: "oklch(0.70 0.18 60 / 12%)",
    iconColor: "oklch(0.75 0.18 60)",
    delay: 200,
  },
  {
    title: "Crew Members",
    key: "staff" as keyof Stats,
    icon: UserCog,
    href: "/staff",
    gradient: "from-emerald-500 to-green-600",
    glow: "0 0 30px oklch(0.65 0.18 160 / 25%)",
    border: "oklch(0.65 0.18 160 / 20%)",
    iconBg: "oklch(0.65 0.18 160 / 12%)",
    iconColor: "oklch(0.70 0.18 160)",
    delay: 300,
  },
];

const schemaItems = [
  { model: "Flight", desc: "FID, fnumber, seats, cities, status", badge: "Primary", color: "oklch(0.65 0.22 220)" },
  { model: "Customer", desc: "CusID, name, email, DOB", badge: "Primary", color: "oklch(0.60 0.22 280)" },
  { model: "FrequentFlyer", desc: "Mileage points, loyalty tier", badge: "1:1 Subtype", color: "oklch(0.65 0.22 220)" },
  { model: "RegularCustomer", desc: "Travel frequency, preferred airline", badge: "1:1 Subtype", color: "oklch(0.60 0.22 280)" },
  { model: "Passport", desc: "PNo, country, issue/expiry dates", badge: "1:1", color: "oklch(0.70 0.18 60)" },
  { model: "Booking", desc: "ID, date, status, price", badge: "1:N", color: "oklch(0.70 0.18 60)" },
  { model: "FlightStaff", desc: "StaffID, name, role, email", badge: "Primary", color: "oklch(0.65 0.18 160)" },
  { model: "Dependent", desc: "Name, relationship, DOB, contact", badge: "Weak Entity", color: "oklch(0.65 0.18 160)" },
  { model: "WorksOn", desc: "Flight-Staff mapping + hours", badge: "M:N Join", color: "oklch(0.65 0.22 220)" },
  { model: "FlightCustomer", desc: "Flight-Customer mapping", badge: "M:N Join", color: "oklch(0.60 0.22 280)" },
];

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
          flights: Array.isArray(flights) ? flights.length : 0,
          customers: Array.isArray(customers) ? customers.length : 0,
          bookings: Array.isArray(bookings) ? bookings.length : 0,
          staff: Array.isArray(staff) ? staff.length : 0,
        });
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="animate-fade-in-up">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5" style={{ color: "oklch(0.75 0.20 220)" }} />
          <span className="text-sm font-medium" style={{ color: "oklch(0.65 0.20 220)" }}>Live System</span>
        </div>
        <h1 className="mt-1 text-4xl font-bold tracking-tight gradient-text">Dashboard</h1>
        <p className="mt-1 text-sm" style={{ color: "oklch(0.55 0.015 260)" }}>
          Welcome to SkyOps — your full-stack flight operations center
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <Link key={card.title} href={card.href}>
            <div
              className="card-hover animate-fade-in-up group relative overflow-hidden rounded-2xl p-5 cursor-pointer"
              style={{
                background: "oklch(0.145 0.015 260 / 70%)",
                border: `1px solid ${card.border}`,
                backdropFilter: "blur(20px)",
                animationDelay: `${card.delay}ms`,
                transition: "box-shadow 0.3s ease, border-color 0.3s ease",
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = card.glow; (e.currentTarget as HTMLDivElement).style.borderColor = card.border.replace("20%", "40%"); }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = "none"; (e.currentTarget as HTMLDivElement).style.borderColor = card.border; }}
            >
              {/* Background gradient on hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"
                style={{ background: `linear-gradient(135deg, ${card.border.replace("20%", "8%")}, transparent)` }} />

              <div className="relative flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-widest" style={{ color: "oklch(0.50 0.015 260)" }}>
                    {card.title}
                  </p>
                  {loading ? (
                    <div className="skeleton mt-2 h-10 w-16" />
                  ) : (
                    <p className="stat-number mt-1 text-4xl font-bold text-slate-100">
                      {stats[card.key]}
                    </p>
                  )}
                  <div className="mt-2 flex items-center gap-1 text-xs font-medium" style={{ color: card.iconColor }}>
                    <ArrowUpRight className="h-3 w-3" />
                    <span>View all</span>
                  </div>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
                  style={{ background: card.iconBg }}>
                  <card.icon className="h-5 w-5" style={{ color: card.iconColor }} />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Bottom Grid */}
      <div className="grid gap-6 lg:grid-cols-5">
        {/* System Overview — 3 cols */}
        <div className="animate-fade-in-up animate-delay-400 lg:col-span-3 rounded-2xl p-6"
          style={{ background: "oklch(0.145 0.015 260 / 70%)", border: "1px solid oklch(1 0 0 / 8%)", backdropFilter: "blur(20px)" }}>
          <div className="flex items-center gap-2 mb-5">
            <TrendingUp className="h-4 w-4" style={{ color: "oklch(0.65 0.22 220)" }} />
            <h2 className="font-semibold text-slate-200">System Overview</h2>
          </div>
          <div className="space-y-3">
            {[
              { title: "Flight Management", desc: "Track all scheduled flights, monitor status updates (Arrived, Departed, Delayed, Cancelled), and manage seat capacity.", color: "oklch(0.65 0.22 220)", dot: "oklch(0.70 0.20 220)" },
              { title: "Customer & Passport Portal", desc: "Register customers with passport validation, manage Frequent Flyer and Regular Customer profiles with loyalty tiers.", color: "oklch(0.60 0.22 280)", dot: "oklch(0.65 0.20 280)" },
              { title: "Booking System", desc: "Create and manage flight reservations, track payment status (Paid, Cancelled, Changed), and handle super-bookings.", color: "oklch(0.70 0.18 60)", dot: "oklch(0.75 0.18 60)" },
              { title: "Staff Management", desc: "Manage flight crew assignments, track working hours, and maintain emergency contact information for dependents.", color: "oklch(0.65 0.18 160)", dot: "oklch(0.70 0.18 160)" },
            ].map((item, i) => (
              <div key={i} className="group flex gap-3 rounded-xl p-3 transition-all duration-200 hover:scale-[1.01]"
                style={{ background: "oklch(0.18 0.015 260)", border: "1px solid oklch(1 0 0 / 5%)" }}>
                <div className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center">
                  <div className="pulse-dot h-2.5 w-2.5 rounded-full" style={{ background: item.dot }} />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-200">{item.title}</h3>
                  <p className="mt-0.5 text-xs leading-relaxed" style={{ color: "oklch(0.50 0.015 260)" }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Schema — 2 cols */}
        <div className="animate-fade-in-up animate-delay-400 lg:col-span-2 rounded-2xl p-6"
          style={{ background: "oklch(0.145 0.015 260 / 70%)", border: "1px solid oklch(1 0 0 / 8%)", backdropFilter: "blur(20px)" }}>
          <h2 className="mb-4 font-semibold text-slate-200">Database Schema</h2>
          <div className="space-y-1.5">
            {schemaItems.map((item) => (
              <div key={item.model} className="flex items-center justify-between rounded-lg px-3 py-2 transition-all duration-150 hover:scale-[1.01]"
                style={{ background: "oklch(0.18 0.015 260)" }}>
                <span className="text-xs font-semibold text-slate-300">{item.model}</span>
                <span className="rounded-full px-2 py-0.5 text-[10px] font-semibold"
                  style={{ background: `${item.color.replace(")", " / 12%)")}`, color: item.color }}>
                  {item.badge}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
