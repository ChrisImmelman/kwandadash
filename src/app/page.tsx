import { prisma } from "@/lib/db";
import { CheckCircle2, LayoutDashboard, DollarSign, Bot, Briefcase } from "lucide-react";

export const dynamic = "force-dynamic";

function monthsElapsed(from: Date, to: Date): number {
  const months =
    (to.getFullYear() - from.getFullYear()) * 12 +
    (to.getMonth() - from.getMonth());
  return Math.max(0, months);
}

async function getKPIs() {
  const now = new Date();

  const [completedProjects, activeProjects, deliveredRevenue, agents, activeProjectRevenue] =
    await Promise.all([
      prisma.project.count({
        where: { status: "Delivered" },
      }),
      prisma.project.count({
        where: { status: { in: ["Discovery", "In Progress", "Maintenance"] } },
      }),
      prisma.project.aggregate({
        _sum: { value: true },
        where: { status: "Delivered" },
      }),
      prisma.agent.findMany({
        select: { price: true, pricingModel: true, saleDate: true },
      }),
      prisma.project.aggregate({
        _sum: { value: true },
        where: { status: { in: ["Discovery", "In Progress", "Maintenance"] } },
      }),
    ]);

  // Free trial = R0. One-time = full price. Monthly = price × full months elapsed.
  const agentRevenue = agents.reduce((sum, agent) => {
    if (agent.pricingModel === "free-trial") return sum;
    if (agent.pricingModel === "monthly") {
      return sum + agent.price * monthsElapsed(new Date(agent.saleDate), now);
    }
    return sum + agent.price;
  }, 0);

  const agentsSold = agents.length;
  const totalRevenue = (deliveredRevenue._sum.value ?? 0) + agentRevenue;

  return {
    completedProjects,
    activeProjects,
    totalRevenue,
    agentsSold,
    activeProjectRevenue: activeProjectRevenue._sum.value ?? 0,
  };
}

export default async function DashboardPage() {
  const kpis = await getKPIs();

  const cards = [
    {
      label: "Completed Projects",
      value: kpis.completedProjects.toString(),
      icon: CheckCircle2,
    },
    {
      label: "Active Projects",
      value: kpis.activeProjects.toString(),
      icon: LayoutDashboard,
    },
    {
      label: "Total Revenue",
      value: `R${kpis.totalRevenue.toLocaleString("en-ZA")}`,
      icon: DollarSign,
    },
    {
      label: "Agents Sold",
      value: kpis.agentsSold.toString(),
      icon: Bot,
    },
    {
      label: "Active Project Revenue",
      value: `R${kpis.activeProjectRevenue.toLocaleString("en-ZA")}`,
      icon: Briefcase,
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 md:gap-6">
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
        <LiveAgentsCard />
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

async function LiveAgentsCard() {
  const agents = await prisma.agent.findMany({
    orderBy: { saleDate: "desc" },
  });

  const pricingColors: Record<string, string> = {
    monthly: "bg-clay/10 text-clay",
    "one-time": "bg-moss/10 text-moss",
    "free-trial": "bg-amber-50 text-amber-700",
  };

  const pricingLabels: Record<string, string> = {
    monthly: "Recurring",
    "one-time": "One-time",
    "free-trial": "Free Trial",
  };

  return (
    <div className="bg-moss/[0.03] border border-moss/10 rounded-[2rem] p-6 md:p-8">
      <h2 className="font-heading font-bold text-lg text-moss mb-4">Live Agents</h2>
      <div className="space-y-3">
        {agents.map((a) => (
          <div key={a.id} className="flex items-center justify-between">
            <div>
              <p className="font-subheading font-medium text-sm text-moss">{a.name}</p>
              <p className="font-subheading text-xs text-moss/50">{a.client}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className={`font-mono-brand text-[10px] uppercase tracking-widest font-bold px-3 py-1 rounded-full ${pricingColors[a.pricingModel] || "bg-moss/10 text-moss"}`}>
                {pricingLabels[a.pricingModel] || a.pricingModel}
              </span>
              <span className="font-heading font-bold text-sm text-moss">
                {a.pricingModel === "free-trial"
                  ? "Free"
                  : `R${a.price.toLocaleString("en-ZA")}${a.pricingModel === "monthly" ? "/mo" : ""}`}
              </span>
            </div>
          </div>
        ))}
        {agents.length === 0 && (
          <p className="text-moss/40 font-subheading text-sm">No agents yet</p>
        )}
      </div>
    </div>
  );
}
