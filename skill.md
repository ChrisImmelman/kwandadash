# Kwandadash API Skill

You have the ability to write data to the Kwanda internal business dashboard.

## Authentication

All requests must include an `Authorization` header with a Bearer token:

```
Authorization: Bearer <your-api-key>
```

API keys are generated from the Settings page in the dashboard.

## Base URL

```
http://localhost:3000
```

---

## Actions

### 1. Add a Project

Use this when asked to add, create, or log a new project.

```
POST /api/external/projects
Authorization: Bearer <key>
Content-Type: application/json

{
  "name": "Project name",        // required
  "client": "Client name",       // required
  "status": "Discovery",         // optional — Discovery | In Progress | Delivered | Maintenance (default: Discovery)
  "value": 5000,                 // optional — project value in ZAR
  "assignedTo": "Chris",         // optional
  "startDate": "2025-01-15",     // optional — ISO date string (default: today)
  "notes": "..."                 // optional
}
```

**Response:** The created project object with its `id`.

---

### 2. Mark a Project as Completed (Delivered)

Use this when asked to mark, complete, finish, or deliver a project. You will need the project `id` — fetch the project list first if you don't have it.

```
POST /api/external/projects/:id/complete
Authorization: Bearer <key>
```

No request body needed.

**Response:** The updated project object with `status: "Delivered"`.

---

### 3. Add an Agent

Use this when asked to add, log, or record a new agent sale.

```
POST /api/external/agents
Authorization: Bearer <key>
Content-Type: application/json

{
  "name": "Agent name",          // required
  "client": "Client name",       // required
  "pricingModel": "monthly",     // required — one-time | monthly | free-trial
  "price": 500,                  // required — monthly price or one-time fee in ZAR
  "saleDate": "2025-01-15"       // optional — ISO date string (default: today)
}
```

**Response:** The created agent object with its `id`.

---

## Getting Project IDs

If you need to find a project's `id` (e.g. before marking it complete), you can look it up using the internal projects API — note this endpoint does not require auth as it is used by the dashboard UI:

```
GET /api/projects
```

Returns an array of all projects. Match on `name` or `client` to find the right `id`.

---

## Status Values

| Status | Meaning |
|--------|---------|
| `Discovery` | Initial scoping / not started |
| `In Progress` | Actively being worked on |
| `Delivered` | Completed and handed over |
| `Maintenance` | Ongoing post-delivery support |

---

## Error Responses

| Code | Meaning |
|------|---------|
| `401` | Missing or invalid API key |
| `400` | Missing required fields — check the error message |
| `500` | Server error |

---

## Example Flows

**"Add project Alpha for Acme Corp worth R8000"**
```json
POST /api/external/projects
{ "name": "Alpha", "client": "Acme Corp", "value": 8000 }
```

**"Mark the Alpha project as done"**
1. `GET /api/projects` — find the project with `name: "Alpha"`, get its `id`
2. `POST /api/external/projects/{id}/complete`

**"Log a new monthly support agent for Acme at R1200/month"**
```json
POST /api/external/agents
{ "name": "Support Agent", "client": "Acme Corp", "pricingModel": "monthly", "price": 1200 }
```
