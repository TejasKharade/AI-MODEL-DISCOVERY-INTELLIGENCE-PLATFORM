"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useApi } from "@/lib/use-api";
import type { Model } from "@/lib/types";
import { compactNumber, price } from "@/lib/format";
import { DataNote, PageIntro, Status, Tag } from "./ui";

export function ComparePage() {
  const searchParams = useSearchParams();
  const ids = searchParams.get("ids") ?? "";
  const valid = ids.split(",").filter(Boolean).length >= 2;
  const { data, error, loading } = useApi<{ items: Model[] }>(valid ? `/api/compare?ids=${encodeURIComponent(ids)}` : null);
  const models = data?.items ?? [];
  const benchmarkNames = [...new Set(models.flatMap((model) => model.results.map((result) => result.benchmark.name)))];
  return <main className="shell standard-page"><DataNote/><PageIntro eyebrow="SIDE BY SIDE" title="Compare models" description="Put capabilities, pricing, and performance in the same view."/>
    {!valid ? <div className="status-panel">Choose 2 or 3 models from the catalog to compare. <Link className="text-link" href="/models">Explore models →</Link></div> : <Status loading={loading} error={error}/>}
    {models.length > 0 && <><p className="table-hint">Swipe sideways to see every model →</p><div className="table-scroll comparison-wrap"><table className="comparison-table"><thead><tr><th>Specification</th>{models.map((model) => <th key={model.slug}><span className="compare-avatar">{model.lab.name.slice(0, 1)}</span><Link href={`/models/${model.slug}`}>{model.name} ↗</Link><small>{model.lab.name}</small></th>)}</tr></thead><tbody>
      <tr><th>Model type</th>{models.map((model) => <td key={model.slug}><Tag>{model.type}</Tag></td>)}</tr>
      <tr><th>Context window</th>{models.map((model) => <td key={model.slug}><strong>{compactNumber(model.contextWindow)}</strong> tokens</td>)}</tr>
      <tr><th>Max output</th>{models.map((model) => <td key={model.slug}>{model.maxOutput ? `${compactNumber(model.maxOutput)} tokens` : "—"}</td>)}</tr>
      <tr><th>Input price / 1M</th>{models.map((model) => <td key={model.slug}><strong>{price(model.offerings[0]?.inputPrice ?? null)}</strong></td>)}</tr>
      <tr><th>Output price / 1M</th>{models.map((model) => <td key={model.slug}>{price(model.offerings[0]?.outputPrice ?? null)}</td>)}</tr>
      <tr><th>Providers</th>{models.map((model) => <td key={model.slug}>{model.offerings.map((item) => item.provider.name).join(", ")}</td>)}</tr>
      <tr><th>Modalities</th>{models.map((model) => <td key={model.slug}><div className="pill-list">{model.modalities.map((item) => <Tag key={item}>{item}</Tag>)}</div></td>)}</tr>
      <tr><th>Capabilities</th>{models.map((model) => <td key={model.slug}><div className="pill-list">{model.capabilities.map((item) => <Tag key={item}>{item}</Tag>)}</div></td>)}</tr>
      {benchmarkNames.map((name) => <tr key={name}><th>{name}</th>{models.map((model) => <td key={model.slug}>{model.results.find((result) => result.benchmark.name === name)?.score ?? "—"}</td>)}</tr>)}
    </tbody></table></div></>}
    <Link className="back-link" href="/models">← Explore more models</Link>
  </main>;
}
