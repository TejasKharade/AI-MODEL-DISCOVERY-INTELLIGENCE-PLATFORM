import { ModelDetail } from "@/components/model-detail";

export default async function ModelPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <ModelDetail slug={slug} />;
}
