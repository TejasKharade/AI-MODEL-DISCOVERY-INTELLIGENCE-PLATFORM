import { getModels, modelDto, serverError } from "@/lib/catalog";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const ids = (new URL(request.url).searchParams.get("ids") ?? "").split(",").filter(Boolean);
    if (ids.length < 2 || ids.length > 3 || new Set(ids).size !== ids.length) {
      return Response.json({ error: "Choose 2 or 3 different models." }, { status: 400 });
    }
    const models = (await getModels()).filter((model) => ids.includes(model.slug));
    if (models.length !== ids.length) return Response.json({ error: "One or more models were not found." }, { status: 404 });
    return Response.json({ items: ids.map((id) => modelDto(models.find((model) => model.slug === id)!)) });
  } catch (error) {
    return serverError(error);
  }
}
