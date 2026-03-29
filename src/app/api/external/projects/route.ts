import { prisma } from "@/lib/db";
import { validateApiKey } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  if (!(await validateApiKey(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  if (!body.name || !body.client) {
    return NextResponse.json({ error: "name and client are required" }, { status: 400 });
  }

  const project = await prisma.project.create({
    data: {
      name: body.name,
      client: body.client,
      status: body.status || "Discovery",
      startDate: body.startDate ? new Date(body.startDate) : new Date(),
      notes: body.notes || "",
      assignedTo: body.assignedTo || "",
      value: body.value ? parseFloat(body.value) : 0,
    },
  });

  return NextResponse.json(project, { status: 201 });
}
