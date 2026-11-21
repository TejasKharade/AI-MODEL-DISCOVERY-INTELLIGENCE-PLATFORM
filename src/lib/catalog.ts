import { Prisma } from "@prisma/client";
import { prisma } from "./prisma";

export const modelInclude = {
  lab: true,
  offerings: { include: { provider: true } },
  results: { include: { benchmark: true } },
} satisfies Prisma.ModelInclude;

export type ModelRecord = Prisma.ModelGetPayload<{ include: typeof modelInclude }>;

export function modelDto(model: ModelRecord) {
  const offerings = model.offerings
    .map((offering) => ({
      provider: { name: offering.provider.name, slug: offering.provider.slug },
      inputPrice: offering.inputPricePerMillion === null ? null : Number(offering.inputPricePerMillion),
      outputPrice: offering.outputPricePerMillion === null ? null : Number(offering.outputPricePerMillion),
      currency: offering.currency,
      checkedAt: offering.checkedAt.toISOString(),
      sourceNote: offering.sourceNote,
    }))
    .sort((a, b) => (a.inputPrice ?? Infinity) - (b.inputPrice ?? Infinity));

  return {
    id: model.id,
    name: model.name,
    slug: model.slug,
    summary: model.summary,
    description: model.description,
    type: model.type,
    releaseDate: model.releaseDate.toISOString(),
    contextWindow: model.contextWindow,
    maxOutput: model.maxOutput,
    modalities: model.modalities,
    capabilities: model.capabilities,
    status: model.status,
    lab: { name: model.lab.name, slug: model.lab.slug },
    offerings,
    startingInputPrice: offerings[0]?.inputPrice ?? null,
    results: model.results.map((result) => ({
      benchmark: { name: result.benchmark.name, slug: result.benchmark.slug, category: result.benchmark.category, description: result.benchmark.description, unit: result.benchmark.unit },
      score: Number(result.score),
      asOf: result.asOf.toISOString(),
      sourceNote: result.sourceNote,
    })),
  };
}

export type ModelDto = ReturnType<typeof modelDto>;

export async function getModels() {
  return prisma.model.findMany({ include: modelInclude });
}

export function apiError(message: string, status = 400) {
  return Response.json({ error: message }, { status });
}

export function serverError(error: unknown) {
  console.error("Catalog API error", error);
  return apiError("The catalog is temporarily unavailable.", 500);
}
