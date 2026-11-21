import { serverError } from "@/lib/catalog";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const providers = await prisma.provider.findMany({ include: { _count: { select: { offerings: true } } }, orderBy: { name: "asc" } });
    return Response.json({ items: providers.map((provider) => ({ name: provider.name, slug: provider.slug, description: provider.description, website: provider.website, modelCount: provider._count.offerings })) });
  } catch (error) { return serverError(error); }
}
