import { getModels, modelDto, serverError } from "@/lib/catalog";

export const dynamic = "force-dynamic";

const sortKeys = new Set(["release-new", "release-old", "price-low", "price-high", "context-high", "context-low", "name"]);

export async function GET(request: Request) {
  try {
    const params = new URL(request.url).searchParams;
    const query = (params.get("q") ?? "").trim().toLowerCase();
    const lab = params.get("lab") ?? "";
    const provider = params.get("provider") ?? "";
    const type = params.get("type") ?? "";
    const capability = params.get("capability") ?? "";
    const sort = params.get("sort") ?? "release-new";
    const page = Number(params.get("page") ?? "1");
    const pageSize = Number(params.get("pageSize") ?? "12");
    if (!sortKeys.has(sort)) return Response.json({ error: "Invalid sort value." }, { status: 400 });
    if (!Number.isInteger(page) || page < 1 || !Number.isInteger(pageSize) || pageSize < 1 || pageSize > 48) {
      return Response.json({ error: "Invalid page or page size." }, { status: 400 });
    }

    const rows = (await getModels()).map(modelDto).filter((model) =>
      (!query || `${model.name} ${model.summary} ${model.lab.name} ${model.capabilities.join(" ")}`.toLowerCase().includes(query)) &&
      (!lab || model.lab.slug === lab) &&
      (!provider || model.offerings.some((offering) => offering.provider.slug === provider)) &&
      (!type || model.type === type) &&
      (!capability || model.capabilities.includes(capability))
    );

    rows.sort((a, b) => {
      switch (sort) {
        case "release-old": return a.releaseDate.localeCompare(b.releaseDate);
        case "price-low": return (a.startingInputPrice ?? Infinity) - (b.startingInputPrice ?? Infinity);
        case "price-high": return (b.startingInputPrice ?? -1) - (a.startingInputPrice ?? -1);
        case "context-high": return b.contextWindow - a.contextWindow;
        case "context-low": return a.contextWindow - b.contextWindow;
        case "name": return a.name.localeCompare(b.name);
        default: return b.releaseDate.localeCompare(a.releaseDate);
      }
    });

    return Response.json({ items: rows.slice((page - 1) * pageSize, page * pageSize), total: rows.length, page, pageSize });
  } catch (error) {
    return serverError(error);
  }
}
