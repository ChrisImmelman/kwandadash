import { prisma } from "./db";
import { NextRequest } from "next/server";

export async function validateApiKey(req: NextRequest): Promise<boolean> {
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) return false;
  const key = authHeader.slice(7).trim();
  if (!key) return false;
  const apiKey = await prisma.apiKey.findUnique({ where: { key } });
  return !!apiKey;
}
