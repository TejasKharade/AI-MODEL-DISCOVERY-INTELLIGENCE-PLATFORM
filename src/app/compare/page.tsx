import { Suspense } from "react";
import { ComparePage } from "@/components/compare-page";

export default function Page() { return <Suspense fallback={<div className="shell status-panel">Loading comparison...</div>}><ComparePage/></Suspense>; }
