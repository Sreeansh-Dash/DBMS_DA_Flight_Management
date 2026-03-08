"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
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
import { Plane, Plus, RefreshCw, ArrowRight } from "lucide-react";
import { toast } from "sonner";

interface Flight {
    fid: number;
    fnumber: string;
    totalSeats: number;
    arrivalCity: string;
    departureCity: string;
    status: string;
}

const statusConfig: Record<string, { label: string; bg: string; color: string; dot: string }> = {
    Arrived: { label: "Arrived", bg: "oklch(0.65 0.18 160 / 12%)", color: "oklch(0.70 0.18 160)", dot: "oklch(0.68 0.18 160)" },
    Departed: { label: "Departed", bg: "oklch(0.65 0.22 220 / 12%)", color: "oklch(0.70 0.22 220)", dot: "oklch(0.68 0.22 220)" },
    Delayed: { label: "Delayed", bg: "oklch(0.70 0.18 60 / 12%)", color: "oklch(0.75 0.18 60)", dot: "oklch(0.73 0.18 60)" },
    Cancelled: { label: "Cancelled", bg: "oklch(0.65 0.20 25 / 12%)", color: "oklch(0.70 0.20 25)", dot: "oklch(0.68 0.20 25)" },
};

export default function FlightsPage() {
    const [flights, setFlights] = useState<Flight[]>([]);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [form, setForm] = useState({ fnumber: "", totalSeats: "", arrivalCity: "", departureCity: "", status: "Departed" });

    async function fetchFlights() {
        setLoading(true);
        const res = await fetch("/api/flights");
        const data = await res.json();
        setFlights(data);
        setLoading(false);
    }

    useEffect(() => { fetchFlights(); }, []);

    async function handleCreate(e: React.FormEvent) {
        e.preventDefault();
        const res = await fetch("/api/flights", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...form, totalSeats: parseInt(form.totalSeats) }),
        });
        if (res.ok) {
            toast.success("Flight created successfully");
            setOpen(false);
            setForm({ fnumber: "", totalSeats: "", arrivalCity: "", departureCity: "", status: "Departed" });
            fetchFlights();
        } else {
            const err = await res.json();
            toast.error(typeof err.error === "string" ? err.error : "Validation failed");
        }
    }

    async function updateStatus(fid: number, status: string) {
        const res = await fetch(`/api/flights/${fid}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status }),
        });
        if (res.ok) {
            toast.success(`Status → ${status}`);
            fetchFlights();
        } else toast.error("Failed to update status");
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="animate-fade-in-up flex items-end justify-between">
                <div>
                    <div className="flex items-center gap-2">
                        <Plane className="h-4 w-4" style={{ color: "oklch(0.70 0.22 220)" }} />
                        <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "oklch(0.65 0.20 220)" }}>
                            Operations
                        </span>
                    </div>
                    <h1 className="mt-0.5 text-3xl font-bold tracking-tight gradient-text">Flight Dashboard</h1>
                    <p className="mt-1 text-sm" style={{ color: "oklch(0.50 0.015 260)" }}>
                        Monitor and manage all scheduled flights
                    </p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={fetchFlights}
                        className="flex h-9 w-9 items-center justify-center rounded-xl transition-all duration-200 hover:scale-110 active:scale-95"
                        style={{ background: "oklch(0.18 0.015 260)", border: "1px solid oklch(1 0 0 / 8%)" }}
                    >
                        <RefreshCw className="h-4 w-4" style={{ color: "oklch(0.60 0.015 260)" }} />
                    </button>

                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger asChild>
                            <button className="btn-shine flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-white transition-all duration-200 hover:scale-105 hover:shadow-lg active:scale-95"
                                style={{
                                    background: "linear-gradient(135deg, oklch(0.65 0.22 220), oklch(0.55 0.22 250))",
                                    boxShadow: "0 4px 15px oklch(0.65 0.22 220 / 30%)",
                                }}>
                                <Plus className="h-4 w-4" /> Add Flight
                            </button>
                        </DialogTrigger>
                        <DialogContent className="border-0 sm:max-w-md" style={{ background: "oklch(0.14 0.015 260)", border: "1px solid oklch(1 0 0 / 10%)", boxShadow: "0 25px 50px oklch(0 0 0 / 60%)" }}>
                            <DialogHeader>
                                <DialogTitle className="text-lg font-bold text-slate-100">Create New Flight</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleCreate} className="space-y-4 mt-2">
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1.5">
                                        <Label className="text-xs text-slate-400">Flight Number</Label>
                                        <Input placeholder="AI-101" value={form.fnumber} onChange={(e) => setForm({ ...form, fnumber: e.target.value })} required
                                            className="rounded-xl" style={{ background: "oklch(0.18 0.015 260)", border: "1px solid oklch(1 0 0 / 8%)" }} />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-xs text-slate-400">Total Seats</Label>
                                        <Input type="number" placeholder="180" value={form.totalSeats} onChange={(e) => setForm({ ...form, totalSeats: e.target.value })} required
                                            className="rounded-xl" style={{ background: "oklch(0.18 0.015 260)", border: "1px solid oklch(1 0 0 / 8%)" }} />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1.5">
                                        <Label className="text-xs text-slate-400">Departure</Label>
                                        <Input placeholder="Delhi" value={form.departureCity} onChange={(e) => setForm({ ...form, departureCity: e.target.value })} required
                                            className="rounded-xl" style={{ background: "oklch(0.18 0.015 260)", border: "1px solid oklch(1 0 0 / 8%)" }} />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-xs text-slate-400">Arrival</Label>
                                        <Input placeholder="Mumbai" value={form.arrivalCity} onChange={(e) => setForm({ ...form, arrivalCity: e.target.value })} required
                                            className="rounded-xl" style={{ background: "oklch(0.18 0.015 260)", border: "1px solid oklch(1 0 0 / 8%)" }} />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-xs text-slate-400">Status</Label>
                                    <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                                        <SelectTrigger className="rounded-xl" style={{ background: "oklch(0.18 0.015 260)", border: "1px solid oklch(1 0 0 / 8%)" }}>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent style={{ background: "oklch(0.16 0.015 260)", border: "1px solid oklch(1 0 0 / 10%)" }}>
                                            {Object.keys(statusConfig).map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <button type="submit" className="btn-shine w-full rounded-xl py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                                    style={{ background: "linear-gradient(135deg, oklch(0.65 0.22 220), oklch(0.55 0.22 250))", boxShadow: "0 4px 15px oklch(0.65 0.22 220 / 30%)" }}>
                                    Create Flight
                                </button>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Table Card */}
            <div className="animate-fade-in-up animate-delay-100 overflow-hidden rounded-2xl"
                style={{ background: "oklch(0.145 0.015 260 / 70%)", border: "1px solid oklch(1 0 0 / 8%)", backdropFilter: "blur(20px)" }}>
                <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: "1px solid oklch(1 0 0 / 6%)" }}>
                    <div className="flex items-center gap-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded-lg" style={{ background: "oklch(0.65 0.22 220 / 12%)" }}>
                            <Plane className="h-3.5 w-3.5" style={{ color: "oklch(0.70 0.22 220)" }} />
                        </div>
                        <span className="font-semibold text-slate-200">All Flights</span>
                        <span className="rounded-full px-2 py-0.5 text-xs font-medium" style={{ background: "oklch(0.65 0.22 220 / 12%)", color: "oklch(0.70 0.22 220)" }}>
                            {flights.length}
                        </span>
                    </div>
                </div>

                {loading ? (
                    <div className="space-y-px p-4">
                        {[...Array(6)].map((_, i) => <div key={i} className="skeleton h-11 rounded-xl" style={{ animationDelay: `${i * 80}ms` }} />)}
                    </div>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow className="border-0 hover:bg-transparent">
                                {["FID", "Flight No", "Route", "Seats", "Status", "Update Status"].map(h => (
                                    <TableHead key={h} className="text-xs font-semibold uppercase tracking-wider" style={{ color: "oklch(0.45 0.015 260)" }}>{h}</TableHead>
                                ))}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {flights.map((f, i) => {
                                const cfg = statusConfig[f.status] || statusConfig.Departed;
                                return (
                                    <TableRow key={f.fid} className="table-row-hover border-0 transition-all duration-150"
                                        style={{ animationDelay: `${i * 30}ms` }}>
                                        <TableCell className="font-mono text-xs" style={{ color: "oklch(0.40 0.015 260)" }}>#{f.fid}</TableCell>
                                        <TableCell className="font-bold text-slate-100">{f.fnumber}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1.5 text-sm text-slate-300">
                                                <span>{f.departureCity}</span>
                                                <ArrowRight className="h-3 w-3" style={{ color: "oklch(0.45 0.015 260)" }} />
                                                <span>{f.arrivalCity}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-sm text-slate-300">{f.totalSeats}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold w-fit"
                                                style={{ background: cfg.bg, color: cfg.color }}>
                                                <span className="h-1.5 w-1.5 rounded-full" style={{ background: cfg.dot }} />
                                                {cfg.label}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Select value={f.status} onValueChange={(v) => updateStatus(f.fid, v)}>
                                                <SelectTrigger className="h-8 w-36 rounded-lg text-xs" style={{ background: "oklch(0.18 0.015 260)", border: "1px solid oklch(1 0 0 / 8%)" }}>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent style={{ background: "oklch(0.16 0.015 260)", border: "1px solid oklch(1 0 0 / 10%)" }}>
                                                    {Object.keys(statusConfig).map(s => <SelectItem key={s} value={s} className="text-xs">{s}</SelectItem>)}
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
