"use client";

import Link from "next/link";
import { useApi } from "@/lib/use-api";
import type { DirectoryItem, Model } from "@/lib/types";
import { DataNote, ModelRows, PageIntro, Status } from "./ui";

type Kind = "labs" | "providers";

export function DirectoryPage({ kind }: { kind: Kind }) {
  const { data, error, loading } = useApi<{ items: DirectoryItem[] }>(`/api/${kind}`);
  const isLabs = kind === "labs";
  return <main className="shell standard-page"><DataNote/><PageIntro eyebrow={isLabs ? "THE BUILDERS" : "THE ECOSYSTEM"} title={isLabs ? "AI labs" : "Providers"} description={isLabs ? "Meet the companies and research teams behind the models." : "Discover where models are available across the provider ecosystem."}/>
    <Status loading={loading} error={error} empty={!!data && !data.items.length}/>
    {data && <div className="directory-grid">{data.items.map((item, index) => <Link className="directory-card" href={`/${kind}/${item.slug}`} key={item.slug}><div className="directory-card-top"><span className="directory-avatar">{item.name.slice(0, 1)}</span><span>0{index + 1}</span></div><h2>{item.name} <span>↗</span></h2><p>{item.description}</p><div className="directory-card-foot"><strong>{item.modelCount}</strong><span>{item.modelCount === 1 ? "model" : "models"} in catalog</span><span className="directory-arrow">→</span></div></Link>)}</div>}
  </main>;
}

export function DirectoryDetail({ kind, slug }: { kind: Kind; slug: string }) {
  const { data, error, loading } = useApi<DirectoryItem & { models: Model[] }>(`/api/${kind}/${encodeURIComponent(slug)}`);
  const isLabs = kind === "labs";
  if (loading || error || !data) return <main className="shell standard-page"><Status loading={loading} error={error} empty={!loading && !error} emptyMessage="Directory entry not found."/></main>;
  return <main className="shell standard-page"><DataNote/><div className="breadcrumbs"><Link href={`/${kind}`}>{isLabs ? "Labs" : "Providers"}</Link><span>/</span><span>{data.name}</span></div><div className="directory-detail-hero"><span className="directory-avatar large">{data.name.slice(0, 1)}</span><div><div className="eyebrow">{isLabs ? "AI LAB" : "MODEL PROVIDER"}</div><h1>{data.name}</h1><p>{data.description}</p></div><div className="directory-detail-count"><strong>{data.models.length}</strong><span>models</span></div></div><section className="section-card"><div className="card-heading"><div><div className="eyebrow">CATALOG</div><h2>{isLabs ? "Models & releases" : "Available models"}</h2></div></div>{data.models.length ? <ModelRows models={data.models}/> : <div className="status-panel">No models listed yet.</div>}</section><Link className="back-link" href={`/${kind}`}>← All {kind}</Link></main>;
}
