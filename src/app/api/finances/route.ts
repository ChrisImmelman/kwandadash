import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const entries = await prisma.financeEntry.findMany({
    orderBy: { date: "desc" },
  });
  return NextResponse.json(entries);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const entry = await prisma.financeEntry.create({
    data: {
      type: body.type,
      category: body.category,
      amount: parseFloat(body.amount),
      description: body.description,
      date: body.date ? new Date(body.date) : new Date(),
    },
  });
  return NextResponse.json(entry, { status: 201 });
}
