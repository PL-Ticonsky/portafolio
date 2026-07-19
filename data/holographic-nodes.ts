import type { ProjectId } from "@/lib/types";

export type ProjectNodeId = ProjectId;
export type NodeId = "ticonsky" | ProjectNodeId;

export type HolographicNodeConfig = {
  id: NodeId;
  name: string;
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
    color: "#00f5ff",
    scale: 1.22,
    position: [0.15, -0.05, 0],
    mobilePosition: [0, -0.15, 0],
    rotationSpeed: 0.055,
    rotationAxis: [0.25, 0.92, 0.3],
    floatAmplitude: 0.035,
    floatSpeed: 0.32,
    floatPhase: 0,
  },
  {
    id: "tinta",
    name: "TINTA",
    color: "#f97316",
    scale: 0.52,
    position: [-4.35, 2.45, -0.8],
    mobilePosition: [-1.15, 3.75, -0.5],
    rotationSpeed: 0.082,
    rotationAxis: [0.8, 0.35, 0.4],
    floatAmplitude: 0.045,
    floatSpeed: 0.41,
    floatPhase: 0.8,
  },
  {
    id: "sembraalas",
    name: "SEMBRAALAS",
    color: "#2dd4bf",
    scale: 0.64,
    position: [4.35, 2.1, -1.15],
    mobilePosition: [1.28, 2.35, -0.75],
    rotationSpeed: 0.061,
    rotationAxis: [0.2, 0.75, 0.62],
    floatAmplitude: 0.04,
    floatSpeed: 0.29,
    floatPhase: 2.1,
  },
  {
    id: "reservaciones",
    name: "RESERVACIONES",
    color: "#eab308",
    scale: 0.56,
    position: [-4.7, -2.25, -0.25],
    mobilePosition: [-1.38, 2.15, -0.2],
    rotationSpeed: 0.073,
    rotationAxis: [0.62, 0.2, 0.76],
    floatAmplitude: 0.05,
    floatSpeed: 0.36,
    floatPhase: 3.4,
  },
  {
    id: "museum-heist",
    name: "MUSEUM HEIST",
    color: "#a855f7",
    scale: 0.48,
    position: [4.7, -2.15, -0.65],
    mobilePosition: [1.32, -2.05, -0.45],
    rotationSpeed: 0.092,
    rotationAxis: [0.48, 0.83, 0.16],
    floatAmplitude: 0.038,
    floatSpeed: 0.45,
    floatPhase: 4.7,
  },
  {
    id: "sga",
    name: "SGA",
    color: "#3b82f6",
    scale: 0.46,
    position: [0.9, 3.45, -1.7],
    mobilePosition: [-0.48, -3.25, -0.8],
    rotationSpeed: 0.068,
    rotationAxis: [0.72, 0.51, 0.3],
    floatAmplitude: 0.042,
    floatSpeed: 0.34,
    floatPhase: 5.8,
  },
] as const;

export const PROJECT_NODES = HOLOGRAPHIC_NODES.slice(1) as readonly HolographicNodeConfig[];

export function isProjectNodeId(value: string | null): value is ProjectNodeId {
  return PROJECT_NODES.some((node) => node.id === value);
}

export function isNodeId(value: string | null): value is NodeId {
  return HOLOGRAPHIC_NODES.some((node) => node.id === value);
}

export function nodePath(id: NodeId) {
  return id === "ticonsky" ? "/ticonsky" : `/proyectos/${id}`;
}
