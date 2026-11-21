# OneAtlas MVP

A full stack AI model discovery and intelligence platform built for the AI Software Engineer internship assignment. Visitors can browse, search, filter, compare, and rank models, then explore the labs and providers behind them.

## Stack

- Next.js App Router, React, TypeScript, Tailwind CSS
- Node.js API route handlers
- PostgreSQL and Prisma ORM

This is a single Next.js application. React pages call the read-only `/api/*` endpoints, which validate requests and query PostgreSQL through Prisma. Model data is never hardcoded into the UI.

## Features

- **Discovery:** search models; filter by lab, provider, type, and capability; sort by release date, context window, input price, or name; paginate results.
- **Model details:** specifications, input/output pricing by provider, modalities, capabilities, release date, and benchmark results.
- **Comparison:** select two or three models from the catalog and view their details side by side.
- **Rankings:** filter by benchmark category and benchmark to compare scores.
- **Directories:** browse labs and providers, then see each one's models.
- **Responsive UI:** desktop and mobile layouts, global search, and loading/empty/error states.

## Run locally

Requirements: Node.js 24+, Docker Desktop, and npm. From this directory:

```powershell
npm install
docker run --name oneatlas-postgres -e POSTGRES_PASSWORD=oneatlas_dev -e POSTGRES_DB=oneatlas -p 5432:5432 -d postgres:16-alpine
Copy-Item .env.example .env
```

Edit `.env` to use this local connection string:

```text
DATABASE_URL="postgresql://postgres:oneatlas_dev@localhost:5432/oneatlas?schema=public"
```

Then apply the schema, seed the demo catalog, and start the app:

```powershell
npm run db:migrate
npm run db:seed
npm run dev
```

Open http://localhost:3000/models. On subsequent starts, launch Docker Desktop and run `docker start oneatlas-postgres` if the container is stopped, then `npm run dev`. If port 3000 is occupied, run `npm run dev -- -p 3001` and open http://localhost:3001/models.

**Seeding replaces the catalog contents.** Run it for initial setup or when you intentionally want to reset the demo data.

## Data model

| Table | Purpose |
| --- | --- |
| `Lab` | The organization that develops a model. |
| `Provider` | A platform that offers model access. |
| `Model` | Name, type, release date, context, capabilities, and modalities. |
| `ModelOffering` | Provider-specific input/output pricing and availability. |
| `Benchmark` | A named evaluation and category. |
| `BenchmarkResult` | A model's score for one benchmark. |

The seed script creates 18 models, 7 labs, 5 providers, and 3 demonstration benchmarks. Prices, provider availability, specifications, and benchmark scores in this catalog are **illustrative assignment data**, not live quotes or official evaluations. The UI labels this clearly. Real data ingestion would require source verification and ongoing updates.

## Main routes

| Page | API |
| --- | --- |
| `/models` | `/api/models`, `/api/filters` |
| `/models/[slug]` | `/api/models/[slug]` |
| `/compare?ids=slug1,slug2` | `/api/compare?ids=slug1,slug2` |
| `/rankings` | `/api/rankings` |
| `/labs`, `/labs/[slug]` | `/api/labs`, `/api/labs/[slug]` |
| `/providers`, `/providers/[slug]` | `/api/providers`, `/api/providers/[slug]` |

## Checks

```powershell
npm run lint
npm run typecheck
npm run build
```

The main catalog, detail, comparison, ranking, and directory endpoints have been smoke-tested against local PostgreSQL. Desktop and mobile layouts have been visually reviewed in a browser.

## Deployment

The assignment asks for a working public URL. Provision PostgreSQL on Neon or Railway and deploy the Next.js app on Vercel or Railway. Set `DATABASE_URL` in the deployment environment, apply the committed Prisma migration (`npx prisma migrate deploy`), and run `npm run db:seed` once against the hosted database. Verify the public pages and APIs before submission.

Keep `.env` out of Git. The tracked `.env.example` is only a placeholder.

## Assignment submission

Submit a live URL, GitHub repository URL, and a 5–10 minute Loom video through the Google Form in the assignment. In the video, show discovery, filters, model detail, comparison, rankings, directories, the database/API architecture, technical decisions, and challenges. Be able to explain the code and why the data is illustrative.
