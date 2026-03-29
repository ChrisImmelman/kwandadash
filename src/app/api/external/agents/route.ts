import { prisma } from "@/lib/db";
import { validateApiKey } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  if (!(await validateApiKey(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  if (!body.name || !body.client || !body.pricingModel) {
    return NextResponse.json(
      { error: "name, client, and pricingModel are required" },
      { status: 400 }
    );
  }

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
