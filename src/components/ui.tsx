import Link from "next/link";
import type { Model } from "@/lib/types";
import { compactNumber, date, price } from "@/lib/format";

export function DataNote() {
  return <div className="data-note"><span className="data-note-dot"/> Demo catalog: prices, availability, and benchmark scores are illustrative. Verify with providers before use.</div>;
}

export function PageIntro({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return <div className="page-intro"><div className="eyebrow">{eyebrow}</div><h1>{title}</h1><p>{description}</p></div>;
}

export function Status({ loading, error, empty = false, emptyMessage = "No results found." }: { loading: boolean; error: string | null; empty?: boolean; emptyMessage?: string }) {
  if (loading) return <div className="status-panel"><span className="spinner"/> Loading catalog...</div>;
  if (error) return <div className="status-panel error">{error} Check the database connection and try again.</div>;
  if (empty) return <div className="status-panel">{emptyMessage}</div>;
  return null;
}

export function Tag({ children }: { children: React.ReactNode }) { return <span className="tag">{children}</span>; }

export function ModelCard({ model, selected, onSelect }: { model: Model; selected?: boolean; onSelect?: (slug: string) => void }) {
  return <article className="model-card">
    <div className="card-top"><span className="avatar">{model.lab.name.slice(0, 1)}</span><Tag>{model.type}</Tag></div>
    <Link href={`/models/${model.slug}`} className="card-title">{model.name} <span aria-hidden="true">↗</span></Link>
    <p className="card-lab">{model.lab.name}</p>
    <p className="card-summary">{model.summary}</p>
    <div className="card-tags">{model.capabilities.slice(0, 3).map((item) => <Tag key={item}>{item}</Tag>)}</div>
    <div className="card-stats"><div><span>Context</span><strong>{compactNumber(model.contextWindow)}</strong></div><div><span>Input / 1M</span><strong>{price(model.startingInputPrice)}</strong></div><div><span>Providers</span><strong>{model.offerings.length}</strong></div></div>
    <div className="card-foot"><span>Released {date(model.releaseDate)}</span>{onSelect && <button type="button" className={selected ? "compare-check selected" : "compare-check"} onClick={() => onSelect(model.slug)}>{selected ? "✓ Added" : "+ Compare"}</button>}</div>
  </article>;
}

export function ModelRows({ models }: { models: Model[] }) {
  return <div className="table-scroll"><table className="data-table"><thead><tr><th>Model</th><th>Type</th><th>Context</th><th>From / 1M input</th><th>Providers</th><th>Released</th></tr></thead><tbody>{models.map((model) => <tr key={model.id}><td><Link className="table-model" href={`/models/${model.slug}`}>{model.name}</Link><span className="table-sub">{model.lab.name}</span></td><td>{model.type}</td><td>{compactNumber(model.contextWindow)}</td><td>{price(model.startingInputPrice)}</td><td>{model.offerings.length}</td><td>{date(model.releaseDate)}</td></tr>)}</tbody></table></div>;
}
