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
      price: parseFloat(body.price) || 0,
      pricingModel: body.pricingModel,
    },
  });
  return NextResponse.json(agent, { status: 201 });
}

export async function PATCH(req: NextRequest) {
  const body = await req.json();
  const agent = await prisma.agent.update({
    where: { id: body.id },
    data: {
      ...(body.name && { name: body.name }),
      ...(body.client && { client: body.client }),
      ...(body.saleDate && { saleDate: new Date(body.saleDate) }),
      ...(body.price !== undefined && { price: parseFloat(body.price) || 0 }),
      ...(body.pricingModel && { pricingModel: body.pricingModel }),
    },
  });
  return NextResponse.json(agent);
}

export async function DELETE(req: NextRequest) {
  const body = await req.json();
  await prisma.agent.delete({ where: { id: body.id } });
  return NextResponse.json({ success: true });
}
