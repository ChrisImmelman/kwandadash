"use client";

import { useEffect, useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Bot, TrendingUp } from "lucide-react";

interface Agent {
  id: string;
  name: string;
  client: string;
  saleDate: string;
  price: number;
  pricingModel: string;
}

export default function AgentsPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: "",
    client: "",
    saleDate: "",
    price: "",
    pricingModel: "one-time",
  });

  useEffect(() => {
    fetch("/api/agents").then((r) => r.json()).then(setAgents);
  }, []);

  const stats = useMemo(() => {
    const total = agents.length;
    const mrr = agents
      .filter((a) => a.pricingModel === "monthly")
      .reduce((sum, a) => sum + a.price, 0);
    return { total, mrr };
  }, [agents]);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/agents", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const agent = await res.json();
    setAgents([agent, ...agents]);
    setForm({ name: "", client: "", saleDate: "", price: "", pricingModel: "one-time" });
    setShowForm(false);
  }

  return (
    <div className="animate-fade-in">
      <div className="flex items-start justify-between mb-8">
        <div>
          <span className="font-mono-brand text-xs uppercase tracking-widest text-clay font-bold">
            Sales
          </span>
          <h1 className="font-heading font-extrabold text-3xl md:text-4xl text-moss mt-2">
            Agents
          </h1>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="magnetic-btn bg-clay text-cream px-5 py-2.5 rounded-full font-heading font-medium text-sm flex items-center gap-2"
        >
          <span className="btn-bg-slide bg-moss" />
          <span className="relative z-10 flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add Agent
          </span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 mb-8">
        <div className="bg-moss/[0.03] border border-moss/10 rounded-[2rem] p-6">
          <div className="w-10 h-10 bg-clay/10 rounded-xl flex items-center justify-center mb-3">
            <Bot className="w-5 h-5 text-clay" />
          </div>
          <p className="font-mono-brand text-[10px] uppercase tracking-widest text-moss/50 font-semibold mb-1">
            Total Agents Sold
          </p>
          <p className="font-heading font-extrabold text-2xl text-moss">
            {stats.total}
          </p>
        </div>
        <div className="bg-moss/[0.03] border border-moss/10 rounded-[2rem] p-6">
          <div className="w-10 h-10 bg-clay/10 rounded-xl flex items-center justify-center mb-3">
            <TrendingUp className="w-5 h-5 text-clay" />
          </div>
          <p className="font-mono-brand text-[10px] uppercase tracking-widest text-moss/50 font-semibold mb-1">
            Monthly Recurring Revenue
          </p>
          <p className="font-heading font-extrabold text-2xl text-moss">
            R{stats.mrr.toLocaleString("en-ZA")}
          </p>
        </div>
      </div>

      {showForm && (
        <div className="bg-moss/[0.03] border border-moss/10 rounded-[2rem] p-6 md:p-8 mb-8">
          <h3 className="font-heading font-bold text-lg text-moss mb-4">New Agent Sale</h3>
          <form onSubmit={handleAdd} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                required
                placeholder="Agent name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-cream border border-moss/15 text-moss font-subheading placeholder:text-moss/40 focus:outline-none focus:ring-2 focus:ring-clay/40 transition-shadow"
              />
              <input
                required
                placeholder="Buyer / Client"
                value={form.client}
                onChange={(e) => setForm({ ...form, client: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-cream border border-moss/15 text-moss font-subheading placeholder:text-moss/40 focus:outline-none focus:ring-2 focus:ring-clay/40 transition-shadow"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <input
                type="date"
                value={form.saleDate}
                onChange={(e) => setForm({ ...form, saleDate: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-cream border border-moss/15 text-moss font-subheading focus:outline-none focus:ring-2 focus:ring-clay/40 transition-shadow"
              />
              <input
                required
                type="number"
                step="0.01"
                placeholder="Price (R)"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-cream border border-moss/15 text-moss font-subheading placeholder:text-moss/40 focus:outline-none focus:ring-2 focus:ring-clay/40 transition-shadow"
              />
              <select
                value={form.pricingModel}
                onChange={(e) => setForm({ ...form, pricingModel: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-cream border border-moss/15 text-moss font-subheading focus:outline-none focus:ring-2 focus:ring-clay/40 transition-shadow appearance-none"
              >
                <option value="one-time">One-time</option>
                <option value="monthly">Monthly Recurring</option>
              </select>
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                className="magnetic-btn bg-moss text-cream px-6 py-2.5 rounded-full font-heading font-medium text-sm"
              >
                <span className="btn-bg-slide bg-clay" />
                <span className="relative z-10">Add Agent</span>
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
              <TableHead className="font-mono-brand text-[10px] uppercase tracking-widest text-moss/50 font-bold">Agent Name</TableHead>
              <TableHead className="font-mono-brand text-[10px] uppercase tracking-widest text-moss/50 font-bold">Client</TableHead>
              <TableHead className="font-mono-brand text-[10px] uppercase tracking-widest text-moss/50 font-bold">Sale Date</TableHead>
              <TableHead className="font-mono-brand text-[10px] uppercase tracking-widest text-moss/50 font-bold">Pricing</TableHead>
              <TableHead className="font-mono-brand text-[10px] uppercase tracking-widest text-moss/50 font-bold text-right">Price</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {agents.map((a) => (
              <TableRow key={a.id} className="border-moss/10 hover:bg-moss/[0.02]">
                <TableCell className="font-subheading font-medium text-moss">{a.name}</TableCell>
                <TableCell className="font-subheading text-moss/70">{a.client}</TableCell>
                <TableCell className="font-subheading text-sm text-moss/70">
                  {new Date(a.saleDate).toLocaleDateString("en-ZA")}
                </TableCell>
                <TableCell>
                  <span className={`font-mono-brand text-[10px] uppercase tracking-widest font-bold px-3 py-1 rounded-full border ${
                    a.pricingModel === "monthly"
                      ? "bg-clay/10 text-clay border-clay/20"
                      : "bg-moss/10 text-moss border-moss/20"
                  }`}>
                    {a.pricingModel === "monthly" ? "Recurring" : "One-time"}
                  </span>
                </TableCell>
                <TableCell className="text-right font-heading font-bold text-moss">
                  R{a.price.toLocaleString("en-ZA")}
                  {a.pricingModel === "monthly" && (
                    <span className="font-subheading font-normal text-moss/50 text-xs">/mo</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {agents.length === 0 && (
          <div className="p-8 text-center">
            <p className="text-moss/40 font-subheading">No agents sold yet. Add your first sale above.</p>
          </div>
        )}
      </div>
    </div>
  );
}
