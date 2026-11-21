import { modelDto, modelInclude, serverError } from "@/lib/catalog";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(_request: Request, context: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await context.params;
    const model = await prisma.model.findUnique({ where: { slug }, include: modelInclude });
    if (!model) return Response.json({ error: "Model not found." }, { status: 404 });
    return Response.json(modelDto(model));
  } catch (error) {
    return serverError(error);
  }
}
