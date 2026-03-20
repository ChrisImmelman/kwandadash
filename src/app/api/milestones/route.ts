import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const projectId = searchParams.get("projectId");
  const milestones = await prisma.milestone.findMany({
    where: projectId ? { projectId } : undefined,
    orderBy: { dueDate: "asc" },
  });
  return NextResponse.json(milestones);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const milestone = await prisma.milestone.create({
    data: {
      projectId: body.projectId,
      title: body.title,
      dueDate: new Date(body.dueDate),
      status: body.status || "pending",
    },
  });
  return NextResponse.json(milestone, { status: 201 });
}

export async function PATCH(req: NextRequest) {
  const body = await req.json();
  const milestone = await prisma.milestone.update({
    where: { id: body.id },
    data: {
      ...(body.status && { status: body.status }),
      ...(body.title && { title: body.title }),
      ...(body.dueDate && { dueDate: new Date(body.dueDate) }),
    },
  });
  return NextResponse.json(milestone);
}

export async function DELETE(req: NextRequest) {
  const body = await req.json();
  await prisma.milestone.delete({ where: { id: body.id } });
  return NextResponse.json({ ok: true });
}
