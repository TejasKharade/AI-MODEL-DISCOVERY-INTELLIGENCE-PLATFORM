import { modelDto, modelInclude, serverError } from "@/lib/catalog";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(_request: Request, context: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await context.params;
    const lab = await prisma.lab.findUnique({ where: { slug }, include: { models: { include: modelInclude, orderBy: { releaseDate: "desc" } } } });
    if (!lab) return Response.json({ error: "Lab not found." }, { status: 404 });
    return Response.json({ name: lab.name, slug: lab.slug, description: lab.description, website: lab.website, models: lab.models.map(modelDto) });
  } catch (error) { return serverError(error); }
}
