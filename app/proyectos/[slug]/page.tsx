import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProjectBySlug, projects } from "@/data/projects";
import { GraphViewport } from "@/components/graph-viewport";
import { isProjectNodeId } from "@/data/holographic-nodes";

export function generateStaticParams() {
  return projects.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return {};
  const description =
    project.shortDescription ?? `${project.name} en el archivo de proyectos Ticonsky.`;

  return {
    title: project.name,
    description,
    openGraph: {
      title: project.name,
      description,
    },
  };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project || !isProjectNodeId(project.id)) notFound();
  return <GraphViewport initialNodeId={project.id} />;
}
