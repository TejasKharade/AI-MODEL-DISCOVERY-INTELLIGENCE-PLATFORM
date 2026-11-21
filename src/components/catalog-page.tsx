"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { DataNote, ModelCard, PageIntro, Status } from "./ui";
import { useApi } from "@/lib/use-api";
import type { Model } from "@/lib/types";

type Filters = { labs: { name: string; slug: string }[]; providers: { name: string; slug: string }[]; types: string[]; capabilities: string[] };
type Listing = { items: Model[]; total: number; page: number; pageSize: number };

export function CatalogPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryString = searchParams.toString();
  const { data, error, loading } = useApi<Listing>(`/api/models?${queryString}`);
  const filters = useApi<Filters>("/api/filters");
  const [selected, setSelected] = useState<string[]>([]);
  const [search, setSearch] = useState(searchParams.get("q") ?? "");
  const page = Number(searchParams.get("page") ?? "1");
  const compareHref = useMemo(() => `/compare?ids=${selected.join(",")}`, [selected]);

  function update(key: string, value: string) {
    const params = new URLSearchParams(queryString);
    if (value) params.set(key, value); else params.delete(key);
    if (key !== "page") params.delete("page");
    router.push(`/models?${params.toString()}`);
  }

  function toggleCompare(slug: string) {
    setSelected((current) => current.includes(slug) ? current.filter((item) => item !== slug) : current.length < 3 ? [...current, slug] : current);
  }

  return <main>
    <section className="hero"><div className="shell hero-inner"><div className="hero-copy"><div className="eyebrow light">THE AI MODEL ATLAS <span className="eyebrow-line"/></div><h1>Find the right model<br/><em>for what you build.</em></h1><p>Search, compare, and evaluate AI models across labs and providers. The essential details, all in one place.</p><form className="hero-search" onSubmit={(event) => { event.preventDefault(); update("q", search.trim()); }}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m16 16 5 5"/></svg><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search models, labs, capabilities..." aria-label="Search models"/><button type="submit">Search <span>→</span></button></form><div className="hero-hint">Try filtering by <button onClick={() => update("capability", "Reasoning")}>Reasoning</button><button onClick={() => update("capability", "Vision")}>Vision</button><button onClick={() => update("capability", "Open weights")}>Open weights</button></div></div><div className="hero-visual" aria-hidden="true"><div className="orbit orbit-one"/><div className="orbit orbit-two"/><div className="orbit orbit-three"/><div className="visual-center"><span>01</span><strong>Explore<br/>more.</strong></div><div className="visual-label top">MODEL INTELLIGENCE</div><div className="visual-label bottom">BUILT FOR BUILDERS</div><i className="orbit-dot dot-one"/><i className="orbit-dot dot-two"/><i className="orbit-dot dot-three"/></div></div></section>

    <section className="shell catalog-section"><DataNote/><div className="section-head"><PageIntro eyebrow="THE CATALOG" title="Explore models" description="Find the right balance of capability, context, and cost."/><div className="count-pill">{data?.total ?? "—"} models</div></div>
      <div className="catalog-layout"><aside className="filters-panel"><div className="filter-heading"><strong>Filters</strong><button onClick={() => router.push("/models")}>Clear all</button></div>
        <label>Lab<select value={searchParams.get("lab") ?? ""} onChange={(event) => update("lab", event.target.value)}><option value="">All labs</option>{filters.data?.labs.map((item) => <option key={item.slug} value={item.slug}>{item.name}</option>)}</select></label>
        <label>Provider<select value={searchParams.get("provider") ?? ""} onChange={(event) => update("provider", event.target.value)}><option value="">All providers</option>{filters.data?.providers.map((item) => <option key={item.slug} value={item.slug}>{item.name}</option>)}</select></label>
        <label>Model type<select value={searchParams.get("type") ?? ""} onChange={(event) => update("type", event.target.value)}><option value="">All types</option>{filters.data?.types.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
        <label>Capability<select value={searchParams.get("capability") ?? ""} onChange={(event) => update("capability", event.target.value)}><option value="">All capabilities</option>{filters.data?.capabilities.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
        <div className="filter-tip"><span>✦</span> Select up to three models to compare them side by side.</div>
      </aside><div className="catalog-results"><div className="results-toolbar"><span>{data ? `${data.total} results` : "Loading results"}</span><label>Sort by <select value={searchParams.get("sort") ?? "release-new"} onChange={(event) => update("sort", event.target.value)}><option value="release-new">Newest release</option><option value="release-old">Oldest release</option><option value="price-low">Lowest input price</option><option value="price-high">Highest input price</option><option value="context-high">Largest context</option><option value="context-low">Smallest context</option><option value="name">Name A–Z</option></select></label></div>
        <Status loading={loading} error={error} empty={!!data && data.items.length === 0} emptyMessage="No models match these filters. Try a broader search."/>
        {data && data.items.length > 0 && <div className="model-grid">{data.items.map((model) => <ModelCard key={model.id} model={model} selected={selected.includes(model.slug)} onSelect={toggleCompare}/>)}</div>}
        {data && data.total > data.pageSize && <div className="pagination"><button disabled={page <= 1} onClick={() => update("page", String(page - 1))}>← Previous</button><span>Page {page} of {Math.ceil(data.total / data.pageSize)}</span><button disabled={page >= Math.ceil(data.total / data.pageSize)} onClick={() => update("page", String(page + 1))}>Next →</button></div>}
      </div></div>
    </section>
    {selected.length > 0 && <div className="compare-tray"><div><strong>{selected.length} of 3 selected</strong><span>Choose {selected.length < 2 ? "one more model" : "models to compare"}</span></div><button onClick={() => setSelected([])}>Clear</button>{selected.length >= 2 && <Link href={compareHref}>Compare models <span>→</span></Link>}</div>}
  </main>;
}
