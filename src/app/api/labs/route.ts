import { serverError } from "@/lib/catalog";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const labs = await prisma.lab.findMany({ include: { _count: { select: { models: true } } }, orderBy: { name: "asc" } });
    return Response.json({ items: labs.map((lab) => ({ name: lab.name, slug: lab.slug, description: lab.description, website: lab.website, modelCount: lab._count.models })) });
  } catch (error) { return serverError(error); }
}
