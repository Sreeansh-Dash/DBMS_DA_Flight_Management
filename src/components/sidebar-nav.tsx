"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Plane, Users, BookOpen, UserCog, LayoutDashboard } from "lucide-react";

const navItems = [
    { href: "/", icon: LayoutDashboard, label: "Dashboard", color: "oklch(0.70 0.22 220)" },
    { href: "/flights", icon: Plane, label: "Flights", color: "oklch(0.70 0.22 220)" },
    { href: "/customers", icon: Users, label: "Customers", color: "oklch(0.65 0.20 280)" },
    { href: "/bookings", icon: BookOpen, label: "Bookings", color: "oklch(0.75 0.18 60)" },
    { href: "/staff", icon: UserCog, label: "Staff", color: "oklch(0.70 0.18 160)" },
];

export default function SidebarNav() {
    const pathname = usePathname();

    return (
        <nav className="relative mt-4 flex-1 space-y-0.5 px-3">
            <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-widest"
                style={{ color: "oklch(0.35 0.015 260)" }}>
                Navigation
            </p>
            {navItems.map((item) => {
                const active = pathname === item.href;
                return (
                    <Link key={item.href} href={item.href}>
                        <div className="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 cursor-pointer"
                            style={{
                                background: active ? `${item.color.replace(")", " / 10%)")}` : "transparent",
                                color: active ? item.color : "oklch(0.50 0.015 260)",
                                borderLeft: active ? `2px solid ${item.color}` : "2px solid transparent",
                                paddingLeft: active ? "10px" : "12px",
                            }}>
                            <div className={`flex h-7 w-7 items-center justify-center rounded-lg transition-all duration-200 ${active ? "scale-110" : "group-hover:scale-105"}`}
                                style={{ background: active ? `${item.color.replace(")", " / 15%)")}` : "oklch(0.18 0.015 260)" }}>
                                <item.icon className="h-3.5 w-3.5" style={{ color: active ? item.color : "oklch(0.45 0.015 260)" }} />
                            </div>
                            <span style={{ color: active ? item.color : "inherit" }}>{item.label}</span>
                        </div>
                    </Link>
                );
            })}
        </nav>
    );
}
