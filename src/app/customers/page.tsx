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
import { Users, Plus, RefreshCw, Star, UserCheck } from "lucide-react";
import { toast } from "sonner";

interface Customer {
    cusId: number;
    fname: string;
    lname: string;
    email: string;
    dob: string;
    frequentFlyer: { mileagePoints: number; loyaltyTier: string } | null;
    regularCustomer: { travelFrequency: number; preferredAirline: string } | null;
    passport: { pno: string; country: string; issueDate: string; expiryDate: string } | null;
}

export default function CustomersPage() {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [customerType, setCustomerType] = useState<"frequent" | "regular">("frequent");
    const [form, setForm] = useState({
        fname: "", lname: "", email: "", dob: "",
        passportNo: "", country: "", issueDate: "", expiryDate: "",
        mileagePoints: "0", loyaltyTier: "Silver",
        travelFrequency: "0", preferredAirline: "",
    });
    const [dateError, setDateError] = useState("");

    async function fetchCustomers() {
        setLoading(true);
        const res = await fetch("/api/customers");
        const data = await res.json();
        setCustomers(data);
        setLoading(false);
    }

    useEffect(() => { fetchCustomers(); }, []);

    function validateExpiryDate(date: string) {
        if (date && new Date(date) <= new Date()) {
            setDateError("Expiry date must be in the future!");
            return false;
        }
        setDateError("");
        return true;
    }

    async function handleCreate(e: React.FormEvent) {
        e.preventDefault();
        if (!validateExpiryDate(form.expiryDate)) return;

        const payload = {
            ...form,
            customerType,
            mileagePoints: parseInt(form.mileagePoints),
            travelFrequency: parseInt(form.travelFrequency),
        };

        const res = await fetch("/api/customers", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        if (res.ok) {
            toast.success("Customer registered successfully");
            setOpen(false);
            setForm({
                fname: "", lname: "", email: "", dob: "",
                passportNo: "", country: "", issueDate: "", expiryDate: "",
                mileagePoints: "0", loyaltyTier: "Silver",
                travelFrequency: "0", preferredAirline: "",
            });
            fetchCustomers();
        } else {
            const err = await res.json();
            toast.error(typeof err.error === "string" ? err.error : "Validation failed");
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Customer Portal</h1>
                    <p className="mt-1 text-muted-foreground">
                        Register customers and manage passport details
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="icon" onClick={fetchCustomers} className="border-border/40">
                        <RefreshCw className="h-4 w-4" />
                    </Button>
                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-gradient-to-r from-violet-500 to-purple-600 shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40">
                                <Plus className="mr-2 h-4 w-4" /> Register Customer
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-h-[90vh] overflow-y-auto border-border/40 bg-card/95 backdrop-blur-xl sm:max-w-lg">
                            <DialogHeader>
                                <DialogTitle>Register New Customer</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleCreate} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>First Name</Label>
                                        <Input value={form.fname} onChange={(e) => setForm({ ...form, fname: e.target.value })} required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Last Name</Label>
                                        <Input value={form.lname} onChange={(e) => setForm({ ...form, lname: e.target.value })} required />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Email</Label>
                                        <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Date of Birth</Label>
                                        <Input type="date" value={form.dob} onChange={(e) => setForm({ ...form, dob: e.target.value })} required />
                                    </div>
                                </div>

                                {/* Customer Type */}
                                <div className="space-y-2">
                                    <Label>Customer Type</Label>
                                    <Select value={customerType} onValueChange={(v: "frequent" | "regular") => setCustomerType(v)}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="frequent">✈️ Frequent Flyer</SelectItem>
                                            <SelectItem value="regular">👤 Regular Customer</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {customerType === "frequent" ? (
                                    <div className="grid grid-cols-2 gap-4 rounded-lg border border-sky-500/20 bg-sky-500/5 p-3">
                                        <div className="space-y-2">
                                            <Label className="text-sky-400">Mileage Points</Label>
                                            <Input type="number" value={form.mileagePoints} onChange={(e) => setForm({ ...form, mileagePoints: e.target.value })} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-sky-400">Loyalty Tier</Label>
                                            <Select value={form.loyaltyTier} onValueChange={(v) => setForm({ ...form, loyaltyTier: v })}>
                                                <SelectTrigger><SelectValue /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Silver">Silver</SelectItem>
                                                    <SelectItem value="Gold">Gold</SelectItem>
                                                    <SelectItem value="Platinum">Platinum</SelectItem>
                                                    <SelectItem value="Diamond">Diamond</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 gap-4 rounded-lg border border-violet-500/20 bg-violet-500/5 p-3">
                                        <div className="space-y-2">
                                            <Label className="text-violet-400">Travel Frequency</Label>
                                            <Input type="number" value={form.travelFrequency} onChange={(e) => setForm({ ...form, travelFrequency: e.target.value })} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-violet-400">Preferred Airline</Label>
                                            <Input value={form.preferredAirline} onChange={(e) => setForm({ ...form, preferredAirline: e.target.value })} />
                                        </div>
                                    </div>
                                )}

                                {/* Passport */}
                                <div className="space-y-3 rounded-lg border border-amber-500/20 bg-amber-500/5 p-3">
                                    <p className="text-sm font-semibold text-amber-400">Passport Details</p>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Passport Number</Label>
                                            <Input value={form.passportNo} onChange={(e) => setForm({ ...form, passportNo: e.target.value })} required />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Country</Label>
                                            <Input value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} required />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Issue Date</Label>
                                            <Input type="date" value={form.issueDate} onChange={(e) => setForm({ ...form, issueDate: e.target.value })} required />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Expiry Date</Label>
                                            <Input
                                                type="date"
                                                value={form.expiryDate}
                                                onChange={(e) => {
                                                    setForm({ ...form, expiryDate: e.target.value });
                                                    validateExpiryDate(e.target.value);
                                                }}
                                                required
                                            />
                                            {dateError && (
                                                <p className="text-xs font-medium text-red-400">{dateError}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <Button type="submit" className="w-full bg-gradient-to-r from-violet-500 to-purple-600" disabled={!!dateError}>
                                    Register Customer
                                </Button>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-violet-500" />
                        All Customers ({customers.length})
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
                                    <TableHead>CusID</TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Passport</TableHead>
                                    <TableHead>Details</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {customers.map((c) => (
                                    <TableRow key={c.cusId} className="border-border/40">
                                        <TableCell className="font-mono text-muted-foreground">#{c.cusId}</TableCell>
                                        <TableCell className="font-semibold">{c.fname} {c.lname}</TableCell>
                                        <TableCell className="text-muted-foreground">{c.email}</TableCell>
                                        <TableCell>
                                            {c.frequentFlyer ? (
                                                <Badge variant="outline" className="bg-sky-500/15 text-sky-400 border-sky-500/30">
                                                    <Star className="mr-1 h-3 w-3" /> Frequent Flyer
                                                </Badge>
                                            ) : (
                                                <Badge variant="outline" className="bg-violet-500/15 text-violet-400 border-violet-500/30">
                                                    <UserCheck className="mr-1 h-3 w-3" /> Regular
                                                </Badge>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {c.passport ? (
                                                <span className="text-sm text-muted-foreground">
                                                    {c.passport.pno} ({c.passport.country})
                                                </span>
                                            ) : (
                                                <span className="text-sm text-red-400">No passport</span>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {c.frequentFlyer ? (
                                                <span className="text-xs text-muted-foreground">
                                                    {c.frequentFlyer.mileagePoints.toLocaleString()} pts · {c.frequentFlyer.loyaltyTier}
                                                </span>
                                            ) : c.regularCustomer ? (
                                                <span className="text-xs text-muted-foreground">
                                                    {c.regularCustomer.travelFrequency} trips · {c.regularCustomer.preferredAirline}
                                                </span>
                                            ) : null}
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
