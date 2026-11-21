"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const links = [
  { href: "/models", label: "Models" },
  { href: "/rankings", label: "Rankings" },
  { href: "/labs", label: "Labs" },
  { href: "/providers", label: "Providers" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [search, setSearch] = useState("");
  return (
    <header className="site-header">
      <div className="shell header-inner">
        <Link className="brand" href="/models" aria-label="OneAtlas home">
          <span className="brand-mark"><span /></span>
          <span>oneatlas<span className="brand-dot">.</span></span>
        </Link>
        <nav className="primary-nav" aria-label="Main navigation">
          {links.map((link) => <Link key={link.href} className={pathname.startsWith(link.href) ? "active" : ""} href={link.href}>{link.label}</Link>)}
        </nav>
        <form action="/models" className="header-search" role="search">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m16 16 5 5"/></svg>
          <input name="q" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search models..." aria-label="Search models" />
          <kbd>/</kbd>
        </form>
      </div>
    </header>
  );
}
