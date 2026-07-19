import type { Project } from "@/lib/types";

const mediaSlots = (projectName: string) => [
  {
    src: "/placeholders/project-frame.svg",
    alt: `Ranura técnica uno; ${projectName} todavía no tiene una captura asociada`,
  },
  {
    src: "/placeholders/project-detail.svg",
    alt: `Ranura técnica dos; ${projectName} todavía no tiene una captura asociada`,
  },
];

export const projects = [
  {
    id: "museum-heist",
    slug: "museum-heist",
    name: "MUSEUM HEIST",
    shortDescription:
      "Exploración algorítmica con estrategias greedy, backtracking y visualización de rutas.",
    fullDescription:
      "Exploración algorítmica de recorridos dentro de un museo mediante estrategias greedy y backtracking.",
    problem:
      "Modelar recorridos dentro de un museo y abordarlos con distintas estrategias algorítmicas.",
    solution:
      "Implementación de estrategias greedy y backtracking acompañadas por una visualización de rutas.",
    role: "Implementación de algoritmos y visualización.",
    contribution:
      "Implementación de algoritmos, modelado del problema y visualización de rutas.",
    status: "Completado",
    year: "2024",
    color: "#a855f7",
    technologies: ["Python", "Algoritmos", "Backtracking", "Visualización"],
    images: mediaSlots("Museum Heist"),
    preview: { type: "unavailable" },
    order: 1,
  },
  {
    id: "sembraalas",
    slug: "sembraalas",
    name: "SEMBRAALAS",
    color: "#2dd4bf",
    technologies: [],
    images: mediaSlots("SembraAlas"),
    preview: { type: "unavailable" },
    order: 2,
  },
  {
    id: "sga",
    slug: "sga",
    name: "SGA",
    color: "#3b82f6",
    technologies: [],
    images: mediaSlots("SGA"),
    preview: { type: "unavailable" },
    order: 3,
  },
  {
    id: "tinta",
    slug: "tinta",
    name: "TINTA",
    color: "#f97316",
    technologies: [],
    images: mediaSlots("Tinta"),
    preview: { type: "unavailable" },
    order: 4,
  },
  {
    id: "reservaciones",
    slug: "reservaciones",
    name: "RESERVACIONES",
    color: "#eab308",
    technologies: [],
    images: mediaSlots("Reservaciones"),
    preview: { type: "unavailable" },
    order: 5,
  },
] satisfies Project[];

export function getProjectBySlug(slug: string) {
  return projects.find((project) => project.slug === slug);
}
