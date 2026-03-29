import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const projects = await prisma.project.findMany({
    orderBy: { updatedAt: "desc" },
  });
  return NextResponse.json(projects);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
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

export async function PATCH(req: NextRequest) {
  const body = await req.json();
  const project = await prisma.project.update({
    where: { id: body.id },
    data: {
      ...(body.status && { status: body.status }),
      ...(body.notes !== undefined && { notes: body.notes }),
      ...(body.name && { name: body.name }),
      ...(body.client && { client: body.client }),
      ...(body.assignedTo !== undefined && { assignedTo: body.assignedTo }),
      ...(body.value !== undefined && { value: parseFloat(body.value) }),
    },
  });
  return NextResponse.json(project);
}
