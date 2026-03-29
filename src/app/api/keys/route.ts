import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "crypto";

export async function GET() {
  const keys = await prisma.apiKey.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, name: true, createdAt: true },
  });
  return NextResponse.json(keys);
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  if (!body.name) {
    return NextResponse.json({ error: "name is required" }, { status: 400 });
  }

  const key = `kwanda_${randomBytes(24).toString("hex")}`;

  const apiKey = await prisma.apiKey.create({
    data: { name: body.name, key },
  });

  // Return the full key only on creation — it is never exposed again
  return NextResponse.json({ id: apiKey.id, name: apiKey.name, key, createdAt: apiKey.createdAt }, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  const body = await req.json();
  await prisma.apiKey.delete({ where: { id: body.id } });
  return NextResponse.json({ success: true });
}
