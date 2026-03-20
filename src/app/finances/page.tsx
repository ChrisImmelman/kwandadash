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
import { Plus, TrendingUp, TrendingDown, ArrowUpDown } from "lucide-react";

interface FinanceEntry {
  id: string;
  type: string;
  category: string;
  amount: number;
  description: string;
  date: string;
}

export default function FinancesPage() {
  const [entries, setEntries] = useState<FinanceEntry[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    type: "income",
    category: "Consulting",
    amount: "",
    description: "",
    date: "",
  });

  useEffect(() => {
    fetch("/api/finances").then((r) => r.json()).then(setEntries);
  }, []);

  const summary = useMemo(() => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthEntries = entries.filter(
      (e) => new Date(e.date) >= startOfMonth
    );
    const totalIn = monthEntries
      .filter((e) => e.type === "income")
      .reduce((sum, e) => sum + e.amount, 0);
    const totalOut = monthEntries
      .filter((e) => e.type === "expense")
      .reduce((sum, e) => sum + e.amount, 0);
    return { totalIn, totalOut, net: totalIn - totalOut };
  }, [entries]);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/finances", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const entry = await res.json();
    setEntries([entry, ...entries]);
    setForm({ type: "income", category: "Consulting", amount: "", description: "", date: "" });
    setShowForm(false);
  }

  return (
    <div className="animate-fade-in">
      <div className="flex items-start justify-between mb-8">
        <div>
          <span className="font-mono-brand text-xs uppercase tracking-widest text-clay font-bold">
            Money
          </span>
          <h1 className="font-heading font-extrabold text-3xl md:text-4xl text-moss mt-2">
            Finances
          </h1>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="magnetic-btn bg-clay text-cream px-5 py-2.5 rounded-full font-heading font-medium text-sm flex items-center gap-2"
        >
          <span className="btn-bg-slide bg-moss" />
          <span className="relative z-10 flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add Entry
          </span>
        </button>
      </div>

      {/* Monthly Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 mb-8">
        <div className="bg-moss/[0.03] border border-moss/10 rounded-[2rem] p-6">
          <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center mb-3">
            <TrendingUp className="w-5 h-5 text-green-700" />
          </div>
          <p className="font-mono-brand text-[10px] uppercase tracking-widest text-moss/50 font-semibold mb-1">
            Total In (Month)
          </p>
          <p className="font-heading font-extrabold text-2xl text-green-700">
            R{summary.totalIn.toLocaleString("en-ZA")}
          </p>
        </div>
        <div className="bg-moss/[0.03] border border-moss/10 rounded-[2rem] p-6">
          <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center mb-3">
            <TrendingDown className="w-5 h-5 text-red-600" />
          </div>
          <p className="font-mono-brand text-[10px] uppercase tracking-widest text-moss/50 font-semibold mb-1">
            Total Out (Month)
          </p>
          <p className="font-heading font-extrabold text-2xl text-red-600">
            R{summary.totalOut.toLocaleString("en-ZA")}
          </p>
        </div>
        <div className="bg-moss/[0.03] border border-moss/10 rounded-[2rem] p-6">
          <div className="w-10 h-10 bg-clay/10 rounded-xl flex items-center justify-center mb-3">
            <ArrowUpDown className="w-5 h-5 text-clay" />
          </div>
          <p className="font-mono-brand text-[10px] uppercase tracking-widest text-moss/50 font-semibold mb-1">
            Net (Month)
          </p>
          <p className={`font-heading font-extrabold text-2xl ${summary.net >= 0 ? "text-green-700" : "text-red-600"}`}>
            R{summary.net.toLocaleString("en-ZA")}
          </p>
        </div>
      </div>

      {showForm && (
        <div className="bg-moss/[0.03] border border-moss/10 rounded-[2rem] p-6 md:p-8 mb-8">
          <h3 className="font-heading font-bold text-lg text-moss mb-4">New Entry</h3>
          <form onSubmit={handleAdd} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-cream border border-moss/15 text-moss font-subheading focus:outline-none focus:ring-2 focus:ring-clay/40 transition-shadow appearance-none"
              >
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-cream border border-moss/15 text-moss font-subheading focus:outline-none focus:ring-2 focus:ring-clay/40 transition-shadow appearance-none"
              >
                <option value="Consulting">Consulting</option>
                <option value="Agent Sale">Agent Sale</option>
              </select>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                required
                type="number"
                step="0.01"
                placeholder="Amount (R)"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-cream border border-moss/15 text-moss font-subheading placeholder:text-moss/40 focus:outline-none focus:ring-2 focus:ring-clay/40 transition-shadow"
              />
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-cream border border-moss/15 text-moss font-subheading focus:outline-none focus:ring-2 focus:ring-clay/40 transition-shadow"
              />
            </div>
            <input
              required
              placeholder="Description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-cream border border-moss/15 text-moss font-subheading placeholder:text-moss/40 focus:outline-none focus:ring-2 focus:ring-clay/40 transition-shadow"
            />
            <div className="flex gap-3">
              <button
                type="submit"
                className="magnetic-btn bg-moss text-cream px-6 py-2.5 rounded-full font-heading font-medium text-sm"
              >
                <span className="btn-bg-slide bg-clay" />
                <span className="relative z-10">Add Entry</span>
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
              <TableHead className="font-mono-brand text-[10px] uppercase tracking-widest text-moss/50 font-bold">Date</TableHead>
              <TableHead className="font-mono-brand text-[10px] uppercase tracking-widest text-moss/50 font-bold">Description</TableHead>
              <TableHead className="font-mono-brand text-[10px] uppercase tracking-widest text-moss/50 font-bold">Category</TableHead>
              <TableHead className="font-mono-brand text-[10px] uppercase tracking-widest text-moss/50 font-bold">Type</TableHead>
              <TableHead className="font-mono-brand text-[10px] uppercase tracking-widest text-moss/50 font-bold text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {entries.map((e) => (
              <TableRow key={e.id} className="border-moss/10 hover:bg-moss/[0.02]">
                <TableCell className="font-subheading text-sm text-moss/70">
                  {new Date(e.date).toLocaleDateString("en-ZA")}
                </TableCell>
                <TableCell className="font-subheading font-medium text-moss">{e.description}</TableCell>
                <TableCell>
                  <span className="font-mono-brand text-[10px] uppercase tracking-widest font-bold text-clay border border-clay/20 px-2 py-0.5 rounded-full">
                    {e.category}
                  </span>
                </TableCell>
                <TableCell>
                  <span className={`font-mono-brand text-[10px] uppercase tracking-widest font-bold ${
                    e.type === "income" ? "text-green-700" : "text-red-600"
                  }`}>
                    {e.type}
                  </span>
                </TableCell>
                <TableCell className={`text-right font-heading font-bold ${
                  e.type === "income" ? "text-green-700" : "text-red-600"
                }`}>
                  {e.type === "income" ? "+" : "-"}R{Math.abs(e.amount).toLocaleString("en-ZA")}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {entries.length === 0 && (
          <div className="p-8 text-center">
            <p className="text-moss/40 font-subheading">No entries yet. Add your first transaction above.</p>
          </div>
        )}
      </div>
    </div>
  );
}
