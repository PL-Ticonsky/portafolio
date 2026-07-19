"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef } from "react";
import { ProjectDetail } from "@/components/detail/project-detail";
import { ProfileDetail } from "@/components/detail/profile-detail";
import { projects } from "@/data/projects";
import { HOLOGRAPHIC_NODES, type NodeId } from "@/data/holographic-nodes";

export function DetailOverlay({
  nodeId,
  onBack,
  onHome,
  onNavigate,
}: {
  nodeId: NodeId;
  onBack: () => void;
  onHome: () => void;
  onNavigate: (nodeId: NodeId) => void;
}) {
  const reducedMotion = useReducedMotion();
  const overlay = useRef<HTMLDivElement>(null);
  const projectIndex = projects.findIndex((project) => project.id === nodeId);
  const project = projectIndex >= 0 ? projects[projectIndex] : null;
  const node = HOLOGRAPHIC_NODES.find((item) => item.id === nodeId);
  const title = nodeId === "ticonsky" ? "TICONSKY / PERFIL" : "TICONSKY / ARCHIVO";

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      overlay.current
        ?.querySelector<HTMLElement>("[data-detail-heading]")
        ?.focus({ preventScroll: true });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [nodeId]);

  return (
    <motion.div
      ref={overlay}
      className="detail-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="detail-title"
      style={{ "--detail-accent": node?.color ?? "#00f5ff" } as React.CSSProperties}
      initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 8 }}
      transition={{
        duration: reducedMotion ? 0.12 : 0.48,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <div className="detail-backdrop" aria-hidden="true" />
      <header className="detail-header">
        <button type="button" onClick={onBack}>
          <span aria-hidden="true">←</span> VOLVER AL GRAFO
        </button>
        <span className="detail-coordinate" aria-hidden="true">
          {title}
        </span>
      </header>
      <main className="detail-scroll">
        {nodeId === "ticonsky" ? (
          <ProfileDetail onNavigate={onNavigate} />
        ) : project ? (
          <ProjectDetail
            project={project}
            index={projectIndex}
            onHome={onHome}
            onNavigate={onNavigate}
          />
        ) : null}
      </main>
    </motion.div>
  );
}
