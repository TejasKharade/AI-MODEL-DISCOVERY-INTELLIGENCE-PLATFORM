import { serverError } from "@/lib/catalog";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const [labs, providers, models] = await Promise.all([
      prisma.lab.findMany({ select: { name: true, slug: true }, orderBy: { name: "asc" } }),
      prisma.provider.findMany({ select: { name: true, slug: true }, orderBy: { name: "asc" } }),
      prisma.model.findMany({ select: { type: true, capabilities: true } }),
    ]);
    return Response.json({ labs, providers, types: [...new Set(models.map((model) => model.type))].sort(), capabilities: [...new Set(models.flatMap((model) => model.capabilities))].sort() });
  } catch (error) { return serverError(error); }
}
