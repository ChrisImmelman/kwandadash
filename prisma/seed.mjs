import { PrismaClient } from "../src/generated/prisma/client.js";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.resolve(__dirname, "../dev.db");
const adapter = new PrismaLibSql({ url: `file:${dbPath}` });

const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.project.deleteMany();
  await prisma.financeEntry.deleteMany();
  await prisma.agent.deleteMany();

  await prisma.project.createMany({
    data: [
      { name: "AI Customer Support Bot", client: "TechVentures SA", status: "In Progress", startDate: new Date("2026-02-01"), notes: "Phase 2: Integrating with their CRM. Weekly syncs on Tuesdays.", value: 120000 },
      { name: "Internal Knowledge Agent", client: "CapitalGroup", status: "Discovery", startDate: new Date("2026-03-10"), notes: "Scoping session completed. Awaiting data access.", value: 85000 },
      { name: "Document Processing Pipeline", client: "LegalEase", status: "Delivered", startDate: new Date("2025-11-15"), notes: "Delivered Jan 2026. Client satisfied. Monitoring for 30 days.", value: 95000 },
      { name: "Sales Lead Qualifier", client: "GrowthCo", status: "Maintenance", startDate: new Date("2025-09-01"), notes: "Monthly retainer. Last update: improved response accuracy by 12%.", value: 48000 },
      { name: "Inventory Forecasting Agent", client: "RetailMax", status: "In Progress", startDate: new Date("2026-01-20"), notes: "Training model on 3 years of historical data.", value: 110000 },
    ],
  });

  await prisma.financeEntry.createMany({
    data: [
      { type: "income", category: "Consulting", amount: 85000, description: "TechVentures SA - AI Support Bot Phase 2", date: new Date("2026-03-05") },
      { type: "income", category: "Agent Sale", amount: 25000, description: "Lead Qualifier Agent - GrowthCo", date: new Date("2026-03-01") },
      { type: "income", category: "Consulting", amount: 45000, description: "CapitalGroup - Discovery Workshop", date: new Date("2026-03-12") },
      { type: "expense", category: "Agent Sale", amount: 12000, description: "OpenAI API costs - March", date: new Date("2026-03-15") },
      { type: "expense", category: "Consulting", amount: 8500, description: "Cloud hosting - Azure", date: new Date("2026-03-10") },
      { type: "income", category: "Agent Sale", amount: 15000, description: "Document Agent License - LegalEase", date: new Date("2026-02-28") },
      { type: "income", category: "Consulting", amount: 35000, description: "RetailMax - Inventory Agent Sprint 3", date: new Date("2026-03-18") },
      { type: "expense", category: "Consulting", amount: 5000, description: "Contractor - ML Engineer", date: new Date("2026-03-08") },
    ],
  });

  await prisma.agent.createMany({
    data: [
      { name: "LeadQualifier Pro", client: "GrowthCo", saleDate: new Date("2026-03-01"), price: 4500, pricingModel: "monthly" },
      { name: "DocProcessor", client: "LegalEase", saleDate: new Date("2026-01-15"), price: 15000, pricingModel: "one-time" },
      { name: "SupportBot Elite", client: "TechVentures SA", saleDate: new Date("2026-03-10"), price: 6500, pricingModel: "monthly" },
      { name: "InventoryOracle", client: "RetailMax", saleDate: new Date("2026-02-20"), price: 3500, pricingModel: "monthly" },
      { name: "EmailTriager", client: "CapitalGroup", saleDate: new Date("2026-03-15"), price: 8000, pricingModel: "one-time" },
      { name: "MeetingSummarizer", client: "InnovateCorp", saleDate: new Date("2026-03-18"), price: 2500, pricingModel: "monthly" },
    ],
  });

  console.log("Seed data created successfully!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
