import { DirectoryDetail } from "@/components/directory-page";

export default async function Page({ params }: { params: Promise<{ slug: string }> }) { const { slug } = await params; return <DirectoryDetail kind="labs" slug={slug}/>; }
