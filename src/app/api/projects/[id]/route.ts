import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();

  const project = await prisma.project.update({
    where: { id },
    data: {
      ...(body.status && { status: body.status }),
      ...(body.name && { name: body.name }),
      ...(body.client && { client: body.client }),
      ...(body.notes !== undefined && { notes: body.notes }),
      ...(body.assignedTo !== undefined && { assignedTo: body.assignedTo }),
      ...(body.value !== undefined && { value: parseFloat(body.value) }),
    },
  });

  return NextResponse.json(project);
}
