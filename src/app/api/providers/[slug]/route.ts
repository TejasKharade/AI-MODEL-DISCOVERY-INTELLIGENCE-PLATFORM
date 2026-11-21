import { modelDto, modelInclude, serverError } from "@/lib/catalog";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(_request: Request, context: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await context.params;
    const provider = await prisma.provider.findUnique({ where: { slug }, include: { offerings: { include: { model: { include: modelInclude } } } } });
    if (!provider) return Response.json({ error: "Provider not found." }, { status: 404 });
    return Response.json({ name: provider.name, slug: provider.slug, description: provider.description, website: provider.website, models: provider.offerings.map((offering) => modelDto(offering.model)).sort((a, b) => b.releaseDate.localeCompare(a.releaseDate)) });
  } catch (error) { return serverError(error); }
}
