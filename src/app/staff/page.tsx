"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserCog, Plus, RefreshCw, Plane, Clock, Users2, Mail } from "lucide-react";
import { toast } from "sonner";

interface Dependent { staffId: number; name: string; relationship: string; dob: string; contact: string }
interface WorksOnEntry { fid: number; hours: number; flight: { fnumber: string; departureCity: string; arrivalCity: string; status: string } }
interface Staff { staffId: number; firstN: string; lastN: string; role: string; email: string; dependents: Dependent[]; worksOn: WorksOnEntry[] }
interface Flight { fid: number; fnumber: string; departureCity: string; arrivalCity: string }

const roleConfig: Record<string, { bg: string; color: string }> = {
    "Pilot": { bg: "oklch(0.65 0.22 220 / 12%)", color: "oklch(0.75 0.20 220)" },
    "Co-Pilot": { bg: "oklch(0.60 0.22 250 / 12%)", color: "oklch(0.70 0.20 250)" },
    "Flight Attendant": { bg: "oklch(0.60 0.22 280 / 12%)", color: "oklch(0.70 0.20 280)" },
    "Ground Crew": { bg: "oklch(0.65 0.18 160 / 12%)", color: "oklch(0.70 0.18 160)" },
    "Engineer": { bg: "oklch(0.70 0.18 60 / 12%)", color: "oklch(0.75 0.18 60)" },
};

const flightStatusDot: Record<string, string> = {
    Arrived: "oklch(0.70 0.18 160)", Departed: "oklch(0.70 0.22 220)",
    Delayed: "oklch(0.75 0.18 60)", Cancelled: "oklch(0.70 0.20 25)",
};

