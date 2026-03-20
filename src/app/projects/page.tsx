"use client";

import React, { useEffect, useState, useCallback } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, ChevronDown, ChevronUp, Check, Clock, Circle, Trash2 } from "lucide-react";

interface Project {
  id: string;
  name: string;
  client: string;
  status: string;
  startDate: string;
  notes: string;
  assignedTo: string;
}

interface Milestone {
  id: string;
  projectId: string;
  title: string;
  dueDate: string;
  status: string;
}

const statuses = ["Discovery", "In Progress", "Delivered", "Maintenance"];

const statusColors: Record<string, string> = {
  Discovery: "bg-clay/10 text-clay border-clay/20",
  "In Progress": "bg-moss/10 text-moss border-moss/20",
  Delivered: "bg-green-50 text-green-800 border-green-200",
  Maintenance: "bg-amber-50 text-amber-800 border-amber-200",
};

const milestoneStatusConfig = {
  done: { icon: Check, color: "text-green-700", bg: "bg-green-100", line: "bg-green-400", label: "Done" },
  "in-progress": { icon: Clock, color: "text-clay", bg: "bg-clay/10", line: "bg-clay", label: "In Progress" },
  pending: { icon: Circle, color: "text-moss/30", bg: "bg-moss/5", line: "bg-moss/15", label: "Pending" },
};

