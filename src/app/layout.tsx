import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { Plane } from "lucide-react";
import SidebarNav from "@/components/sidebar-nav";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "SkyOps — Flight Management System",
  description: "A full-stack flight management dashboard with real-time data",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans antialiased`}>
        <div className="flex min-h-screen">
          {/* Sidebar */}
          <aside className="fixed left-0 top-0 z-40 h-screen w-64 flex flex-col"
            style={{
              background: "linear-gradient(180deg, oklch(0.11 0.018 260) 0%, oklch(0.09 0.015 260) 100%)",
              borderRight: "1px solid oklch(1 0 0 / 6%)",
            }}>

            {/* Sidebar ambient glow */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-r-none">
              <div className="absolute -top-20 -left-20 h-60 w-60 rounded-full opacity-20"
                style={{ background: "radial-gradient(circle, oklch(0.65 0.22 250), transparent 70%)", filter: "blur(40px)" }} />
            </div>

            {/* Logo */}
            <div className="relative flex h-16 items-center gap-3 px-5"
              style={{ borderBottom: "1px solid oklch(1 0 0 / 6%)" }}>
              <div className="relative flex h-9 w-9 items-center justify-center rounded-xl"
                style={{
                  background: "linear-gradient(135deg, oklch(0.65 0.22 220), oklch(0.55 0.22 270))",
                  boxShadow: "0 0 20px oklch(0.65 0.22 220 / 40%)",
                }}>
                <Plane className="h-4 w-4 text-white" />
              </div>
              <div>
                <h1 className="text-base font-bold tracking-tight"
                  style={{ background: "linear-gradient(135deg, #e0eaff, #a5b4fc)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  SkyOps
                </h1>
                <p className="text-[9px] font-semibold uppercase tracking-[0.18em]" style={{ color: "oklch(0.35 0.015 260)" }}>
                  Flight Management
                </p>
              </div>
            </div>

            {/* Sidebar nav (client component with active state) */}
            <SidebarNav />

            {/* Bottom badge */}
            <div className="relative p-4">
              <div className="rounded-xl p-3" style={{ background: "oklch(0.15 0.015 260)", border: "1px solid oklch(1 0 0 / 6%)" }}>
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"
                      style={{ background: "oklch(0.70 0.18 160)" }} />
                    <span className="relative inline-flex h-2 w-2 rounded-full"
                      style={{ background: "oklch(0.65 0.18 160)" }} />
                  </span>
                  <span className="text-xs font-semibold" style={{ color: "oklch(0.70 0.18 160)" }}>Connected to Supabase</span>
                </div>
                <p className="mt-0.5 text-[10px]" style={{ color: "oklch(0.40 0.015 260)" }}>PostgreSQL · Live Data</p>
              </div>
            </div>
          </aside>

          {/* Main content */}
          <main className="ml-64 flex-1 min-h-screen"
            style={{ background: "linear-gradient(135deg, oklch(0.10 0.012 260) 0%, oklch(0.08 0.010 270) 50%, oklch(0.10 0.012 250) 100%)" }}>
            {/* Animated grid overlay */}
            <div className="animated-grid pointer-events-none fixed inset-0 ml-64 opacity-40" />

            {/* Ambient orbs */}
            <div className="pointer-events-none fixed inset-0 ml-64 overflow-hidden">
              <div className="absolute top-1/4 right-1/4 h-96 w-96 rounded-full opacity-[0.07]"
                style={{ background: "radial-gradient(circle, oklch(0.65 0.22 250), transparent 70%)", filter: "blur(60px)" }} />
              <div className="absolute bottom-1/3 left-1/3 h-64 w-64 rounded-full opacity-[0.04]"
                style={{ background: "radial-gradient(circle, oklch(0.60 0.22 300), transparent 70%)", filter: "blur(50px)" }} />
            </div>

            <div className="relative z-10 p-8">
              {children}
            </div>
          </main>
        </div>

        <Toaster
          richColors
          position="top-right"
          toastOptions={{
            style: {
              background: "oklch(0.145 0.015 260)",
              border: "1px solid oklch(1 0 0 / 10%)",
              color: "oklch(0.97 0.005 260)",
            },
          }}
        />
      </body>
    </html>
  );
}
