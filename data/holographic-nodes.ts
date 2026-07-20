import { projects, type ProjectId } from "@/data/projects";

export type ProjectNodeId = ProjectId;
export type NodeId = "ticonsky" | ProjectNodeId;

export type HolographicNodeConfig = {
  id: NodeId;
  name: string;
  description: string;
  color: string;
  position: [number, number, number];
  mobilePosition: [number, number, number];
  scale: number;
  rotationAxis: [number, number, number];
  rotationSpeed: number;
  floatAmplitude: number;
  floatSpeed: number;
  floatPhase: number;
};

export const HOLOGRAPHIC_NODES: readonly HolographicNodeConfig[] = [
  {
    id: "ticonsky",
    name: "TICONSKY",
    description: "Nodo central del archivo visual.",
    color: "#00f5ff",
    scale: 0.495,
    position: [0, 0, 0],
    mobilePosition: [0, -0.1, 0],
    rotationSpeed: 0.07,
    rotationAxis: [0.25, 0.92, 0.3],
    floatAmplitude: 0.026,
    floatSpeed: 0.22,
    floatPhase: 0,
  },
  ...projects.map((project) => ({
    id: project.id,
    name: project.name,
    description: project.shortDescription,
    color: project.color,
    ...project.node,
  })),
] as const;

export const PROJECT_NODES = HOLOGRAPHIC_NODES.slice(1) as readonly HolographicNodeConfig[];

export function isProjectNodeId(value: string | null): value is ProjectNodeId {
  return PROJECT_NODES.some((node) => node.id === value);
}

export function isNodeId(value: string | null): value is NodeId {
  return HOLOGRAPHIC_NODES.some((node) => node.id === value);
}

export function nodePath(id: NodeId) {
  if (id === "ticonsky") return "/ticonsky";
  const project = projects.find((item) => item.id === id);
  return `/proyectos/${project?.slug ?? id}`;
}
