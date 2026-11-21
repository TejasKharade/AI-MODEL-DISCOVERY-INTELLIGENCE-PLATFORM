import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const checkedAt = new Date("2026-11-01T00:00:00.000Z");

const labs = [
  ["OpenAI", "openai", "Research and products spanning language and multimodal AI."],
  ["Anthropic", "anthropic", "AI research company focused on reliable assistants."],
  ["Google DeepMind", "google-deepmind", "Google's AI research lab and model developer."],
  ["Meta", "meta", "Open model research and releases from Meta."],
  ["Mistral AI", "mistral-ai", "Developer-focused language and multimodal models."],
  ["DeepSeek", "deepseek", "Open model research across language and reasoning."],
  ["Cohere", "cohere", "Enterprise language and retrieval model developer."],
] as const;

const providers = [
  ["OpenRouter", "openrouter", "Multi-model API catalog."],
  ["Azure AI", "azure-ai", "Microsoft's AI model hosting platform."],
  ["Google Vertex AI", "google-vertex-ai", "Google Cloud's AI model platform."],
  ["AWS Bedrock", "aws-bedrock", "Managed model access from AWS."],
  ["Together AI", "together-ai", "Inference platform for open models."],
] as const;

type SeedModel = {
  name: string;
  slug: string;
  lab: string;
  type: string;
  date: string;
  context: number;
  output: number;
  modalities: string[];
  capabilities: string[];
  summary: string;
  input: number | null;
  outputPrice: number | null;
  providers: string[];
  scores: [number, number, number?];
};

