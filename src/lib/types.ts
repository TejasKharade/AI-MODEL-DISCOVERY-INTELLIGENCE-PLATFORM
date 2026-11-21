export type Offering = {
  provider: { name: string; slug: string };
  inputPrice: number | null;
  outputPrice: number | null;
  currency: string;
  checkedAt: string;
  sourceNote: string;
};

export type Result = {
  benchmark: { name: string; slug: string; category: string; description: string; unit: string };
  score: number;
  asOf: string;
  sourceNote: string;
};

export type Model = {
  id: string;
  name: string;
  slug: string;
  summary: string;
  description: string;
  type: string;
  releaseDate: string;
  contextWindow: number;
  maxOutput: number | null;
  modalities: string[];
  capabilities: string[];
  status: string;
  lab: { name: string; slug: string };
  offerings: Offering[];
  startingInputPrice: number | null;
  results: Result[];
};

export type DirectoryItem = {
  name: string;
  slug: string;
  description: string;
  website: string | null;
  modelCount: number;
};
