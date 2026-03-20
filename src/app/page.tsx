import { prisma } from "@/lib/db";
import { LayoutDashboard, DollarSign, Bot, TrendingUp } from "lucide-react";

export const dynamic = "force-dynamic";

async function getKPIs() {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [activeProjects, monthlyRevenue, agentsSoldThisMonth, recurringAgents] =
    await Promise.all([
      prisma.project.count({
        where: { status: { in: ["Discovery", "In Progress"] } },
      }),
      prisma.financeEntry.aggregate({
        _sum: { amount: true },
        where: { type: "income", date: { gte: startOfMonth } },
      }),
      prisma.agent.count({
        where: { saleDate: { gte: startOfMonth } },
      }),
      prisma.agent.aggregate({
        _sum: { price: true },
        where: { pricingModel: "monthly" },
      }),
    ]);

  return {
    activeProjects,
    monthlyRevenue: monthlyRevenue._sum.amount ?? 0,
    agentsSoldThisMonth,
    mrr: recurringAgents._sum.price ?? 0,
  };
}

export default async function DashboardPage() {
  const kpis = await getKPIs();

  const cards = [
    {
      label: "Active Projects",
      value: kpis.activeProjects.toString(),
      icon: LayoutDashboard,
    },
    {
      label: "Monthly Revenue",
      value: `R${kpis.monthlyRevenue.toLocaleString("en-ZA")}`,
      icon: DollarSign,
    },
    {
      label: "Agents Sold (Month)",
      value: kpis.agentsSoldThisMonth.toString(),
      icon: Bot,
    },
    {
      label: "MRR",
      value: `R${kpis.mrr.toLocaleString("en-ZA")}`,
      icon: TrendingUp,
    },
  ];

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <span className="font-mono-brand text-xs uppercase tracking-widest text-clay font-bold">
          Overview
        </span>
        <h1 className="font-heading font-extrabold text-3xl md:text-4xl text-moss mt-2">
          Dashboard
        </h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {cards.map((card) => (
          <div
            key={card.label}
            className="bg-moss/[0.03] border border-moss/10 rounded-[2rem] p-6 md:p-8 lift-on-hover"
          >
            <div className="w-10 h-10 bg-clay/10 rounded-xl flex items-center justify-center mb-4">
              <card.icon className="w-5 h-5 text-clay" />
            </div>
            <p className="font-mono-brand text-[10px] uppercase tracking-widest text-moss/50 font-semibold mb-1">
              {card.label}
            </p>
            <p className="font-heading font-extrabold text-2xl md:text-3xl text-moss">
              {card.value}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentProjectsCard />
        <RecentFinancesCard />
      </div>
    </div>
  );
}

async function RecentProjectsCard() {
  const projects = await prisma.project.findMany({
    orderBy: { updatedAt: "desc" },
    take: 5,
  });

  const statusColors: Record<string, string> = {
    Discovery: "bg-clay/10 text-clay",
    "In Progress": "bg-moss/10 text-moss",
    Delivered: "bg-green-100 text-green-800",
    Maintenance: "bg-amber-100 text-amber-800",
  };

  return (
    <div className="bg-moss/[0.03] border border-moss/10 rounded-[2rem] p-6 md:p-8">
      <h2 className="font-heading font-bold text-lg text-moss mb-4">Recent Projects</h2>
      <div className="space-y-3">
        {projects.map((p) => (
          <div key={p.id} className="flex items-center justify-between">
            <div>
              <p className="font-subheading font-medium text-sm text-moss">{p.name}</p>
              <p className="font-subheading text-xs text-moss/50">{p.client}</p>
            </div>
            <span
              className={`font-mono-brand text-[10px] uppercase tracking-widest font-bold px-3 py-1 rounded-full ${
                statusColors[p.status] || "bg-moss/10 text-moss"
              }`}
            >
              {p.status}
            </span>
          </div>
        ))}
        {projects.length === 0 && (
          <p className="text-moss/40 font-subheading text-sm">No projects yet</p>
        )}
      </div>
    </div>
  );
}

async function RecentFinancesCard() {
  const entries = await prisma.financeEntry.findMany({
    orderBy: { date: "desc" },
    take: 5,
  });

  return (
    <div className="bg-moss/[0.03] border border-moss/10 rounded-[2rem] p-6 md:p-8">
      <h2 className="font-heading font-bold text-lg text-moss mb-4">Recent Transactions</h2>
      <div className="space-y-3">
        {entries.map((e) => (
          <div key={e.id} className="flex items-center justify-between">
            <div>
              <p className="font-subheading font-medium text-sm text-moss">{e.description}</p>
              <p className="font-subheading text-xs text-moss/50">{e.category}</p>
            </div>
            <span
              className={`font-heading font-bold text-sm ${
                e.type === "income" ? "text-green-700" : "text-red-600"
              }`}
            >
              {e.type === "income" ? "+" : "-"}R{Math.abs(e.amount).toLocaleString("en-ZA")}
            </span>
          </div>
        ))}
        {entries.length === 0 && (
          <p className="text-moss/40 font-subheading text-sm">No transactions yet</p>
        )}
      </div>
    </div>
  );
}
