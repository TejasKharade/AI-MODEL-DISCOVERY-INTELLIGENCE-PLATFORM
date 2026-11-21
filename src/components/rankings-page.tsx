"use client";

import Link from "next/link";
import { useState } from "react";
import { useApi } from "@/lib/use-api";
import type { Model } from "@/lib/types";
import { compactNumber, price } from "@/lib/format";
import { DataNote, PageIntro, Status } from "./ui";

type RankingResponse = { benchmarks: { name: string; slug: string; category: string; description: string; unit: string }[]; selected: { name: string; slug: string; category: string; description: string; unit: string } | null; items: { rank: number; score: number; model: Model }[] };

export function RankingsPage() {
  const [category, setCategory] = useState("");
  const [benchmark, setBenchmark] = useState("");
  const url = `/api/rankings?${new URLSearchParams({ ...(category && { category }), ...(benchmark && { benchmark }) })}`;
  const { data, error, loading } = useApi<RankingResponse>(url);
  const categories = [...new Set(data?.benchmarks.map((item) => item.category) ?? [])];
  const available = data?.benchmarks.filter((item) => !category || item.category === category) ?? [];
  return <main className="shell standard-page"><DataNote/><PageIntro eyebrow="MODEL INTELLIGENCE" title="Rankings & benchmarks" description="Explore comparative performance across individual evaluation categories."/>
    <div className="ranking-controls"><label>Category<select value={category} onChange={(event) => { setCategory(event.target.value); setBenchmark(""); }}><option value="">All categories</option>{categories.map((item) => <option key={item} value={item}>{item}</option>)}</select></label><label>Benchmark<select value={benchmark} onChange={(event) => setBenchmark(event.target.value)}><option value="">{available[0]?.name ?? "Choose benchmark"}</option>{available.map((item) => <option key={item.slug} value={item.slug}>{item.name}</option>)}</select></label><span>One benchmark at a time keeps scores comparable.</span></div>
    <Status loading={loading} error={error} empty={!!data && data.items.length === 0} emptyMessage="No results for this benchmark."/>
    {data?.selected && <><div className="ranking-summary"><div><div className="eyebrow">SELECTED BENCHMARK</div><h2>{data.selected.name}</h2><p>{data.selected.description}</p></div><strong>{data.items.length}<span> models scored</span></strong></div><p className="table-hint">Swipe sideways to see all columns →</p><div className="table-scroll"><table className="data-table ranking-table"><thead><tr><th>Rank</th><th>Model</th><th>Score</th><th>Context</th><th>Input / 1M</th></tr></thead><tbody>{data.items.map((item) => <tr key={item.model.slug}><td><span className={item.rank <= 3 ? "rank-badge top-rank" : "rank-badge"}>{String(item.rank).padStart(2, "0")}</span></td><td><Link className="table-model" href={`/models/${item.model.slug}`}>{item.model.name} ↗</Link><span className="table-sub">{item.model.lab.name}</span></td><td><div className="rank-score"><strong>{item.score}</strong><span><i style={{ width: `${Math.min(100, Math.max(0, item.score))}%` }}/></span></div></td><td>{compactNumber(item.model.contextWindow)}</td><td>{price(item.model.startingInputPrice)}</td></tr>)}</tbody></table></div></>}
  </main>;
}