// All prices and scores below are illustrative assignment data, not live quotes.
const models: SeedModel[] = [
  { name: "GPT-4o", slug: "gpt-4o", lab: "openai", type: "Multimodal", date: "2024-05-13", context: 128000, output: 16384, modalities: ["Text", "Image"], capabilities: ["Reasoning", "Vision", "Tool calling", "JSON output"], summary: "Versatile multimodal model for everyday development tasks.", input: 2.5, outputPrice: 10, providers: ["openrouter", "azure-ai"], scores: [83, 78, 76] },
  { name: "GPT-4o mini", slug: "gpt-4o-mini", lab: "openai", type: "Multimodal", date: "2024-07-18", context: 128000, output: 16384, modalities: ["Text", "Image"], capabilities: ["Vision", "Tool calling", "JSON output"], summary: "Compact multimodal model for high-volume applications.", input: 0.15, outputPrice: 0.6, providers: ["openrouter", "azure-ai"], scores: [72, 68, 62] },
  { name: "o1", slug: "o1", lab: "openai", type: "Reasoning", date: "2024-12-05", context: 200000, output: 100000, modalities: ["Text", "Image"], capabilities: ["Reasoning", "Vision", "Tool calling"], summary: "Reasoning-oriented model for multi-step problems.", input: 15, outputPrice: 60, providers: ["openrouter", "azure-ai"], scores: [91, 87, 82] },
  { name: "Claude 3.5 Sonnet", slug: "claude-3-5-sonnet", lab: "anthropic", type: "Multimodal", date: "2024-06-20", context: 200000, output: 8192, modalities: ["Text", "Image"], capabilities: ["Reasoning", "Vision", "Tool calling"], summary: "Balanced model suited to analysis and software work.", input: 3, outputPrice: 15, providers: ["openrouter", "aws-bedrock"], scores: [86, 88, 79] },
  { name: "Claude 3 Haiku", slug: "claude-3-haiku", lab: "anthropic", type: "Multimodal", date: "2024-03-13", context: 200000, output: 4096, modalities: ["Text", "Image"], capabilities: ["Vision", "Tool calling"], summary: "Fast model for simple requests and extraction.", input: 0.25, outputPrice: 1.25, providers: ["openrouter", "aws-bedrock"], scores: [68, 61, 59] },
  { name: "Claude 3 Opus", slug: "claude-3-opus", lab: "anthropic", type: "Multimodal", date: "2024-03-04", context: 200000, output: 4096, modalities: ["Text", "Image"], capabilities: ["Reasoning", "Vision", "Tool calling"], summary: "Large model for complex writing and analysis.", input: 15, outputPrice: 75, providers: ["openrouter", "aws-bedrock"], scores: [88, 82, 84] },
  { name: "Gemini 1.5 Pro", slug: "gemini-1-5-pro", lab: "google-deepmind", type: "Multimodal", date: "2024-05-14", context: 1000000, output: 8192, modalities: ["Text", "Image", "Audio", "Video"], capabilities: ["Reasoning", "Vision", "Tool calling", "Long context"], summary: "Long-context multimodal model for rich input analysis.", input: 3.5, outputPrice: 10.5, providers: ["google-vertex-ai", "openrouter"], scores: [85, 75, 88] },
  { name: "Gemini 1.5 Flash", slug: "gemini-1-5-flash", lab: "google-deepmind", type: "Multimodal", date: "2024-05-14", context: 1000000, output: 8192, modalities: ["Text", "Image", "Audio", "Video"], capabilities: ["Vision", "Tool calling", "Long context"], summary: "Fast long-context option for multimodal workloads.", input: 0.35, outputPrice: 1.05, providers: ["google-vertex-ai", "openrouter"], scores: [74, 65, 75] },
  { name: "Gemma 2 27B", slug: "gemma-2-27b", lab: "google-deepmind", type: "Text", date: "2024-06-27", context: 8192, output: 8192, modalities: ["Text"], capabilities: ["Open weights", "Reasoning"], summary: "Open-weight text model for flexible deployment.", input: 0.8, outputPrice: 0.8, providers: ["together-ai", "openrouter"], scores: [71, 66] },
  { name: "Llama 3.1 405B", slug: "llama-3-1-405b", lab: "meta", type: "Text", date: "2024-07-23", context: 128000, output: 4096, modalities: ["Text"], capabilities: ["Open weights", "Reasoning", "Tool calling"], summary: "Large open-weight language model for advanced tasks.", input: 3, outputPrice: 3, providers: ["together-ai", "openrouter"], scores: [84, 80] },
  { name: "Llama 3.1 70B", slug: "llama-3-1-70b", lab: "meta", type: "Text", date: "2024-07-23", context: 128000, output: 4096, modalities: ["Text"], capabilities: ["Open weights", "Tool calling"], summary: "Open-weight general-purpose model with a strong size-to-quality balance.", input: 0.9, outputPrice: 0.9, providers: ["together-ai", "aws-bedrock"], scores: [77, 72] },
  { name: "Llama 3.1 8B", slug: "llama-3-1-8b", lab: "meta", type: "Text", date: "2024-07-23", context: 128000, output: 4096, modalities: ["Text"], capabilities: ["Open weights", "Tool calling"], summary: "Small open-weight model for quick inference.", input: 0.2, outputPrice: 0.2, providers: ["together-ai", "openrouter"], scores: [62, 57] },
  { name: "Mistral Large 2", slug: "mistral-large-2", lab: "mistral-ai", type: "Text", date: "2024-07-24", context: 128000, output: 4096, modalities: ["Text"], capabilities: ["Reasoning", "Tool calling", "JSON output"], summary: "General-purpose language model with multilingual strengths.", input: 3, outputPrice: 9, providers: ["openrouter", "azure-ai"], scores: [82, 78] },
  { name: "Codestral", slug: "codestral", lab: "mistral-ai", type: "Text", date: "2024-05-29", context: 32000, output: 4096, modalities: ["Text"], capabilities: ["Coding", "Tool calling"], summary: "Code-focused model for generation and completion.", input: 1, outputPrice: 3, providers: ["openrouter", "azure-ai"], scores: [69, 85] },
  { name: "Pixtral 12B", slug: "pixtral-12b", lab: "mistral-ai", type: "Multimodal", date: "2024-09-17", context: 128000, output: 4096, modalities: ["Text", "Image"], capabilities: ["Vision", "Open weights"], summary: "Compact vision-language model.", input: 0.15, outputPrice: 0.15, providers: ["openrouter", "together-ai"], scores: [65, 59, 70] },
  { name: "DeepSeek V3", slug: "deepseek-v3", lab: "deepseek", type: "Text", date: "2024-12-26", context: 64000, output: 8192, modalities: ["Text"], capabilities: ["Open weights", "Reasoning", "Coding", "Tool calling"], summary: "Open language model with strong general and coding ability.", input: 0.27, outputPrice: 1.1, providers: ["openrouter", "together-ai"], scores: [83, 86] },
  { name: "DeepSeek R1", slug: "deepseek-r1", lab: "deepseek", type: "Reasoning", date: "2025-01-20", context: 64000, output: 8192, modalities: ["Text"], capabilities: ["Open weights", "Reasoning", "Coding"], summary: "Reasoning model designed for step-by-step problem solving.", input: 0.55, outputPrice: 2.19, providers: ["openrouter", "together-ai"], scores: [90, 89] },
  { name: "Command R+", slug: "command-r-plus", lab: "cohere", type: "Text", date: "2024-04-04", context: 128000, output: 4096, modalities: ["Text"], capabilities: ["Retrieval", "Tool calling", "Multilingual"], summary: "Enterprise model geared toward retrieval and tool use.", input: 2.5, outputPrice: 10, providers: ["aws-bedrock", "openrouter"], scores: [76, 69] },
];