function MilestoneTimeline({ projectId }: { projectId: string }) {
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [newMilestone, setNewMilestone] = useState({ title: "", dueDate: "" });

  const load = useCallback(() => {
    fetch(`/api/milestones?projectId=${projectId}`).then((r) => r.json()).then(setMilestones);
  }, [projectId]);

  useEffect(() => { load(); }, [load]);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    await fetch("/api/milestones", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ projectId, ...newMilestone }),
    });
    setNewMilestone({ title: "", dueDate: "" });
    setShowAdd(false);
    load();
  }

  async function cycleStatus(m: Milestone) {
    const order = ["pending", "in-progress", "done"];
    const next = order[(order.indexOf(m.status) + 1) % order.length];
    await fetch("/api/milestones", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: m.id, status: next }),
    });
    setMilestones(milestones.map((x) => (x.id === m.id ? { ...x, status: next } : x)));
  }

  async function handleDelete(id: string) {
    await fetch("/api/milestones", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setMilestones(milestones.filter((m) => m.id !== id));
  }

  const completedCount = milestones.filter((m) => m.status === "done").length;
  const progress = milestones.length > 0 ? Math.round((completedCount / milestones.length) * 100) : 0;

  return (
    <div className="space-y-4">
      {/* Progress bar */}
      {milestones.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="font-mono-brand text-[10px] uppercase tracking-widest text-moss/40 font-bold">
              Progress
            </span>
            <span className="font-mono-brand text-[10px] font-bold text-moss/50">
              {completedCount}/{milestones.length} milestones · {progress}%
            </span>
          </div>
          <div className="h-1.5 bg-moss/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-clay rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Timeline */}
      <div className="relative">
        {milestones.map((m, i) => {
          const cfg = milestoneStatusConfig[m.status as keyof typeof milestoneStatusConfig] || milestoneStatusConfig.pending;
          const Icon = cfg.icon;
          const isLast = i === milestones.length - 1;
          const isOverdue = m.status !== "done" && new Date(m.dueDate) < new Date();

          return (
            <div key={m.id} className="flex gap-3 group">
              {/* Spine */}
              <div className="flex flex-col items-center">
                <button
                  onClick={() => cycleStatus(m)}
                  title="Click to advance status"
                  className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 cursor-pointer transition-all hover:scale-110 ${cfg.bg}`}
                >
                  <Icon className={`w-3.5 h-3.5 ${cfg.color}`} />
                </button>
                {!isLast && <div className={`w-0.5 flex-1 my-1 min-h-[20px] ${cfg.line}`} />}
              </div>

              {/* Content */}
              <div className="flex-1 pb-4 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <span className={`font-subheading text-sm font-medium leading-tight ${m.status === "done" ? "line-through text-moss/40" : "text-moss"}`}>
                    {m.title}
                  </span>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`font-mono-brand text-[10px] font-semibold ${isOverdue ? "text-red-500" : "text-moss/40"}`}>
                      {new Date(m.dueDate).toLocaleDateString("en-ZA", { day: "numeric", month: "short", year: "numeric" })}
                      {isOverdue && " · overdue"}
                    </span>
                    <button
                      onClick={() => handleDelete(m.id)}
                      className="opacity-0 group-hover:opacity-100 text-moss/20 hover:text-red-400 transition-all"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
                <span className={`font-mono-brand text-[9px] uppercase tracking-widest font-bold ${cfg.color}`}>
                  {cfg.label}
                </span>
              </div>
            </div>
          );
        })}

        {milestones.length === 0 && !showAdd && (
          <p className="text-moss/30 font-subheading text-sm">No milestones yet.</p>
        )}
      </div>

      {/* Add milestone form */}
      {showAdd ? (
        <form onSubmit={handleAdd} className="flex gap-2 items-center">
          <input
            required
            autoFocus
            placeholder="Milestone title"
            value={newMilestone.title}
            onChange={(e) => setNewMilestone({ ...newMilestone, title: e.target.value })}
            className="flex-1 px-3 py-2 rounded-lg bg-cream border border-moss/15 text-moss font-subheading text-sm placeholder:text-moss/40 focus:outline-none focus:ring-2 focus:ring-clay/40 transition-shadow"
          />
          <input
            required
            type="date"
            value={newMilestone.dueDate}
            onChange={(e) => setNewMilestone({ ...newMilestone, dueDate: e.target.value })}
            className="px-3 py-2 rounded-lg bg-cream border border-moss/15 text-moss font-subheading text-sm focus:outline-none focus:ring-2 focus:ring-clay/40 transition-shadow"
          />
          <button type="submit" className="bg-moss text-cream px-4 py-2 rounded-lg font-subheading text-sm font-medium hover:bg-moss/80 transition-colors">
            Add
          </button>
          <button type="button" onClick={() => setShowAdd(false)} className="text-moss/40 hover:text-moss font-subheading text-sm transition-colors px-2">
            Cancel
          </button>
        </form>
      ) : (
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-1.5 text-moss/40 hover:text-clay font-subheading text-sm transition-colors"
        >
          <Plus className="w-3.5 h-3.5" /> Add milestone
        </button>
      )}
    </div>
  );
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", client: "", status: "Discovery", startDate: "", notes: "", assignedTo: "" });

  useEffect(() => {
    fetch("/api/projects").then((r) => r.json()).then(setProjects);
  }, []);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const project = await res.json();
    setProjects([project, ...projects]);
    setForm({ name: "", client: "", status: "Discovery", startDate: "", notes: "", assignedTo: "" });
    setShowForm(false);
  }

  async function handleStatusChange(id: string, status: string) {
    await fetch("/api/projects", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    setProjects(projects.map((p) => (p.id === id ? { ...p, status } : p)));
  }

  async function handleNotesUpdate(id: string, notes: string) {
    await fetch("/api/projects", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, notes }),
    });
    setProjects(projects.map((p) => (p.id === id ? { ...p, notes } : p)));
  }

  async function handleAssignedToUpdate(id: string, assignedTo: string) {
    await fetch("/api/projects", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, assignedTo }),
    });
    setProjects(projects.map((p) => (p.id === id ? { ...p, assignedTo } : p)));
  }

  return (
    <div className="animate-fade-in">
      <div className="flex items-start justify-between mb-8">
        <div>
          <span className="font-mono-brand text-xs uppercase tracking-widest text-clay font-bold">
            Client Work
          </span>
          <h1 className="font-heading font-extrabold text-3xl md:text-4xl text-moss mt-2">
            Projects
          </h1>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="magnetic-btn bg-clay text-cream px-5 py-2.5 rounded-full font-heading font-medium text-sm flex items-center gap-2"
        >
          <span className="btn-bg-slide bg-moss" />
          <span className="relative z-10 flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add Project
          </span>
        </button>
      </div>

      {showForm && (
        <div className="bg-moss/[0.03] border border-moss/10 rounded-[2rem] p-6 md:p-8 mb-8">
          <h3 className="font-heading font-bold text-lg text-moss mb-4">New Project</h3>
          <form onSubmit={handleAdd} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                required
                placeholder="Project name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-cream border border-moss/15 text-moss font-subheading placeholder:text-moss/40 focus:outline-none focus:ring-2 focus:ring-clay/40 transition-shadow"
              />
              <input
                required
                placeholder="Client name"
                value={form.client}
                onChange={(e) => setForm({ ...form, client: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-cream border border-moss/15 text-moss font-subheading placeholder:text-moss/40 focus:outline-none focus:ring-2 focus:ring-clay/40 transition-shadow"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-cream border border-moss/15 text-moss font-subheading focus:outline-none focus:ring-2 focus:ring-clay/40 transition-shadow appearance-none"
              >
                {statuses.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <input
                type="date"
                value={form.startDate}
                onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-cream border border-moss/15 text-moss font-subheading focus:outline-none focus:ring-2 focus:ring-clay/40 transition-shadow"
              />
              <input
                placeholder="Assigned to"
                value={form.assignedTo}
                onChange={(e) => setForm({ ...form, assignedTo: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-cream border border-moss/15 text-moss font-subheading placeholder:text-moss/40 focus:outline-none focus:ring-2 focus:ring-clay/40 transition-shadow"
              />
            </div>
            <textarea
              placeholder="Notes..."
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              rows={3}
              className="w-full px-4 py-3 rounded-xl bg-cream border border-moss/15 text-moss font-subheading placeholder:text-moss/40 focus:outline-none focus:ring-2 focus:ring-clay/40 transition-shadow resize-none"
            />
            <div className="flex gap-3">
              <button
                type="submit"
                className="magnetic-btn bg-moss text-cream px-6 py-2.5 rounded-full font-heading font-medium text-sm"
              >
                <span className="btn-bg-slide bg-clay" />
                <span className="relative z-10">Create Project</span>
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-6 py-2.5 rounded-full font-subheading text-sm text-moss/60 hover:text-moss transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-moss/[0.03] border border-moss/10 rounded-[2rem] overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-moss/10">
              <TableHead className="font-mono-brand text-[10px] uppercase tracking-widest text-moss/50 font-bold">Project</TableHead>
              <TableHead className="font-mono-brand text-[10px] uppercase tracking-widest text-moss/50 font-bold">Client</TableHead>
              <TableHead className="font-mono-brand text-[10px] uppercase tracking-widest text-moss/50 font-bold">Status</TableHead>
              <TableHead className="font-mono-brand text-[10px] uppercase tracking-widest text-moss/50 font-bold">Assigned To</TableHead>
              <TableHead className="font-mono-brand text-[10px] uppercase tracking-widest text-moss/50 font-bold">Start Date</TableHead>
              <TableHead className="font-mono-brand text-[10px] uppercase tracking-widest text-moss/50 font-bold w-10"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.map((p) => (
              <React.Fragment key={p.id}>
                <TableRow className="border-moss/10 hover:bg-moss/[0.02]">
                  <TableCell className="font-subheading font-medium text-moss">{p.name}</TableCell>
                  <TableCell className="font-subheading text-moss/70">{p.client}</TableCell>
                  <TableCell>
                    <select
                      value={p.status}
                      onChange={(e) => handleStatusChange(p.id, e.target.value)}
                      className={`font-mono-brand text-[10px] uppercase tracking-widest font-bold px-3 py-1 rounded-full border appearance-none cursor-pointer ${
                        statusColors[p.status] || "bg-moss/10 text-moss"
                      }`}
                    >
                      {statuses.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </TableCell>
                  <TableCell>
                    <input
                      defaultValue={p.assignedTo}
                      onBlur={(e) => handleAssignedToUpdate(p.id, e.target.value)}
                      placeholder="—"
                      className="font-subheading text-sm text-moss bg-transparent border-b border-transparent hover:border-moss/20 focus:border-clay/40 focus:outline-none transition-colors w-32 placeholder:text-moss/30"
                    />
                  </TableCell>
                  <TableCell className="font-subheading text-sm text-moss/70">
                    {new Date(p.startDate).toLocaleDateString("en-ZA")}
                  </TableCell>
                  <TableCell>
                    <button
                      onClick={() => setExpandedId(expandedId === p.id ? null : p.id)}
                      className="text-moss/40 hover:text-moss transition-colors"
                    >
                      {expandedId === p.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </TableCell>
                </TableRow>
                {expandedId === p.id && (
                  <TableRow className="border-moss/10">
                    <TableCell colSpan={6} className="bg-moss/[0.02] px-6 py-5">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Milestones */}
                        <div>
                          <p className="font-mono-brand text-[10px] uppercase tracking-widest text-moss/40 font-bold mb-4">
                            Milestones
                          </p>
                          <MilestoneTimeline projectId={p.id} />
                        </div>

                        {/* Notes */}
                        <div>
                          <p className="font-mono-brand text-[10px] uppercase tracking-widest text-moss/40 font-bold mb-4">
                            Activity Notes
                          </p>
                          <textarea
                            defaultValue={p.notes}
                            onBlur={(e) => handleNotesUpdate(p.id, e.target.value)}
                            rows={6}
                            className="w-full px-4 py-3 rounded-xl bg-cream border border-moss/15 text-moss font-subheading text-sm placeholder:text-moss/40 focus:outline-none focus:ring-2 focus:ring-clay/40 transition-shadow resize-none"
                            placeholder="Add notes or activity log..."
                          />
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
        {projects.length === 0 && (
          <div className="p-8 text-center">
            <p className="text-moss/40 font-subheading">No projects yet. Add your first project above.</p>
          </div>
        )}
      </div>
    </div>
  );
}
