-- Clear existing data
DELETE FROM "Project";
DELETE FROM "FinanceEntry";
DELETE FROM "Agent";

-- Projects
INSERT INTO "Project" (id, name, client, status, startDate, notes, createdAt, updatedAt) VALUES
  ('proj1', 'AI Customer Support Bot', 'TechVentures SA', 'In Progress', '2026-02-01T00:00:00.000Z', 'Phase 2: Integrating with their CRM. Weekly syncs on Tuesdays.', '2026-02-01T00:00:00.000Z', '2026-03-15T00:00:00.000Z'),
  ('proj2', 'Internal Knowledge Agent', 'CapitalGroup', 'Discovery', '2026-03-10T00:00:00.000Z', 'Scoping session completed. Awaiting data access.', '2026-03-10T00:00:00.000Z', '2026-03-18T00:00:00.000Z'),
  ('proj3', 'Document Processing Pipeline', 'LegalEase', 'Delivered', '2025-11-15T00:00:00.000Z', 'Delivered Jan 2026. Client satisfied. Monitoring for 30 days.', '2025-11-15T00:00:00.000Z', '2026-01-20T00:00:00.000Z'),
  ('proj4', 'Sales Lead Qualifier', 'GrowthCo', 'Maintenance', '2025-09-01T00:00:00.000Z', 'Monthly retainer. Last update: improved response accuracy by 12%.', '2025-09-01T00:00:00.000Z', '2026-03-10T00:00:00.000Z'),
  ('proj5', 'Inventory Forecasting Agent', 'RetailMax', 'In Progress', '2026-01-20T00:00:00.000Z', 'Training model on 3 years of historical data.', '2026-01-20T00:00:00.000Z', '2026-03-19T00:00:00.000Z');

-- Finance Entries
INSERT INTO "FinanceEntry" (id, type, category, amount, description, date, createdAt) VALUES
  ('fin1', 'income', 'Consulting', 85000, 'TechVentures SA - AI Support Bot Phase 2', '2026-03-05T00:00:00.000Z', '2026-03-05T00:00:00.000Z'),
  ('fin2', 'income', 'Agent Sale', 25000, 'Lead Qualifier Agent - GrowthCo', '2026-03-01T00:00:00.000Z', '2026-03-01T00:00:00.000Z'),
  ('fin3', 'income', 'Consulting', 45000, 'CapitalGroup - Discovery Workshop', '2026-03-12T00:00:00.000Z', '2026-03-12T00:00:00.000Z'),
  ('fin4', 'expense', 'Agent Sale', 12000, 'OpenAI API costs - March', '2026-03-15T00:00:00.000Z', '2026-03-15T00:00:00.000Z'),
  ('fin5', 'expense', 'Consulting', 8500, 'Cloud hosting - Azure', '2026-03-10T00:00:00.000Z', '2026-03-10T00:00:00.000Z'),
  ('fin6', 'income', 'Agent Sale', 15000, 'Document Agent License - LegalEase', '2026-02-28T00:00:00.000Z', '2026-02-28T00:00:00.000Z'),
  ('fin7', 'income', 'Consulting', 35000, 'RetailMax - Inventory Agent Sprint 3', '2026-03-18T00:00:00.000Z', '2026-03-18T00:00:00.000Z'),
  ('fin8', 'expense', 'Consulting', 5000, 'Contractor - ML Engineer', '2026-03-08T00:00:00.000Z', '2026-03-08T00:00:00.000Z');

-- Agents
INSERT INTO "Agent" (id, name, client, saleDate, price, pricingModel, createdAt) VALUES
  ('agent1', 'LeadQualifier Pro', 'GrowthCo', '2026-03-01T00:00:00.000Z', 4500, 'monthly', '2026-03-01T00:00:00.000Z'),
  ('agent2', 'DocProcessor', 'LegalEase', '2026-01-15T00:00:00.000Z', 15000, 'one-time', '2026-01-15T00:00:00.000Z'),
  ('agent3', 'SupportBot Elite', 'TechVentures SA', '2026-03-10T00:00:00.000Z', 6500, 'monthly', '2026-03-10T00:00:00.000Z'),
  ('agent4', 'InventoryOracle', 'RetailMax', '2026-02-20T00:00:00.000Z', 3500, 'monthly', '2026-02-20T00:00:00.000Z'),
  ('agent5', 'EmailTriager', 'CapitalGroup', '2026-03-15T00:00:00.000Z', 8000, 'one-time', '2026-03-15T00:00:00.000Z'),
  ('agent6', 'MeetingSummarizer', 'InnovateCorp', '2026-03-18T00:00:00.000Z', 2500, 'monthly', '2026-03-18T00:00:00.000Z');
