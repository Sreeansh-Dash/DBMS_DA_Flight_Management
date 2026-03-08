"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserCog, Plus, RefreshCw, Users2, Plane, Clock } from "lucide-react";
import { toast } from "sonner";

interface Dependent {
    staffId: number;
    name: string;
    relationship: string;
    dob: string;
    contact: string;
}

interface WorksOnEntry {
    fid: number;
    hours: number;
    flight: { fnumber: string; departureCity: string; arrivalCity: string; status: string };
}

interface Staff {
    staffId: number;
    firstN: string;
    lastN: string;
    role: string;
    email: string;
    dependents: Dependent[];
    worksOn: WorksOnEntry[];
}

interface Flight { fid: number; fnumber: string; departureCity: string; arrivalCity: string }

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
        const [s, f] = await Promise.all([
            fetch("/api/staff").then((r) => r.json()),
            fetch("/api/flights").then((r) => r.json()),
        ]);
        setStaff(s);
        setFlights(f);
        setLoading(false);
    }

    useEffect(() => { fetchData(); }, []);

    async function handleCreateStaff(e: React.FormEvent) {
        e.preventDefault();
        const res = await fetch("/api/staff", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(staffForm),
        });
        if (res.ok) {
            toast.success("Staff member added");
            setOpenStaff(false);
            setStaffForm({ firstN: "", lastN: "", role: "", email: "" });
            fetchData();
        } else {
            const err = await res.json();
            toast.error(typeof err.error === "string" ? err.error : "Failed to add staff");
        }
    }

    async function handleAddDependent(e: React.FormEvent) {
        e.preventDefault();
        if (!selectedStaffId) return;
        const res = await fetch(`/api/staff/${selectedStaffId}/dependents`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(depForm),
        });
        if (res.ok) {
            toast.success("Dependent added");
            setOpenDep(false);
            setDepForm({ name: "", relationship: "", dob: "", contact: "" });
            fetchData();
        } else {
            const err = await res.json();
            toast.error(typeof err.error === "string" ? err.error : "Failed to add dependent");
        }
    }

    async function handleAssign(e: React.FormEvent) {
        e.preventDefault();
        const res = await fetch("/api/works-on", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                fid: parseInt(assignForm.fid),
                staffId: parseInt(assignForm.staffId),
                hours: parseFloat(assignForm.hours),
            }),
        });
        if (res.ok) {
            toast.success("Flight assignment created");
            setOpenAssign(false);
            setAssignForm({ fid: "", staffId: "", hours: "" });
            fetchData();
        } else {
            const err = await res.json();
            toast.error(typeof err.error === "string" ? err.error : "Failed to assign");
        }
    }

    const roleColors: Record<string, string> = {
        Pilot: "bg-sky-500/15 text-sky-400 border-sky-500/30",
        "Co-Pilot": "bg-blue-500/15 text-blue-400 border-blue-500/30",
        "Flight Attendant": "bg-violet-500/15 text-violet-400 border-violet-500/30",
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Staff Management</h1>
                    <p className="mt-1 text-muted-foreground">
                        Manage crew, dependents, and flight assignments
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="icon" onClick={fetchData} className="border-border/40">
                        <RefreshCw className="h-4 w-4" />
                    </Button>

                    {/* Add Staff Dialog */}
                    <Dialog open={openStaff} onOpenChange={setOpenStaff}>
                        <DialogTrigger asChild>
                            <Button className="bg-gradient-to-r from-emerald-500 to-green-600 shadow-lg shadow-emerald-500/25">
                                <Plus className="mr-2 h-4 w-4" /> Add Staff
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="border-border/40 bg-card/95 backdrop-blur-xl">
                            <DialogHeader><DialogTitle>Add Staff Member</DialogTitle></DialogHeader>
                            <form onSubmit={handleCreateStaff} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>First Name</Label>
                                        <Input value={staffForm.firstN} onChange={(e) => setStaffForm({ ...staffForm, firstN: e.target.value })} required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Last Name</Label>
                                        <Input value={staffForm.lastN} onChange={(e) => setStaffForm({ ...staffForm, lastN: e.target.value })} required />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Role</Label>
                                        <Select value={staffForm.role} onValueChange={(v) => setStaffForm({ ...staffForm, role: v })}>
                                            <SelectTrigger><SelectValue placeholder="Select role" /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Pilot">Pilot</SelectItem>
                                                <SelectItem value="Co-Pilot">Co-Pilot</SelectItem>
                                                <SelectItem value="Flight Attendant">Flight Attendant</SelectItem>
                                                <SelectItem value="Ground Crew">Ground Crew</SelectItem>
                                                <SelectItem value="Engineer">Engineer</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Email</Label>
                                        <Input type="email" value={staffForm.email} onChange={(e) => setStaffForm({ ...staffForm, email: e.target.value })} required />
                                    </div>
                                </div>
                                <Button type="submit" className="w-full bg-gradient-to-r from-emerald-500 to-green-600">
                                    Add Staff
                                </Button>
                            </form>
                        </DialogContent>
                    </Dialog>

                    {/* Assign Flight Dialog */}
                    <Dialog open={openAssign} onOpenChange={setOpenAssign}>
                        <DialogTrigger asChild>
                            <Button variant="outline" className="border-border/40">
                                <Plane className="mr-2 h-4 w-4" /> Assign Flight
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="border-border/40 bg-card/95 backdrop-blur-xl">
                            <DialogHeader><DialogTitle>Assign Staff to Flight</DialogTitle></DialogHeader>
                            <form onSubmit={handleAssign} className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Staff Member</Label>
                                    <Select value={assignForm.staffId} onValueChange={(v) => setAssignForm({ ...assignForm, staffId: v })}>
                                        <SelectTrigger><SelectValue placeholder="Select staff" /></SelectTrigger>
                                        <SelectContent>
                                            {staff.map((s) => (
                                                <SelectItem key={s.staffId} value={String(s.staffId)}>
                                                    {s.firstN} {s.lastN} ({s.role})
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Flight</Label>
                                    <Select value={assignForm.fid} onValueChange={(v) => setAssignForm({ ...assignForm, fid: v })}>
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
                                <div className="space-y-2">
                                    <Label>Hours</Label>
                                    <Input type="number" step="0.5" placeholder="4.5" value={assignForm.hours} onChange={(e) => setAssignForm({ ...assignForm, hours: e.target.value })} required />
                                </div>
                                <Button type="submit" className="w-full">Assign to Flight</Button>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Staff List */}
            <div className="grid gap-6 lg:grid-cols-2">
                {loading ? (
                    [...Array(4)].map((_, i) => (
                        <div key={i} className="h-48 animate-pulse rounded-xl bg-muted" />
                    ))
                ) : (
                    staff.map((s) => (
                        <Card key={s.staffId} className="group border-border/40 bg-card/50 backdrop-blur-sm transition-all hover:shadow-lg">
                            <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle className="text-lg">{s.firstN} {s.lastN}</CardTitle>
                                        <p className="text-sm text-muted-foreground">{s.email}</p>
                                    </div>
                                    <Badge variant="outline" className={roleColors[s.role] || "bg-accent"}>
                                        {s.role}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <Tabs defaultValue="flights" className="w-full">
                                    <TabsList className="grid w-full grid-cols-2 bg-accent/50">
                                        <TabsTrigger value="flights" className="text-xs">
                                            <Plane className="mr-1 h-3 w-3" /> Flights ({s.worksOn.length})
                                        </TabsTrigger>
                                        <TabsTrigger value="dependents" className="text-xs">
                                            <Users2 className="mr-1 h-3 w-3" /> Dependents ({s.dependents.length})
                                        </TabsTrigger>
                                    </TabsList>
                                    <TabsContent value="flights" className="mt-3">
                                        {s.worksOn.length === 0 ? (
                                            <p className="text-sm text-muted-foreground">No flight assignments</p>
                                        ) : (
                                            <div className="space-y-2">
                                                {s.worksOn.map((w, i) => (
                                                    <div key={i} className="flex items-center justify-between rounded-lg bg-accent/30 px-3 py-2 text-sm">
                                                        <span className="font-medium">{w.flight.fnumber}</span>
                                                        <span className="text-muted-foreground">
                                                            {w.flight.departureCity} → {w.flight.arrivalCity}
                                                        </span>
                                                        <span className="flex items-center gap-1 text-muted-foreground">
                                                            <Clock className="h-3 w-3" /> {w.hours}h
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </TabsContent>
                                    <TabsContent value="dependents" className="mt-3">
                                        {s.dependents.length === 0 ? (
                                            <p className="text-sm text-muted-foreground">No dependents registered</p>
                                        ) : (
                                            <div className="space-y-2">
                                                {s.dependents.map((d, i) => (
                                                    <div key={i} className="flex items-center justify-between rounded-lg bg-accent/30 px-3 py-2 text-sm">
                                                        <div>
                                                            <span className="font-medium">{d.name}</span>
                                                            <span className="ml-2 text-muted-foreground">({d.relationship})</span>
                                                        </div>
                                                        <span className="text-xs text-muted-foreground">{d.contact}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="mt-3 w-full border-border/40"
                                            onClick={() => {
                                                setSelectedStaffId(s.staffId);
                                                setOpenDep(true);
                                            }}
                                        >
                                            <Plus className="mr-1 h-3 w-3" /> Add Dependent
                                        </Button>
                                    </TabsContent>
                                </Tabs>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>

            {/* Add Dependent Dialog */}
            <Dialog open={openDep} onOpenChange={setOpenDep}>
                <DialogContent className="border-border/40 bg-card/95 backdrop-blur-xl">
                    <DialogHeader><DialogTitle>Add Dependent / Emergency Contact</DialogTitle></DialogHeader>
                    <form onSubmit={handleAddDependent} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Full Name</Label>
                                <Input value={depForm.name} onChange={(e) => setDepForm({ ...depForm, name: e.target.value })} required />
                            </div>
                            <div className="space-y-2">
                                <Label>Relationship</Label>
                                <Select value={depForm.relationship} onValueChange={(v) => setDepForm({ ...depForm, relationship: v })}>
                                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Spouse">Spouse</SelectItem>
                                        <SelectItem value="Son">Son</SelectItem>
                                        <SelectItem value="Daughter">Daughter</SelectItem>
                                        <SelectItem value="Father">Father</SelectItem>
                                        <SelectItem value="Mother">Mother</SelectItem>
                                        <SelectItem value="Sibling">Sibling</SelectItem>
                                        <SelectItem value="Other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Date of Birth</Label>
                                <Input type="date" value={depForm.dob} onChange={(e) => setDepForm({ ...depForm, dob: e.target.value })} required />
                            </div>
                            <div className="space-y-2">
                                <Label>Contact Number</Label>
                                <Input value={depForm.contact} onChange={(e) => setDepForm({ ...depForm, contact: e.target.value })} required />
                            </div>
                        </div>
                        <Button type="submit" className="w-full bg-gradient-to-r from-emerald-500 to-green-600">
                            Add Dependent
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
