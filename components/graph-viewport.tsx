"use client";

import dynamic from "next/dynamic";
import { AnimatePresence, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { DetailOverlay } from "@/components/detail/detail-overlay";
import {
  HOLOGRAPHIC_NODES,
  isNodeId,
  nodePath,
  type NodeId,
} from "@/data/holographic-nodes";
import { getProjectBySlug } from "@/data/projects";
import type {
  GraphPhase,
  SceneMotionState,
} from "@/components/scene/universe-canvas";

const UniverseCanvas = dynamic(
  () =>
    import("@/components/scene/universe-canvas").then(
      (module) => module.UniverseCanvas,
    ),
  {
    ssr: false,
    loading: () => <div className="graph-loading" aria-hidden="true" />,
  },
);

function nodeFromPathname(pathname: string): NodeId | null {
  if (pathname === "/ticonsky" || pathname === "/ticonsky/") return "ticonsky";
  const match = pathname.match(/^\/proyectos\/([^/]+)\/?$/);
  const slug = match?.[1];
  if (!slug) return null;
  const project = getProjectBySlug(decodeURIComponent(slug));
  return project && isNodeId(project.id) ? project.id : null;
}

type QueuedNavigation = {
  nodeId: NodeId;
  updateHistory: boolean;
};

export function GraphViewport({
  initialNodeId = null,
}: {
  initialNodeId?: NodeId | null;
}) {
  const reducedMotion = useReducedMotion();
  const [pageVisible, setPageVisible] = useState(true);
  const directHistorySeeded = useRef(false);
  const transitionLock = useRef(Boolean(initialNodeId));
  const queuedNavigation = useRef<QueuedNavigation | null>(null);
  const returnFocusId = useRef<NodeId | null>(null);
  const graphControls = useRef<HTMLDivElement>(null);
  const [hoveredId, setHoveredId] = useState<NodeId | null>(null);
  const [focusedId, setFocusedId] = useState<NodeId | null>(null);
  const [selectedId, setSelectedId] = useState<NodeId | null>(
    initialNodeId,
  );
  const [phase, setPhase] = useState<GraphPhase>(
    initialNodeId ? "detail" : "overview",
  );
  const selectedIdRef = useRef<NodeId | null>(initialNodeId);
  const phaseRef = useRef<GraphPhase>(
    initialNodeId ? "detail" : "overview",
  );
  const motionState: SceneMotionState =
    phase === "entering"
      ? "transitioning"
      : phase === "exiting"
        ? "returning"
        : phase === "detail"
          ? "detail"
          : hoveredId || focusedId
            ? "hovered"
            : "idle";

  const updateSelectedId = useCallback((id: NodeId | null) => {
    selectedIdRef.current = id;
    setSelectedId(id);
  }, []);

  const updatePhase = useCallback((nextPhase: GraphPhase) => {
    phaseRef.current = nextPhase;
    setPhase(nextPhase);
  }, []);

  const navigateToNode = useCallback(
    (id: NodeId, updateHistory: boolean) => {
      const currentPhase = phaseRef.current;
      const currentSelection = selectedIdRef.current;

      setHoveredId(null);
      setFocusedId(null);
      transitionLock.current = true;
      returnFocusId.current = null;

      if (currentSelection === id) {
        queuedNavigation.current = null;
        if (currentPhase === "exiting") {
          updatePhase("entering");
        }
        return;
      }

      if (currentPhase === "overview" || !currentSelection) {
        queuedNavigation.current = null;
        updateSelectedId(id);
        if (updateHistory) {
          window.history.pushState(
            { holographicNode: id },
            "",
            nodePath(id),
          );
        }
        updatePhase("entering");
        return;
      }

      queuedNavigation.current = {
        nodeId: id,
        updateHistory,
      };
      if (currentPhase !== "exiting") {
        updatePhase("exiting");
      }
    },
    [updatePhase, updateSelectedId],
  );

  const beginSelection = useCallback(
    (id: NodeId) => {
      if (
        transitionLock.current ||
        phaseRef.current !== "overview"
      ) {
        return;
      }
      navigateToNode(id, true);
    },
    [navigateToNode],
  );

  const returnToOverview = useCallback(() => {
    queuedNavigation.current = null;
    setHoveredId(null);
    setFocusedId(null);
    returnFocusId.current = selectedIdRef.current;
    if (
      phaseRef.current === "overview" ||
      !selectedIdRef.current
    ) {
      transitionLock.current = false;
      updateSelectedId(null);
      updatePhase("overview");
      return;
    }

    transitionLock.current = true;
    if (phaseRef.current !== "exiting") {
      updatePhase("exiting");
    }
  }, [updatePhase, updateSelectedId]);

  const goHome = useCallback(() => {
    if (
      window.location.pathname !== "/" ||
      window.location.search ||
      window.location.hash
    ) {
      window.history.pushState(
        { holographicOverview: true },
        "",
        "/",
      );
    }
    returnToOverview();
  }, [returnToOverview]);

  useEffect(() => {
    const handleVisibility = () => {
      setPageVisible(document.visibilityState === "visible");
    };
    const initialSync = window.setTimeout(handleVisibility, 0);
    document.addEventListener("visibilitychange", handleVisibility);
    return () => {
      window.clearTimeout(initialSync);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  useEffect(() => {
    if (initialNodeId && !directHistorySeeded.current) {
      directHistorySeeded.current = true;
      if (window.history.state?.holographicNode !== initialNodeId) {
        window.history.replaceState({ holographicOverview: true }, "", "/");
        window.history.pushState(
          { holographicNode: initialNodeId },
          "",
          nodePath(initialNodeId),
        );
      }
    }
  }, [initialNodeId]);

  useEffect(() => {
    const handlePopState = () => {
      const nodeId = nodeFromPathname(window.location.pathname);
      if (!nodeId) {
        returnToOverview();
      } else {
        navigateToNode(nodeId, false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.key === "Escape" &&
        selectedIdRef.current &&
        phaseRef.current !== "exiting"
      ) {
        event.preventDefault();
        goHome();
      }
    };

    const handleFutureReturn = () => {
      if (
        selectedIdRef.current &&
        phaseRef.current !== "exiting"
      ) {
        goHome();
      }
    };

    window.addEventListener("popstate", handlePopState);
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("ticonsky:return", handleFutureReturn);
    return () => {
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("ticonsky:return", handleFutureReturn);
    };
  }, [goHome, navigateToNode, returnToOverview]);

  const handleTransitionComplete = useCallback(
    (destination: "overview" | "detail") => {
      if (destination === "detail") {
        if (phaseRef.current === "entering") {
          updatePhase("detail");
        }
        return;
      }

      if (phaseRef.current !== "exiting") return;

      const nextNavigation = queuedNavigation.current;
      queuedNavigation.current = null;

      if (nextNavigation) {
        updateSelectedId(nextNavigation.nodeId);
        if (nextNavigation.updateHistory) {
          window.history.pushState(
            { holographicNode: nextNavigation.nodeId },
            "",
            nodePath(nextNavigation.nodeId),
          );
        }
        updatePhase("entering");
      } else {
        const focusId = returnFocusId.current;
        returnFocusId.current = null;
        transitionLock.current = false;
        updateSelectedId(null);
        updatePhase("overview");
        window.requestAnimationFrame(() => {
          graphControls.current
            ?.querySelector<HTMLButtonElement>(`[data-node-id="${focusId ?? ""}"]`)
            ?.focus({ preventScroll: true });
        });
      }
    },
    [updatePhase, updateSelectedId],
  );

  const canvasProps = useMemo(
    () => ({
      active: pageVisible,
      reducedMotion: Boolean(reducedMotion),
      hoveredId,
      focusedId,
      selectedId,
      phase,
      motionState,
      onHover: setHoveredId,
      onSelect: beginSelection,
      onTransitionComplete: handleTransitionComplete,
    }),
    [
      beginSelection,
      focusedId,
      handleTransitionComplete,
      hoveredId,
      pageVisible,
      phase,
      reducedMotion,
      selectedId,
      motionState,
    ],
  );

  return (
    <div
      className={`graph-viewport${hoveredId ? " is-hovering" : ""}`}
      data-motion-state={motionState}
      role={phase === "detail" ? undefined : "main"}
      aria-label="Grafo tridimensional de proyectos"
    >
      <UniverseCanvas {...canvasProps} />
      <div
        ref={graphControls}
        className="graph-a11y-controls"
        aria-label="Proyectos"
      >
        {HOLOGRAPHIC_NODES.map((node) => (
          <button
            key={node.id}
            data-node-id={node.id}
            type="button"
            aria-label={`Abrir nodo ${node.name}: ${node.description}`}
            disabled={phase !== "overview"}
            onFocus={() => setFocusedId(node.id)}
            onBlur={() => setFocusedId(null)}
            onClick={() => beginSelection(node.id)}
          />
        ))}
      </div>
      <AnimatePresence>
        {phase === "detail" && selectedId && (
          <DetailOverlay
            key={selectedId}
            nodeId={selectedId}
            onBack={goHome}
            onHome={goHome}
            onNavigate={(id) => navigateToNode(id, true)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
