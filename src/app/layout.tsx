import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import Link from "next/link";
import { Plane, Users, BookOpen, UserCog, LayoutDashboard } from "lucide-react";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "SkyOps — Flight Management System",
  description: "A full-stack flight management dashboard with real-time data",
};

const navItems = [
  { href: "/", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/flights", icon: Plane, label: "Flights" },
  { href: "/customers", icon: Users, label: "Customers" },
  { href: "/bookings", icon: BookOpen, label: "Bookings" },
  { href: "/staff", icon: UserCog, label: "Staff" },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans antialiased`}>
        <div className="flex min-h-screen">
          {/* Sidebar */}
          <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-border/40 bg-card/50 backdrop-blur-xl">
            <div className="flex h-16 items-center gap-3 border-b border-border/40 px-6">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-sky-500 to-blue-600 shadow-lg shadow-sky-500/25">
                <Plane className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold tracking-tight">SkyOps</h1>
                <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
                  Flight Management
                </p>
              </div>
            </div>
            <nav className="mt-6 space-y-1 px-3">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-all duration-200 hover:bg-accent hover:text-foreground"
                >
                  <item.icon className="h-4.5 w-4.5 transition-colors" />
                  {item.label}
                </Link>
              ))}
            </nav>
          </aside>

          {/* Main content */}
          <main className="ml-64 flex-1">
            <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/20 p-8">
              {children}
            </div>
          </main>
        </div>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