export default function StaffPage() {
    const [staff, setStaff] = useState<Staff[]>([]);
    const [flights, setFlights] = useState<Flight[]>([]);
    const [loading, setLoading] = useState(true);
    const [openStaff, setOpenStaff] = useState(false);
    const [openDep, setOpenDep] = useState(false);
    const [openAssign, setOpenAssign] = useState(false);
    const [selectedStaffId, setSelectedStaffId] = useState<number | null>(null);
    const [staffForm, setStaffForm] = useState({ firstN: "", lastN: "", role: "", email: "" });
    const [depForm, setDepForm] = useState({ name: "", relationship: "", dob: "", contact: "" });
    const [assignForm, setAssignForm] = useState({ fid: "", staffId: "", hours: "" });

    async function fetchData() {
        setLoading(true);
        const [s, f] = await Promise.all([fetch("/api/staff").then(r => r.json()), fetch("/api/flights").then(r => r.json())]);
        setStaff(Array.isArray(s) ? s : []);
        setFlights(Array.isArray(f) ? f : []);
        setLoading(false);
    }

    useEffect(() => { fetchData(); }, []);

    async function handleCreateStaff(e: React.FormEvent) {
        e.preventDefault();
        const res = await fetch("/api/staff", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(staffForm) });
        if (res.ok) { toast.success("Staff member added"); setOpenStaff(false); setStaffForm({ firstN: "", lastN: "", role: "", email: "" }); fetchData(); }
        else { const err = await res.json(); toast.error(err.error || "Failed"); }
    }

    async function handleAddDependent(e: React.FormEvent) {
        e.preventDefault();
        if (!selectedStaffId) return;
        const res = await fetch(`/api/staff/${selectedStaffId}/dependents`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(depForm) });
        if (res.ok) { toast.success("Dependent added"); setOpenDep(false); setDepForm({ name: "", relationship: "", dob: "", contact: "" }); fetchData(); }
        else { const err = await res.json(); toast.error(err.error || "Failed"); }
    }

    async function handleAssign(e: React.FormEvent) {
        e.preventDefault();
        const res = await fetch("/api/works-on", {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ fid: parseInt(assignForm.fid), staffId: parseInt(assignForm.staffId), hours: parseFloat(assignForm.hours) }),
        });
        if (res.ok) { toast.success("Assignment created"); setOpenAssign(false); setAssignForm({ fid: "", staffId: "", hours: "" }); fetchData(); }
        else { const err = await res.json(); toast.error(err.error || "Failed"); }
    }

    const inputStyle = { background: "oklch(0.18 0.015 260)", border: "1px solid oklch(1 0 0 / 8%)" };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="animate-fade-in-up flex items-end justify-between">
                <div>
                    <div className="flex items-center gap-2">
                        <UserCog className="h-4 w-4" style={{ color: "oklch(0.70 0.18 160)" }} />
                        <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "oklch(0.65 0.18 160)" }}>Crew Operations</span>
                    </div>
                    <h1 className="mt-0.5 text-3xl font-bold tracking-tight" style={{ background: "linear-gradient(135deg, oklch(0.75 0.18 150), oklch(0.65 0.20 180))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                        Staff Management
                    </h1>
                    <p className="mt-1 text-sm" style={{ color: "oklch(0.50 0.015 260)" }}>Manage crew, dependents, and flight assignments</p>
                </div>
                <div className="flex gap-2">
                    <button onClick={fetchData} className="flex h-9 w-9 items-center justify-center rounded-xl transition-all hover:scale-110 active:scale-95"
                        style={{ background: "oklch(0.18 0.015 260)", border: "1px solid oklch(1 0 0 / 8%)" }}>
                        <RefreshCw className="h-4 w-4" style={{ color: "oklch(0.55 0.015 260)" }} />
                    </button>

                    {/* Assign Flight */}
                    <Dialog open={openAssign} onOpenChange={setOpenAssign}>
                        <DialogTrigger
                            className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all hover:scale-105 active:scale-95"
                            style={{ background: "oklch(0.18 0.015 260)", border: "1px solid oklch(1 0 0 / 10%)", color: "oklch(0.70 0.22 220)" }}>
                            <Plane className="h-4 w-4" /> Assign Flight
                        </DialogTrigger>
                        <DialogContent style={{ background: "oklch(0.14 0.015 260)", border: "1px solid oklch(1 0 0 / 10%)", boxShadow: "0 25px 50px oklch(0 0 0 / 60%)" }}>
                            <DialogHeader><DialogTitle className="text-lg font-bold text-slate-100">Assign Staff to Flight</DialogTitle></DialogHeader>
                            <form onSubmit={handleAssign} className="space-y-4 mt-2">
                                <div className="space-y-1.5">
                                    <Label className="text-xs text-slate-400">Staff Member</Label>
                                    <Select value={assignForm.staffId} onValueChange={(v) => setAssignForm({ ...assignForm, staffId: v ?? "" })}>
                                        <SelectTrigger className="rounded-xl" style={inputStyle}><SelectValue placeholder="Select staff" /></SelectTrigger>
                                        <SelectContent style={{ background: "oklch(0.16 0.015 260)", border: "1px solid oklch(1 0 0 / 10%)" }}>
                                            {staff.map(s => <SelectItem key={s.staffId} value={String(s.staffId)}>{s.firstN} {s.lastN} — {s.role}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-xs text-slate-400">Flight</Label>
                                    <Select value={assignForm.fid} onValueChange={(v) => setAssignForm({ ...assignForm, fid: v ?? "" })}>
                                        <SelectTrigger className="rounded-xl" style={inputStyle}><SelectValue placeholder="Select flight" /></SelectTrigger>
                                        <SelectContent style={{ background: "oklch(0.16 0.015 260)", border: "1px solid oklch(1 0 0 / 10%)" }}>
                                            {flights.map(f => <SelectItem key={f.fid} value={String(f.fid)}>{f.fnumber} — {f.departureCity} → {f.arrivalCity}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-xs text-slate-400">Hours</Label>
                                    <Input type="number" step="0.5" placeholder="4.5" value={assignForm.hours} onChange={(e) => setAssignForm({ ...assignForm, hours: e.target.value })} required className="rounded-xl" style={inputStyle} />
                                </div>
                                <button type="submit" className="btn-shine w-full rounded-xl py-2.5 text-sm font-semibold text-white transition-all hover:scale-[1.02]"
                                    style={{ background: "linear-gradient(135deg, oklch(0.65 0.22 220), oklch(0.55 0.22 250))", boxShadow: "0 4px 15px oklch(0.65 0.22 220 / 30%)" }}>
                                    Assign to Flight
                                </button>
                            </form>
                        </DialogContent>
                    </Dialog>

                    {/* Add Staff */}
                    <Dialog open={openStaff} onOpenChange={setOpenStaff}>
                        <DialogTrigger
                            className="btn-shine flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-white transition-all hover:scale-105 active:scale-95"
                            style={{ background: "linear-gradient(135deg, oklch(0.65 0.18 160), oklch(0.55 0.18 180))", boxShadow: "0 4px 15px oklch(0.65 0.18 160 / 30%)" }}>
                            <Plus className="h-4 w-4" /> Add Staff
                        </DialogTrigger>
                        <DialogContent style={{ background: "oklch(0.14 0.015 260)", border: "1px solid oklch(1 0 0 / 10%)", boxShadow: "0 25px 50px oklch(0 0 0 / 60%)" }}>
                            <DialogHeader><DialogTitle className="text-lg font-bold text-slate-100">Add Staff Member</DialogTitle></DialogHeader>
                            <form onSubmit={handleCreateStaff} className="space-y-4 mt-2">
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1.5"><Label className="text-xs text-slate-400">First Name</Label>
                                        <Input value={staffForm.firstN} onChange={(e) => setStaffForm({ ...staffForm, firstN: e.target.value })} required className="rounded-xl" style={inputStyle} /></div>
                                    <div className="space-y-1.5"><Label className="text-xs text-slate-400">Last Name</Label>
                                        <Input value={staffForm.lastN} onChange={(e) => setStaffForm({ ...staffForm, lastN: e.target.value })} required className="rounded-xl" style={inputStyle} /></div>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1.5">
                                        <Label className="text-xs text-slate-400">Role</Label>
                                        <Select value={staffForm.role} onValueChange={(v) => setStaffForm({ ...staffForm, role: v ?? "" })}>
                                            <SelectTrigger className="rounded-xl" style={inputStyle}><SelectValue placeholder="Select role" /></SelectTrigger>
                                            <SelectContent style={{ background: "oklch(0.16 0.015 260)", border: "1px solid oklch(1 0 0 / 10%)" }}>
                                                {Object.keys(roleConfig).map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-1.5"><Label className="text-xs text-slate-400">Email</Label>
                                        <Input type="email" value={staffForm.email} onChange={(e) => setStaffForm({ ...staffForm, email: e.target.value })} required className="rounded-xl" style={inputStyle} /></div>
                                </div>
                                <button type="submit" className="btn-shine w-full rounded-xl py-2.5 text-sm font-semibold text-white transition-all hover:scale-[1.02]"
                                    style={{ background: "linear-gradient(135deg, oklch(0.65 0.18 160), oklch(0.55 0.18 180))", boxShadow: "0 4px 15px oklch(0.65 0.18 160 / 30%)" }}>
                                    Add Staff
                                </button>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Staff Grid */}
            <div className="grid gap-5 lg:grid-cols-2">
                {loading ? (
                    [...Array(4)].map((_, i) => <div key={i} className="skeleton h-52 rounded-2xl" style={{ animationDelay: `${i * 80}ms` }} />)
                ) : (
                    staff.map((s, i) => {
                        const role = roleConfig[s.role] || { bg: "oklch(0.18 0.015 260)", color: "oklch(0.60 0.015 260)" };
                        return (
                            <div key={s.staffId} className="animate-fade-in-up card-hover group overflow-hidden rounded-2xl"
                                style={{ background: "oklch(0.145 0.015 260 / 70%)", border: "1px solid oklch(1 0 0 / 8%)", backdropFilter: "blur(20px)", animationDelay: `${i * 80}ms` }}>
                                {/* Card header */}
                                <div className="flex items-center justify-between px-5 pt-5 pb-3">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <div className="flex h-9 w-9 items-center justify-center rounded-xl font-bold text-sm"
                                                style={{ background: role.bg, color: role.color }}>
                                                {s.firstN[0]}{s.lastN[0]}
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-100">{s.firstN} {s.lastN}</p>
                                                <div className="flex items-center gap-1 text-xs" style={{ color: "oklch(0.50 0.015 260)" }}>
                                                    <Mail className="h-3 w-3" />{s.email}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="rounded-full px-2.5 py-1 text-xs font-semibold" style={{ background: role.bg, color: role.color }}>
                                        {s.role}
                                    </div>
                                </div>
                                <Separator style={{ background: "oklch(1 0 0 / 5%)" }} />

                                <Tabs defaultValue="flights" className="px-5 pb-5 pt-3">
                                    <TabsList className="grid w-full grid-cols-2 rounded-xl" style={{ background: "oklch(0.18 0.015 260)" }}>
                                        <TabsTrigger value="flights" className="rounded-lg text-xs data-[state=active]:text-slate-100" style={{ transition: "all 0.2s" }}>
                                            <Plane className="mr-1.5 h-3 w-3" />Flights ({s.worksOn.length})
                                        </TabsTrigger>
                                        <TabsTrigger value="dependents" className="rounded-lg text-xs data-[state=active]:text-slate-100" style={{ transition: "all 0.2s" }}>
                                            <Users2 className="mr-1.5 h-3 w-3" />Dependents ({s.dependents.length})
                                        </TabsTrigger>
                                    </TabsList>

                                    <TabsContent value="flights" className="mt-3 space-y-1.5">
                                        {s.worksOn.length === 0 ? (
                                            <p className="py-4 text-center text-xs" style={{ color: "oklch(0.45 0.015 260)" }}>No assignments yet</p>
                                        ) : s.worksOn.map((w, j) => (
                                            <div key={j} className="flex items-center gap-3 rounded-xl px-3 py-2 text-xs transition-colors"
                                                style={{ background: "oklch(0.18 0.015 260)" }}>
                                                <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: flightStatusDot[w.flight.status] || "oklch(0.55 0.015 260)" }} />
                                                <span className="font-semibold text-slate-200">{w.flight.fnumber}</span>
                                                <span style={{ color: "oklch(0.50 0.015 260)" }}>{w.flight.departureCity} → {w.flight.arrivalCity}</span>
                                                <div className="ml-auto flex items-center gap-1" style={{ color: "oklch(0.55 0.015 260)" }}>
                                                    <Clock className="h-3 w-3" />{w.hours}h
                                                </div>
                                            </div>
                                        ))}
                                    </TabsContent>

                                    <TabsContent value="dependents" className="mt-3 space-y-1.5">
                                        {s.dependents.length === 0 ? (
                                            <p className="py-2 text-center text-xs" style={{ color: "oklch(0.45 0.015 260)" }}>No dependents</p>
                                        ) : s.dependents.map((d, j) => (
                                            <div key={j} className="flex items-center justify-between rounded-xl px-3 py-2 text-xs"
                                                style={{ background: "oklch(0.18 0.015 260)" }}>
                                                <div>
                                                    <span className="font-semibold text-slate-200">{d.name}</span>
                                                    <span className="ml-2 rounded-full px-1.5 py-0.5" style={{ background: "oklch(0.20 0.015 260)", color: "oklch(0.55 0.015 260)" }}>{d.relationship}</span>
                                                </div>
                                                <span style={{ color: "oklch(0.50 0.015 260)" }}>{d.contact}</span>
                                            </div>
                                        ))}
                                        <button
                                            className="mt-1 w-full rounded-xl py-2 text-xs font-medium transition-all hover:scale-[1.01]"
                                            style={{ background: "oklch(0.18 0.015 260)", color: "oklch(0.65 0.18 160)", border: "1px solid oklch(0.65 0.18 160 / 20%)" }}
                                            onClick={() => { setSelectedStaffId(s.staffId); setOpenDep(true); }}>
                                            + Add Dependent
                                        </button>
                                    </TabsContent>
                                </Tabs>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Add Dependent Dialog */}
            <Dialog open={openDep} onOpenChange={setOpenDep}>
                <DialogContent style={{ background: "oklch(0.14 0.015 260)", border: "1px solid oklch(1 0 0 / 10%)", boxShadow: "0 25px 50px oklch(0 0 0 / 60%)" }}>
                    <DialogHeader><DialogTitle className="text-lg font-bold text-slate-100">Add Dependent</DialogTitle></DialogHeader>
                    <form onSubmit={handleAddDependent} className="space-y-4 mt-2">
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5"><Label className="text-xs text-slate-400">Full Name</Label>
                                <Input value={depForm.name} onChange={(e) => setDepForm({ ...depForm, name: e.target.value })} required className="rounded-xl" style={inputStyle} /></div>
                            <div className="space-y-1.5">
                                <Label className="text-xs text-slate-400">Relationship</Label>
                                <Select value={depForm.relationship} onValueChange={(v) => setDepForm({ ...depForm, relationship: v ?? "" })}>
                                    <SelectTrigger className="rounded-xl" style={inputStyle}><SelectValue placeholder="Select" /></SelectTrigger>
                                    <SelectContent style={{ background: "oklch(0.16 0.015 260)", border: "1px solid oklch(1 0 0 / 10%)" }}>
                                        {["Spouse", "Son", "Daughter", "Father", "Mother", "Sibling", "Other"].map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5"><Label className="text-xs text-slate-400">Date of Birth</Label>
                                <Input type="date" value={depForm.dob} onChange={(e) => setDepForm({ ...depForm, dob: e.target.value })} required className="rounded-xl" style={inputStyle} /></div>
                            <div className="space-y-1.5"><Label className="text-xs text-slate-400">Contact</Label>
                                <Input value={depForm.contact} onChange={(e) => setDepForm({ ...depForm, contact: e.target.value })} required className="rounded-xl" style={inputStyle} /></div>
                        </div>
                        <button type="submit" className="btn-shine w-full rounded-xl py-2.5 text-sm font-semibold text-white transition-all hover:scale-[1.02]"
                            style={{ background: "linear-gradient(135deg, oklch(0.65 0.18 160), oklch(0.55 0.18 180))", boxShadow: "0 4px 15px oklch(0.65 0.18 160 / 30%)" }}>
                            Add Dependent
                        </button>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
