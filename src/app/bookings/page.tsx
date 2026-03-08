"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { BookOpen, Plus, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

interface Booking {
    bookingId: number;
    bookingDate: string;
    status: string;
    price: number;
    superBookingId: number | null;
    customer: { cusId: number; fname: string; lname: string; email: string };
}

interface Flight { fid: number; fnumber: string; departureCity: string; arrivalCity: string }
interface Customer { cusId: number; fname: string; lname: string; email: string }

const bookingStatusColors: Record<string, string> = {
    Paid: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    Cancelled: "bg-red-500/15 text-red-400 border-red-500/30",
    Changed: "bg-amber-500/15 text-amber-400 border-amber-500/30",
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
        setBookings(b);
        setFlights(f);
        setCustomers(c);
        setLoading(false);
    }

    useEffect(() => { fetchData(); }, []);

    async function handleCreate(e: React.FormEvent) {
        e.preventDefault();
        const res = await fetch("/api/bookings", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                cusId: parseInt(form.cusId),
                fid: parseInt(form.fid),
                price: parseFloat(form.price),
                status: form.status,
            }),
        });
        if (res.ok) {
            toast.success("Booking created successfully");
            setOpen(false);
            setForm({ cusId: "", fid: "", price: "", status: "Paid" });
            fetchData();
        } else {
            const err = await res.json();
            toast.error(typeof err.error === "string" ? err.error : "Failed to create booking");
        }
    }

    async function updateBookingStatus(id: number, status: string) {
        const res = await fetch(`/api/bookings/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status }),
        });
        if (res.ok) {
            toast.success(`Booking status updated to ${status}`);
            fetchData();
        } else {
            toast.error("Failed to update status");
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Booking System</h1>
                    <p className="mt-1 text-muted-foreground">
                        Manage flight reservations and track payments
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="icon" onClick={fetchData} className="border-border/40">
                        <RefreshCw className="h-4 w-4" />
                    </Button>
                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-gradient-to-r from-amber-500 to-orange-600 shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40">
                                <Plus className="mr-2 h-4 w-4" /> New Booking
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="border-border/40 bg-card/95 backdrop-blur-xl">
                            <DialogHeader>
                                <DialogTitle>Create New Booking</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleCreate} className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Customer</Label>
                                    <Select value={form.cusId} onValueChange={(v) => setForm({ ...form, cusId: v })}>
                                        <SelectTrigger><SelectValue placeholder="Select customer" /></SelectTrigger>
                                        <SelectContent>
                                            {customers.map((c) => (
                                                <SelectItem key={c.cusId} value={String(c.cusId)}>
                                                    {c.fname} {c.lname} ({c.email})
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Flight</Label>
                                    <Select value={form.fid} onValueChange={(v) => setForm({ ...form, fid: v })}>
                                        <SelectTrigger><SelectValue placeholder="Select flight" /></SelectTrigger>
                                        <SelectContent>
                                            {flights.map((f) => (
                                                <SelectItem key={f.fid} value={String(f.fid)}>
                                                    {f.fnumber} — {f.departureCity} → {f.arrivalCity}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Price (₹)</Label>
                                        <Input type="number" step="0.01" placeholder="5500.00" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Status</Label>
                                        <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Paid">Paid</SelectItem>
                                                <SelectItem value="Cancelled">Cancelled</SelectItem>
                                                <SelectItem value="Changed">Changed</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <Button type="submit" className="w-full bg-gradient-to-r from-amber-500 to-orange-600">
                                    Create Booking
                                </Button>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <BookOpen className="h-5 w-5 text-amber-500" />
                        All Bookings ({bookings.length})
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="space-y-3">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="h-12 animate-pulse rounded-lg bg-muted" />
                            ))}
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow className="border-border/40 hover:bg-transparent">
                                    <TableHead>Booking ID</TableHead>
                                    <TableHead>Customer</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Price</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Update Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {bookings.map((b) => (
                                    <TableRow key={b.bookingId} className="border-border/40">
                                        <TableCell className="font-mono text-muted-foreground">#{b.bookingId}</TableCell>
                                        <TableCell className="font-semibold">{b.customer.fname} {b.customer.lname}</TableCell>
                                        <TableCell className="text-muted-foreground">
                                            {format(new Date(b.bookingDate), "dd MMM yyyy")}
                                        </TableCell>
                                        <TableCell className="font-semibold">₹{b.price.toLocaleString()}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className={bookingStatusColors[b.status]}>
                                                {b.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Select value={b.status} onValueChange={(v) => updateBookingStatus(b.bookingId, v)}>
                                                <SelectTrigger className="h-8 w-32 border-border/40">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Paid">Paid</SelectItem>
                                                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                                                    <SelectItem value="Changed">Changed</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
