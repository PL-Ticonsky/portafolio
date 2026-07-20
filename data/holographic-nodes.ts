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
    scale: 0.44,
    position: [0, 0, 0],
    mobilePosition: [0, -0.1, 0],
    rotationSpeed: 0.07,
    rotationAxis: [0.25, 0.92, 0.3],
    floatAmplitude: 0.026,
    floatSpeed: 0.22,
    floatPhase: 0,
  },
  {
    id: "tinta",
    name: "TINTA",
    color: "#f97316",
    scale: 0.2,
    position: [1.7, -2.1, -0.25],
    mobilePosition: [0.58, -2, -0.18],
    rotationSpeed: 0.09,
    rotationAxis: [0.8, 0.35, 0.4],
    floatAmplitude: 0.028,
    floatSpeed: 0.27,
    floatPhase: 0.8,
  },
  {
    id: "sembraalas",
    name: "SEMBRAALAS",
    color: "#2dd4bf",
    scale: 0.24,
    position: [2.38, 1.72, -0.45],
    mobilePosition: [0.82, 1.35, -0.28],
    rotationSpeed: 0.075,
    rotationAxis: [0.2, 0.75, 0.62],
    floatAmplitude: 0.026,
    floatSpeed: 0.21,
    floatPhase: 2.1,
  },
  {
    id: "reservaciones",
    name: "RESERVACIONES",
    color: "#eab308",
    scale: 0.22,
    position: [3.65, -0.19, -0.55],
    mobilePosition: [0.78, 0.38, -0.22],
    rotationSpeed: 0.082,
    rotationAxis: [0.62, 0.2, 0.76],
    floatAmplitude: 0.03,
    floatSpeed: 0.24,
    floatPhase: 3.4,
  },
  {
    id: "museum-heist",
    name: "MUSEUM HEIST",
    color: "#a855f7",
    scale: 0.19,
    position: [-2.65, 1.42, -0.35],
    mobilePosition: [-0.78, 1.95, -0.24],
    rotationSpeed: 0.1,
    rotationAxis: [0.48, 0.83, 0.16],
    floatAmplitude: 0.025,
    floatSpeed: 0.29,
    floatPhase: 4.7,
  },
  {
    id: "sga",
    name: "SGA",
    color: "#3b82f6",
    scale: 0.21,
    position: [-3.08, -1.73, -0.55],
    mobilePosition: [-0.86, -1.72, -0.24],
    rotationSpeed: 0.078,
    rotationAxis: [0.72, 0.51, 0.3],
    floatAmplitude: 0.027,
    floatSpeed: 0.23,
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
