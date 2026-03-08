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
import { Plane, Plus, RefreshCw } from "lucide-react";
import { toast } from "sonner";

interface Flight {
    fid: number;
    fnumber: string;
    totalSeats: number;
    arrivalCity: string;
    departureCity: string;
    status: string;
}

const statusColors: Record<string, string> = {
    Arrived: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    Departed: "bg-sky-500/15 text-sky-400 border-sky-500/30",
    Delayed: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    Cancelled: "bg-red-500/15 text-red-400 border-red-500/30",
};

export default function FlightsPage() {
    const [flights, setFlights] = useState<Flight[]>([]);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [form, setForm] = useState({
        fnumber: "", totalSeats: "", arrivalCity: "", departureCity: "", status: "Departed",
    });

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
            toast.success(`Flight status updated to ${status}`);
            fetchFlights();
        } else {
            toast.error("Failed to update status");
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Flight Dashboard</h1>
                    <p className="mt-1 text-muted-foreground">
                        Monitor and manage all scheduled flights
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="icon" onClick={fetchFlights} className="border-border/40">
                        <RefreshCw className="h-4 w-4" />
                    </Button>
                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-gradient-to-r from-sky-500 to-blue-600 shadow-lg shadow-sky-500/25 hover:shadow-sky-500/40">
                                <Plus className="mr-2 h-4 w-4" /> Add Flight
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="border-border/40 bg-card/95 backdrop-blur-xl">
                            <DialogHeader>
                                <DialogTitle>Create New Flight</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleCreate} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Flight Number</Label>
                                        <Input placeholder="AI-101" value={form.fnumber} onChange={(e) => setForm({ ...form, fnumber: e.target.value })} required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Total Seats</Label>
                                        <Input type="number" placeholder="180" value={form.totalSeats} onChange={(e) => setForm({ ...form, totalSeats: e.target.value })} required />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Departure City</Label>
                                        <Input placeholder="Delhi" value={form.departureCity} onChange={(e) => setForm({ ...form, departureCity: e.target.value })} required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Arrival City</Label>
                                        <Input placeholder="Mumbai" value={form.arrivalCity} onChange={(e) => setForm({ ...form, arrivalCity: e.target.value })} required />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Status</Label>
                                    <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Departed">Departed</SelectItem>
                                            <SelectItem value="Arrived">Arrived</SelectItem>
                                            <SelectItem value="Delayed">Delayed</SelectItem>
                                            <SelectItem value="Cancelled">Cancelled</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <Button type="submit" className="w-full bg-gradient-to-r from-sky-500 to-blue-600">
                                    Create Flight
                                </Button>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Plane className="h-5 w-5 text-sky-500" />
                        All Flights ({flights.length})
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
                                    <TableHead>FID</TableHead>
                                    <TableHead>Flight No</TableHead>
                                    <TableHead>Departure</TableHead>
                                    <TableHead>Arrival</TableHead>
                                    <TableHead>Seats</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Update Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {flights.map((f) => (
                                    <TableRow key={f.fid} className="border-border/40">
                                        <TableCell className="font-mono text-muted-foreground">#{f.fid}</TableCell>
                                        <TableCell className="font-semibold">{f.fnumber}</TableCell>
                                        <TableCell>{f.departureCity}</TableCell>
                                        <TableCell>{f.arrivalCity}</TableCell>
                                        <TableCell>{f.totalSeats}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className={statusColors[f.status]}>
                                                {f.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Select value={f.status} onValueChange={(v) => updateStatus(f.fid, v)}>
                                                <SelectTrigger className="h-8 w-32 border-border/40">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Departed">Departed</SelectItem>
                                                    <SelectItem value="Arrived">Arrived</SelectItem>
                                                    <SelectItem value="Delayed">Delayed</SelectItem>
                                                    <SelectItem value="Cancelled">Cancelled</SelectItem>
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
