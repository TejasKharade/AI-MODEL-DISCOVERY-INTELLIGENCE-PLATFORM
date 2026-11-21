"use client";

import Link from "next/link";
import { useApi } from "@/lib/use-api";
import type { Model } from "@/lib/types";
import { compactNumber, date, price } from "@/lib/format";
import { DataNote, Status, Tag } from "./ui";

export function ModelDetail({ slug }: { slug: string }) {
  const { data: model, error, loading } = useApi<Model>(`/api/models/${encodeURIComponent(slug)}`);
  if (loading || error || !model) return <main className="shell detail-main"><Status loading={loading} error={error} empty={!loading && !error} emptyMessage="Model not found."/></main>;
  return <main className="shell detail-main"><DataNote/><div className="breadcrumbs"><Link href="/models">Models</Link><span>/</span><span>{model.name}</span></div>
    <div className="detail-hero"><div><div className="eyebrow">MODEL PROFILE <span className="eyebrow-line"/></div><h1>{model.name}</h1><p>{model.summary}</p><div className="detail-meta"><Link href={`/labs/${model.lab.slug}`}>{model.lab.name} ↗</Link><span>Released {date(model.releaseDate)}</span><Tag>{model.type}</Tag></div></div><div className="detail-hero-aside"><span className="detail-aside-label">AT A GLANCE</span><strong>{compactNumber(model.contextWindow)}</strong><span>context window</span><div className="detail-aside-rule"/><span>From {price(model.startingInputPrice)} / 1M input tokens</span></div></div>
    <div className="detail-grid"><section className="content-card"><h2>Overview</h2><p>{model.description}</p><div className="spec-grid"><div><span>Context window</span><strong>{model.contextWindow.toLocaleString()} tokens</strong></div><div><span>Maximum output</span><strong>{model.maxOutput?.toLocaleString() ?? "Not available"} tokens</strong></div><div><span>Model type</span><strong>{model.type}</strong></div><div><span>Status</span><strong>{model.status}</strong></div></div></section><section className="content-card"><h2>Capabilities</h2><p>What this model supports in the demo catalog.</p><h3>Capabilities</h3><div className="pill-list">{model.capabilities.map((item) => <Tag key={item}>{item}</Tag>)}</div><h3>Modalities</h3><div className="pill-list">{model.modalities.map((item) => <Tag key={item}>{item}</Tag>)}</div></section></div>
    <section className="content-card section-card"><div className="card-heading"><div><div className="eyebrow">AVAILABILITY</div><h2>Providers & pricing</h2></div><span>USD per 1M tokens</span></div><div className="table-scroll"><table className="data-table"><thead><tr><th>Provider</th><th>Input</th><th>Output</th><th>Checked</th></tr></thead><tbody>{model.offerings.map((offering) => <tr key={offering.provider.slug}><td><Link className="table-model" href={`/providers/${offering.provider.slug}`}>{offering.provider.name} ↗</Link></td><td>{price(offering.inputPrice)}</td><td>{price(offering.outputPrice)}</td><td>{date(offering.checkedAt)}</td></tr>)}</tbody></table></div></section>
    <section className="content-card section-card"><div className="card-heading"><div><div className="eyebrow">PERFORMANCE</div><h2>Benchmark results</h2></div><Link href="/rankings" className="text-link">View rankings →</Link></div>{model.results.length ? <div className="benchmark-list">{model.results.map((result) => <div className="benchmark-item" key={result.benchmark.slug}><div><strong>{result.benchmark.name}</strong><span>{result.benchmark.category} · illustrative score</span></div><div className="score-track"><div style={{ width: `${Math.max(0, Math.min(100, result.score))}%` }}/></div><strong className="score-number">{result.score}</strong></div>)}</div> : <p>No benchmark results are available for this model.</p>}</section>
    <div className="detail-bottom"><Link href="/models">← Back to models</Link><Link href="/rankings">Explore rankings →</Link></div>
  </main>;
}
