"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { BookOpen, Plus, RefreshCw, IndianRupee } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

interface Booking {
    bookingId: number;
    bookingDate: string;
    status: string;
    price: number;
    customer: { cusId: number; fname: string; lname: string };
}
interface Flight { fid: number; fnumber: string; departureCity: string; arrivalCity: string }
interface Customer { cusId: number; fname: string; lname: string; email: string }

const bookingStatus: Record<string, { bg: string; color: string; dot: string }> = {
    Paid: { bg: "oklch(0.65 0.18 160 / 12%)", color: "oklch(0.70 0.18 160)", dot: "oklch(0.68 0.18 160)" },
    Cancelled: { bg: "oklch(0.65 0.20 25 / 12%)", color: "oklch(0.70 0.20 25)", dot: "oklch(0.68 0.20 25)" },
    Changed: { bg: "oklch(0.70 0.18 60 / 12%)", color: "oklch(0.75 0.18 60)", dot: "oklch(0.73 0.18 60)" },
};

export default function BookingsPage() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [flights, setFlights] = useState<Flight[]>([]);
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [form, setForm] = useState({ cusId: "", fid: "", price: "", status: "Paid" });

    async function fetchData() {
        setLoading(true);
        const [b, f, c] = await Promise.all([
            fetch("/api/bookings").then((r) => r.json()),
            fetch("/api/flights").then((r) => r.json()),
            fetch("/api/customers").then((r) => r.json()),
        ]);
        setBookings(Array.isArray(b) ? b : []);
        setFlights(Array.isArray(f) ? f : []);
        setCustomers(Array.isArray(c) ? c : []);
        setLoading(false);
    }

    useEffect(() => { fetchData(); }, []);

    async function handleCreate(e: React.FormEvent) {
        e.preventDefault();
        const res = await fetch("/api/bookings", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ cusId: parseInt(form.cusId), fid: parseInt(form.fid), price: parseFloat(form.price), status: form.status }),
        });
        if (res.ok) {
            toast.success("Booking created!");
            setOpen(false);
            setForm({ cusId: "", fid: "", price: "", status: "Paid" });
            fetchData();
        } else {
            const err = await res.json();
            toast.error(typeof err.error === "string" ? err.error : "Failed to create booking");
        }
    }

    async function updateStatus(id: number, status: string) {
        const res = await fetch(`/api/bookings/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status }),
        });
        if (res.ok) { toast.success(`Status → ${status}`); fetchData(); }
        else toast.error("Failed to update");
    }

    const totalRevenue = bookings.filter(b => b.status === "Paid").reduce((sum, b) => sum + b.price, 0);

    const inputStyle = { background: "oklch(0.18 0.015 260)", border: "1px solid oklch(1 0 0 / 8%)" };

    return (
        <div className="space-y-6">
            <div className="animate-fade-in-up flex items-end justify-between">
                <div>
                    <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4" style={{ color: "oklch(0.75 0.18 60)" }} />
                        <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "oklch(0.70 0.18 60)" }}>Reservations</span>
                    </div>
                    <h1 className="mt-0.5 text-3xl font-bold tracking-tight" style={{ background: "linear-gradient(135deg, oklch(0.80 0.18 55), oklch(0.70 0.20 30))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                        Booking System
                    </h1>
                    <p className="mt-1 text-sm" style={{ color: "oklch(0.50 0.015 260)" }}>Track reservations and payment status</p>
                </div>
                <div className="flex gap-2">
                    <button onClick={fetchData} className="flex h-9 w-9 items-center justify-center rounded-xl transition-all hover:scale-110 active:scale-95"
                        style={{ background: "oklch(0.18 0.015 260)", border: "1px solid oklch(1 0 0 / 8%)" }}>
                        <RefreshCw className="h-4 w-4" style={{ color: "oklch(0.55 0.015 260)" }} />
                    </button>
                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger
                            className="btn-shine flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-white transition-all hover:scale-105 active:scale-95"
                            style={{ background: "linear-gradient(135deg, oklch(0.70 0.18 55), oklch(0.60 0.20 30))", boxShadow: "0 4px 15px oklch(0.70 0.18 55 / 30%)" }}>
                            <Plus className="h-4 w-4" /> New Booking
                        </DialogTrigger>
                        <DialogContent style={{ background: "oklch(0.14 0.015 260)", border: "1px solid oklch(1 0 0 / 10%)", boxShadow: "0 25px 50px oklch(0 0 0 / 60%)" }}>
                            <DialogHeader>
                                <DialogTitle className="text-lg font-bold text-slate-100">New Booking</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleCreate} className="space-y-4 mt-2">
                                <div className="space-y-1.5">
                                    <Label className="text-xs text-slate-400">Customer</Label>
                                    <Select value={form.cusId} onValueChange={(v) => setForm({ ...form, cusId: v ?? "" })}>
                                        <SelectTrigger className="rounded-xl" style={inputStyle}><SelectValue placeholder="Select customer" /></SelectTrigger>
                                        <SelectContent style={{ background: "oklch(0.16 0.015 260)", border: "1px solid oklch(1 0 0 / 10%)" }}>
                                            {customers.map(c => <SelectItem key={c.cusId} value={String(c.cusId)}>{c.fname} {c.lname}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-xs text-slate-400">Flight</Label>
                                    <Select value={form.fid} onValueChange={(v) => setForm({ ...form, fid: v ?? "" })}>
                                        <SelectTrigger className="rounded-xl" style={inputStyle}><SelectValue placeholder="Select flight" /></SelectTrigger>
                                        <SelectContent style={{ background: "oklch(0.16 0.015 260)", border: "1px solid oklch(1 0 0 / 10%)" }}>
                                            {flights.map(f => <SelectItem key={f.fid} value={String(f.fid)}>{f.fnumber} — {f.departureCity} → {f.arrivalCity}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1.5">
                                        <Label className="text-xs text-slate-400">Price (₹)</Label>
                                        <Input type="number" step="0.01" placeholder="5500" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required className="rounded-xl" style={inputStyle} />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-xs text-slate-400">Status</Label>
                                        <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v ?? "" })}>
                                            <SelectTrigger className="rounded-xl" style={inputStyle}><SelectValue /></SelectTrigger>
                                            <SelectContent style={{ background: "oklch(0.16 0.015 260)", border: "1px solid oklch(1 0 0 / 10%)" }}>
                                                {Object.keys(bookingStatus).map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <button type="submit" className="btn-shine w-full rounded-xl py-2.5 text-sm font-semibold text-white transition-all hover:scale-[1.02] active:scale-[0.98]"
                                    style={{ background: "linear-gradient(135deg, oklch(0.70 0.18 55), oklch(0.60 0.20 30))", boxShadow: "0 4px 15px oklch(0.70 0.18 55 / 30%)" }}>
                                    Create Booking
                                </button>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Revenue Stat */}
            <div className="animate-fade-in-up animate-delay-100 flex items-center gap-4 rounded-2xl p-5"
                style={{ background: "oklch(0.70 0.18 55 / 6%)", border: "1px solid oklch(0.70 0.18 55 / 15%)" }}>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl" style={{ background: "oklch(0.70 0.18 55 / 12%)" }}>
                    <IndianRupee className="h-5 w-5" style={{ color: "oklch(0.75 0.18 60)" }} />
                </div>
                <div>
                    <p className="text-xs font-medium uppercase tracking-wider" style={{ color: "oklch(0.60 0.015 260)" }}>Total Revenue (Paid)</p>
                    <p className="text-2xl font-bold text-slate-100">₹{totalRevenue.toLocaleString()}</p>
                </div>
                <div className="ml-auto text-right">
                    <p className="text-xs" style={{ color: "oklch(0.55 0.015 260)" }}>Total Bookings</p>
                    <p className="text-2xl font-bold text-slate-100">{bookings.length}</p>
                </div>
            </div>

            {/* Table */}
            <div className="animate-fade-in-up animate-delay-200 overflow-hidden rounded-2xl"
                style={{ background: "oklch(0.145 0.015 260 / 70%)", border: "1px solid oklch(1 0 0 / 8%)", backdropFilter: "blur(20px)" }}>
                <div className="flex items-center gap-3 px-6 py-4" style={{ borderBottom: "1px solid oklch(1 0 0 / 6%)" }}>
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg" style={{ background: "oklch(0.70 0.18 60 / 12%)" }}>
                        <BookOpen className="h-3.5 w-3.5" style={{ color: "oklch(0.75 0.18 60)" }} />
                    </div>
                    <span className="font-semibold text-slate-200">All Bookings</span>
                    <span className="rounded-full px-2 py-0.5 text-xs font-medium" style={{ background: "oklch(0.70 0.18 60 / 12%)", color: "oklch(0.75 0.18 60)" }}>
                        {bookings.length}
                    </span>
                </div>

                {loading ? (
                    <div className="space-y-px p-4">
                        {[...Array(6)].map((_, i) => <div key={i} className="skeleton h-11 rounded-xl" style={{ animationDelay: `${i * 80}ms` }} />)}
                    </div>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow className="border-0 hover:bg-transparent">
                                {["ID", "Customer", "Date", "Price", "Status", "Update"].map(h => (
                                    <TableHead key={h} className="text-xs font-semibold uppercase tracking-wider" style={{ color: "oklch(0.45 0.015 260)" }}>{h}</TableHead>
                                ))}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {bookings.map((b, i) => {
                                const cfg = bookingStatus[b.status] || bookingStatus.Paid;
                                return (
                                    <TableRow key={b.bookingId} className="table-row-hover border-0">
                                        <TableCell className="font-mono text-xs" style={{ color: "oklch(0.40 0.015 260)" }}>#{b.bookingId}</TableCell>
                                        <TableCell className="font-semibold text-slate-100">{b.customer.fname} {b.customer.lname}</TableCell>
                                        <TableCell className="text-sm" style={{ color: "oklch(0.55 0.015 260)" }}>
                                            {format(new Date(b.bookingDate), "dd MMM yyyy")}
                                        </TableCell>
                                        <TableCell className="font-semibold text-slate-100">₹{b.price.toLocaleString()}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold w-fit"
                                                style={{ background: cfg.bg, color: cfg.color }}>
                                                <span className="h-1.5 w-1.5 rounded-full" style={{ background: cfg.dot }} />
                                                {b.status}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Select value={b.status} onValueChange={(v) => updateStatus(b.bookingId, v ?? "")}>
                                                <SelectTrigger className="h-8 w-32 rounded-lg text-xs" style={{ background: "oklch(0.18 0.015 260)", border: "1px solid oklch(1 0 0 / 8%)" }}>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent style={{ background: "oklch(0.16 0.015 260)", border: "1px solid oklch(1 0 0 / 10%)" }}>
                                                    {Object.keys(bookingStatus).map(s => <SelectItem key={s} value={s} className="text-xs">{s}</SelectItem>)}
                                                </SelectContent>
                                            </Select>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                )}
            </div>
        </div>
    );
}
