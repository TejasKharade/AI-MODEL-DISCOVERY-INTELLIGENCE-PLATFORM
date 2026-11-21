import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

export const metadata: Metadata = {
  title: "OneAtlas | AI Model Discovery",
  description: "Discover, compare, and evaluate AI models across labs and providers.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body><SiteHeader/>{children}<footer className="site-footer"><div className="shell footer-inner"><div><strong>oneatlas<span>.</span></strong><p>Clarity for a multi-model world.</p></div><div><span>EXPLORE</span><Link href="/models">Models</Link><Link href="/rankings">Rankings</Link><Link href="/labs">Labs</Link><Link href="/providers">Providers</Link></div><p className="footer-note">An illustrative full stack internship project. Pricing and scores are sample data.</p></div></footer></body>
    </html>
  );
}
