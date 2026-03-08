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
import { Users, Plus, RefreshCw, Star, UserCheck, ShieldCheck, Globe } from "lucide-react";
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

const tierColors: Record<string, { bg: string; color: string }> = {
    Silver: { bg: "oklch(0.70 0.01 260 / 12%)", color: "oklch(0.75 0.01 260)" },
    Gold: { bg: "oklch(0.75 0.18 60 / 12%)", color: "oklch(0.80 0.18 60)" },
    Platinum: { bg: "oklch(0.65 0.22 220 / 12%)", color: "oklch(0.75 0.20 220)" },
    Diamond: { bg: "oklch(0.60 0.22 280 / 12%)", color: "oklch(0.70 0.20 280)" },
};

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
            setDateError("Passport has expired — expiry date must be in the future!");
            return false;
        }
        setDateError("");
        return true;
    }

    async function handleCreate(e: React.FormEvent) {
        e.preventDefault();
        if (!validateExpiryDate(form.expiryDate)) return;
        const payload = { ...form, customerType, mileagePoints: parseInt(form.mileagePoints), travelFrequency: parseInt(form.travelFrequency) };
        const res = await fetch("/api/customers", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });
        if (res.ok) {
            toast.success("Customer registered successfully");
            setOpen(false);
            setForm({ fname: "", lname: "", email: "", dob: "", passportNo: "", country: "", issueDate: "", expiryDate: "", mileagePoints: "0", loyaltyTier: "Silver", travelFrequency: "0", preferredAirline: "" });
            fetchCustomers();
        } else {
            const err = await res.json();
            toast.error(typeof err.error === "string" ? err.error : "Validation failed");
        }
    }

    const inputStyle = { background: "oklch(0.18 0.015 260)", border: "1px solid oklch(1 0 0 / 8%)" };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="animate-fade-in-up flex items-end justify-between">
                <div>
                    <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" style={{ color: "oklch(0.70 0.22 280)" }} />
                        <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "oklch(0.65 0.20 280)" }}>Customer Portal</span>
                    </div>
                    <h1 className="mt-0.5 text-3xl font-bold tracking-tight" style={{ background: "linear-gradient(135deg, oklch(0.75 0.20 260), oklch(0.65 0.22 300))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                        Customers
                    </h1>
                    <p className="mt-1 text-sm" style={{ color: "oklch(0.50 0.015 260)" }}>Register and manage passenger profiles</p>
                </div>
                <div className="flex gap-2">
                    <button onClick={fetchCustomers} className="flex h-9 w-9 items-center justify-center rounded-xl transition-all duration-200 hover:scale-110 active:scale-95"
                        style={{ background: "oklch(0.18 0.015 260)", border: "1px solid oklch(1 0 0 / 8%)" }}>
                        <RefreshCw className="h-4 w-4" style={{ color: "oklch(0.55 0.015 260)" }} />
                    </button>

                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger asChild>
                            <button className="btn-shine flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-white transition-all duration-200 hover:scale-105 active:scale-95"
                                style={{ background: "linear-gradient(135deg, oklch(0.60 0.22 280), oklch(0.50 0.22 300))", boxShadow: "0 4px 15px oklch(0.60 0.22 280 / 30%)" }}>
                                <Plus className="h-4 w-4" /> Register Customer
                            </button>
                        </DialogTrigger>
                        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg" style={{ background: "oklch(0.14 0.015 260)", border: "1px solid oklch(1 0 0 / 10%)", boxShadow: "0 25px 50px oklch(0 0 0 / 60%)" }}>
                            <DialogHeader>
                                <DialogTitle className="text-lg font-bold text-slate-100">Register Customer</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleCreate} className="space-y-4 mt-2">
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1.5">
                                        <Label className="text-xs text-slate-400">First Name</Label>
                                        <Input value={form.fname} onChange={(e) => setForm({ ...form, fname: e.target.value })} required className="rounded-xl" style={inputStyle} />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-xs text-slate-400">Last Name</Label>
                                        <Input value={form.lname} onChange={(e) => setForm({ ...form, lname: e.target.value })} required className="rounded-xl" style={inputStyle} />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1.5">
                                        <Label className="text-xs text-slate-400">Email</Label>
                                        <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required className="rounded-xl" style={inputStyle} />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-xs text-slate-400">Date of Birth</Label>
                                        <Input type="date" value={form.dob} onChange={(e) => setForm({ ...form, dob: e.target.value })} required className="rounded-xl" style={inputStyle} />
                                    </div>
                                </div>

                                {/* Customer Type Toggle */}
                                <div className="flex rounded-xl p-1 gap-1" style={{ background: "oklch(0.16 0.015 260)", border: "1px solid oklch(1 0 0 / 6%)" }}>
                                    {(["frequent", "regular"] as const).map((type) => (
                                        <button key={type} type="button"
                                            onClick={() => setCustomerType(type)}
                                            className="flex-1 rounded-lg py-2 text-xs font-semibold transition-all duration-200"
                                            style={{
                                                background: customerType === type ? (type === "frequent" ? "oklch(0.65 0.22 220 / 20%)" : "oklch(0.60 0.22 280 / 20%)") : "transparent",
                                                color: customerType === type ? (type === "frequent" ? "oklch(0.75 0.20 220)" : "oklch(0.70 0.20 280)") : "oklch(0.50 0.015 260)",
                                                border: customerType === type ? `1px solid ${type === "frequent" ? "oklch(0.65 0.22 220 / 30%)" : "oklch(0.60 0.22 280 / 30%)"}` : "1px solid transparent",
                                            }}>
                                            {type === "frequent" ? "✈️ Frequent Flyer" : "👤 Regular Customer"}
                                        </button>
                                    ))}
                                </div>

                                {/* Conditional Fields */}
                                {customerType === "frequent" ? (
                                    <div className="grid grid-cols-2 gap-3 rounded-xl p-3" style={{ background: "oklch(0.65 0.22 220 / 6%)", border: "1px solid oklch(0.65 0.22 220 / 15%)" }}>
                                        <div className="space-y-1.5">
                                            <Label className="text-xs" style={{ color: "oklch(0.70 0.20 220)" }}>Mileage Points</Label>
                                            <Input type="number" value={form.mileagePoints} onChange={(e) => setForm({ ...form, mileagePoints: e.target.value })} className="rounded-xl" style={inputStyle} />
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label className="text-xs" style={{ color: "oklch(0.70 0.20 220)" }}>Loyalty Tier</Label>
                                            <Select value={form.loyaltyTier} onValueChange={(v) => setForm({ ...form, loyaltyTier: v })}>
                                                <SelectTrigger className="rounded-xl" style={inputStyle}><SelectValue /></SelectTrigger>
                                                <SelectContent style={{ background: "oklch(0.16 0.015 260)", border: "1px solid oklch(1 0 0 / 10%)" }}>
                                                    {["Silver", "Gold", "Platinum", "Diamond"].map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 gap-3 rounded-xl p-3" style={{ background: "oklch(0.60 0.22 280 / 6%)", border: "1px solid oklch(0.60 0.22 280 / 15%)" }}>
                                        <div className="space-y-1.5">
                                            <Label className="text-xs" style={{ color: "oklch(0.70 0.20 280)" }}>Travel Frequency</Label>
                                            <Input type="number" value={form.travelFrequency} onChange={(e) => setForm({ ...form, travelFrequency: e.target.value })} className="rounded-xl" style={inputStyle} />
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label className="text-xs" style={{ color: "oklch(0.70 0.20 280)" }}>Preferred Airline</Label>
                                            <Input value={form.preferredAirline} onChange={(e) => setForm({ ...form, preferredAirline: e.target.value })} className="rounded-xl" style={inputStyle} />
                                        </div>
                                    </div>
                                )}

                                {/* Passport Section */}
                                <div className="space-y-3 rounded-xl p-3" style={{ background: "oklch(0.70 0.18 60 / 6%)", border: "1px solid oklch(0.70 0.18 60 / 20%)" }}>
                                    <div className="flex items-center gap-2">
                                        <ShieldCheck className="h-3.5 w-3.5" style={{ color: "oklch(0.75 0.18 60)" }} />
                                        <p className="text-xs font-semibold" style={{ color: "oklch(0.75 0.18 60)" }}>Passport Details</p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="space-y-1.5">
                                            <Label className="text-xs text-slate-400">Passport No</Label>
                                            <Input value={form.passportNo} onChange={(e) => setForm({ ...form, passportNo: e.target.value })} required className="rounded-xl" style={inputStyle} />
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label className="text-xs text-slate-400">Country</Label>
                                            <Input value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} required className="rounded-xl" style={inputStyle} />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="space-y-1.5">
                                            <Label className="text-xs text-slate-400">Issue Date</Label>
                                            <Input type="date" value={form.issueDate} onChange={(e) => setForm({ ...form, issueDate: e.target.value })} required className="rounded-xl" style={inputStyle} />
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label className="text-xs text-slate-400">Expiry Date</Label>
                                            <Input type="date" value={form.expiryDate}
                                                onChange={(e) => { setForm({ ...form, expiryDate: e.target.value }); validateExpiryDate(e.target.value); }}
                                                required className="rounded-xl" style={inputStyle} />
                                            {dateError && (
                                                <p className="flex items-center gap-1 text-[11px] font-medium" style={{ color: "oklch(0.70 0.20 25)" }}>
                                                    ⚠️ {dateError}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <button type="submit" disabled={!!dateError} className="btn-shine w-full rounded-xl py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                                    style={{ background: "linear-gradient(135deg, oklch(0.60 0.22 280), oklch(0.50 0.22 300))", boxShadow: "0 4px 15px oklch(0.60 0.22 280 / 30%)" }}>
                                    Register Customer
                                </button>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Table */}
            <div className="animate-fade-in-up animate-delay-100 overflow-hidden rounded-2xl"
                style={{ background: "oklch(0.145 0.015 260 / 70%)", border: "1px solid oklch(1 0 0 / 8%)", backdropFilter: "blur(20px)" }}>
                <div className="flex items-center gap-3 px-6 py-4" style={{ borderBottom: "1px solid oklch(1 0 0 / 6%)" }}>
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg" style={{ background: "oklch(0.60 0.22 280 / 12%)" }}>
                        <Users className="h-3.5 w-3.5" style={{ color: "oklch(0.65 0.20 280)" }} />
                    </div>
                    <span className="font-semibold text-slate-200">All Customers</span>
                    <span className="rounded-full px-2 py-0.5 text-xs font-medium" style={{ background: "oklch(0.60 0.22 280 / 12%)", color: "oklch(0.65 0.20 280)" }}>
                        {customers.length}
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
                                {["CusID", "Name", "Email", "Type", "Passport", "Details"].map(h => (
                                    <TableHead key={h} className="text-xs font-semibold uppercase tracking-wider" style={{ color: "oklch(0.45 0.015 260)" }}>{h}</TableHead>
                                ))}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {customers.map((c, i) => (
                                <TableRow key={c.cusId} className="table-row-hover border-0" style={{ animationDelay: `${i * 30}ms` }}>
                                    <TableCell className="font-mono text-xs" style={{ color: "oklch(0.40 0.015 260)" }}>#{c.cusId}</TableCell>
                                    <TableCell className="font-semibold text-slate-100">{c.fname} {c.lname}</TableCell>
                                    <TableCell className="text-sm" style={{ color: "oklch(0.55 0.015 260)" }}>{c.email}</TableCell>
                                    <TableCell>
                                        {c.frequentFlyer ? (
                                            <div className="flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold w-fit"
                                                style={{ background: "oklch(0.65 0.22 220 / 12%)", color: "oklch(0.75 0.20 220)" }}>
                                                <Star className="h-3 w-3" /> Frequent Flyer
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold w-fit"
                                                style={{ background: "oklch(0.60 0.22 280 / 12%)", color: "oklch(0.70 0.20 280)" }}>
                                                <UserCheck className="h-3 w-3" /> Regular
                                            </div>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {c.passport ? (
                                            <div className="flex items-center gap-1.5 text-xs" style={{ color: "oklch(0.55 0.015 260)" }}>
                                                <Globe className="h-3 w-3" style={{ color: "oklch(0.70 0.18 60)" }} />
                                                {c.passport.pno} · {c.passport.country}
                                            </div>
                                        ) : (
                                            <span className="text-xs font-medium" style={{ color: "oklch(0.65 0.20 25)" }}>No passport</span>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-xs" style={{ color: "oklch(0.55 0.015 260)" }}>
                                        {c.frequentFlyer ? (
                                            <span>
                                                <span style={tierColors[c.frequentFlyer.loyaltyTier] ? { color: tierColors[c.frequentFlyer.loyaltyTier].color } : {}}>
                                                    {c.frequentFlyer.loyaltyTier}
                                                </span>
                                                {" · "}{c.frequentFlyer.mileagePoints.toLocaleString()} pts
                                            </span>
                                        ) : c.regularCustomer ? (
                                            <span>{c.regularCustomer.travelFrequency} trips · {c.regularCustomer.preferredAirline}</span>
                                        ) : null}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </div>
        </div>
    );
}