async function main() {
  await prisma.benchmarkResult.deleteMany();
  await prisma.modelOffering.deleteMany();
  await prisma.model.deleteMany();
  await prisma.benchmark.deleteMany();
  await prisma.provider.deleteMany();
  await prisma.lab.deleteMany();

  const labIds = new Map<string, string>();
  for (const [name, slug, description] of labs) {
    const lab = await prisma.lab.create({ data: { name, slug, description } });
    labIds.set(slug, lab.id);
  }

  const providerIds = new Map<string, string>();
  for (const [name, slug, description] of providers) {
    const provider = await prisma.provider.create({ data: { name, slug, description } });
    providerIds.set(slug, provider.id);
  }

  const benchmarkIds = new Map<string, string>();
  for (const item of [
    { name: "Atlas Knowledge", slug: "atlas-knowledge", category: "Knowledge", description: "Illustrative knowledge score (0-100), not an official evaluation." },
    { name: "Atlas Code", slug: "atlas-code", category: "Coding", description: "Illustrative coding score (0-100), not an official evaluation." },
    { name: "Atlas Vision", slug: "atlas-vision", category: "Vision", description: "Illustrative image-understanding score (0-100), not an official evaluation." },
  ]) {
    const benchmark = await prisma.benchmark.create({ data: item });
    benchmarkIds.set(item.slug, benchmark.id);
  }

  for (const item of models) {
    const model = await prisma.model.create({
      data: {
        name: item.name,
        slug: item.slug,
        labId: labIds.get(item.lab)!,
        type: item.type,
        releaseDate: new Date(`${item.date}T00:00:00.000Z`),
        contextWindow: item.context,
        maxOutput: item.output,
        modalities: item.modalities,
        capabilities: item.capabilities,
        summary: item.summary,
        description: `${item.summary} This entry is part of the illustrative OneAtlas assignment catalog. Specifications, availability, pricing, and scores should be verified with official sources before production use.`,
      },
    });
    for (const [index, providerSlug] of item.providers.entries()) {
      await prisma.modelOffering.create({
        data: {
          modelId: model.id,
          providerId: providerIds.get(providerSlug)!,
          inputPricePerMillion: item.input === null ? null : item.input * (index === 0 ? 1 : 1.12),
          outputPricePerMillion: item.outputPrice === null ? null : item.outputPrice * (index === 0 ? 1 : 1.12),
          checkedAt,
          sourceNote: "Illustrative assignment data; not a live price quote.",
        },
      });
    }
    for (const [index, score] of item.scores.entries()) {
      if (score === undefined) continue;
      const slug = ["atlas-knowledge", "atlas-code", "atlas-vision"][index];
      await prisma.benchmarkResult.create({
        data: {
          modelId: model.id,
          benchmarkId: benchmarkIds.get(slug)!,
          score,
          asOf: checkedAt,
          sourceNote: "Illustrative assignment score; not an official benchmark result.",
        },
      });
    }
  }
  console.log(`Seeded ${models.length} models, ${labs.length} labs, ${providers.length} providers.`);
}

main().finally(() => prisma.$disconnect());
