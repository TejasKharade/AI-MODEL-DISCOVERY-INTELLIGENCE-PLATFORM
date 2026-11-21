import { modelDto, modelInclude, serverError } from "@/lib/catalog";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const params = new URL(request.url).searchParams;
    const category = params.get("category") ?? "";
    const benchmarkSlug = params.get("benchmark") ?? "";
    const benchmarks = await prisma.benchmark.findMany({ orderBy: { name: "asc" } });
    const available = benchmarks.filter((benchmark) => !category || benchmark.category === category);
    const selected = available.find((benchmark) => benchmark.slug === benchmarkSlug) ?? available[0];
    if (!selected) return Response.json({ benchmarks: [], selected: null, items: [] });
    const results = await prisma.benchmarkResult.findMany({
      where: { benchmarkId: selected.id },
      include: { model: { include: modelInclude } },
      orderBy: { score: selected.higherBetter ? "desc" : "asc" },
    });
    return Response.json({
      benchmarks: benchmarks.map(({ name, slug, category, description, unit }) => ({ name, slug, category, description, unit })),
      selected: { name: selected.name, slug: selected.slug, category: selected.category, description: selected.description, unit: selected.unit },
      items: results.map((result, index) => ({ rank: index + 1, score: Number(result.score), model: modelDto(result.model) })),
    });
  } catch (error) {
    return serverError(error);
  }
}
