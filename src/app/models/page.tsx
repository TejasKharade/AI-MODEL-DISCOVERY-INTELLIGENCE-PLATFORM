import { Suspense } from "react";
import { CatalogPage } from "@/components/catalog-page";

export default function ModelsPage() {
  return <Suspense fallback={<div className="shell status-panel">Loading catalog...</div>}><CatalogPage /></Suspense>;
}
