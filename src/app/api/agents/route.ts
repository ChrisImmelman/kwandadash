import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const agents = await prisma.agent.findMany({
    orderBy: { saleDate: "desc" },
  });
  return NextResponse.json(agents);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const agent = await prisma.agent.create({
    data: {
      name: body.name,
      client: body.client,
      saleDate: body.saleDate ? new Date(body.saleDate) : new Date(),
      price: parseFloat(body.price),
      pricingModel: body.pricingModel,
    },
  });
  return NextResponse.json(agent, { status: 201 });
}
