"use client";

import {
  Canvas,
  type ThreeEvent,
  useFrame,
  useThree,
} from "@react-three/fiber";
import { Html } from "@react-three/drei";
import {
  memo,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
} from "react";
import * as THREE from "three";
import {
  HOLOGRAPHIC_NODES,
  PROJECT_NODES,
  type HolographicNodeConfig,
  type NodeId,
} from "@/data/holographic-nodes";

export type GraphPhase = "overview" | "entering" | "detail" | "exiting";

type SceneProps = {
  active: boolean;
  reducedMotion: boolean;
  hoveredId: NodeId | null;
  focusedId: NodeId | null;
  selectedId: NodeId | null;
  phase: GraphPhase;
  onHover: (id: NodeId | null) => void;
  onSelect: (id: NodeId) => void;
  onTransitionComplete: (phase: "overview" | "detail") => void;
};

type PositionStore = React.MutableRefObject<Record<NodeId, THREE.Vector3>>;
type ProgressStore = React.MutableRefObject<number>;

function createTriangulatedSphere() {
  const geometry = new THREE.IcosahedronGeometry(1, 4);
  const positions = geometry.attributes.position;

  for (let index = 0; index < positions.count; index += 1) {
    const x = positions.getX(index);
    const y = positions.getY(index);
    const z = positions.getZ(index);
    const irregularity =
      1 +
      Math.sin(x * 13.7 + y * 7.1) * 0.012 +
      Math.sin(z * 17.3 - x * 5.4) * 0.009;
    positions.setXYZ(index, x * irregularity, y * irregularity, z * irregularity);
  }

  positions.needsUpdate = true;
  geometry.computeVertexNormals();
  return geometry;
}

const sharedGeometry = createTriangulatedSphere();
const depthMaterial = new THREE.MeshBasicMaterial({
  colorWrite: false,
  depthWrite: true,
  depthTest: true,
  side: THREE.FrontSide,
});

const HolographicNode = memo(function HolographicNode({
  config,
  position,
  reducedMotion,
  highlightedId,
  selectedId,
  phase,
  positions,
  transitionProgress,
  onHover,
  onSelect,
}: {
  config: HolographicNodeConfig;
  position: [number, number, number];
  reducedMotion: boolean;
  highlightedId: NodeId | null;
  selectedId: NodeId | null;
  phase: GraphPhase;
  positions: PositionStore;
  transitionProgress: ProgressStore;
  onHover: (id: NodeId | null) => void;
  onSelect: (id: NodeId) => void;
}) {
  const root = useRef<THREE.Group>(null);
  const meshLayers = useRef<THREE.Group>(null);
  const primaryMaterial = useRef<THREE.MeshBasicMaterial>(null);
  const crossMaterial = useRef<THREE.MeshBasicMaterial>(null);
  const glowMaterial = useRef<THREE.MeshBasicMaterial>(null);
  const label = useRef<HTMLDivElement>(null);
  const visualScale = useRef(1);
  const motionRate = useRef(1);
  const axis = useMemo(
    () => new THREE.Vector3(...config.rotationAxis).normalize(),
    [config.rotationAxis],
  );
  const basePosition = useMemo(() => new THREE.Vector3(...position), [position]);
  const detailPosition = useMemo(() => new THREE.Vector3(0, 0, 0), []);

  useLayoutEffect(() => {
    root.current?.position.copy(basePosition);
    positions.current[config.id].copy(basePosition);
  }, [basePosition, config.id, positions]);

  useFrame(({ clock }, delta) => {
    if (!root.current || !meshLayers.current) return;

    const progress = transitionProgress.current;
    const selected = selectedId === config.id;
    const highlighted = highlightedId === config.id;
    const transitionVisible = selected ? 1 : 1 - progress;
    const hoverVisibility =
      phase === "overview" && highlightedId && !highlighted ? 0.5 : 1;
    const visibility = transitionVisible * hoverVisibility;
    const emphasis = highlighted ? 1.28 : selected ? 1.2 : 1;
    const detailRate = reducedMotion ? 0.01 : 0.12;
    const targetRate = selected
      ? THREE.MathUtils.lerp(1, detailRate, progress)
      : highlightedId && phase === "overview"
        ? 0.22
        : 1;
    const targetScale = highlighted ? 1.045 : 1;

    motionRate.current = THREE.MathUtils.damp(
      motionRate.current,
      targetRate,
      5,
      delta,
    );
    visualScale.current = THREE.MathUtils.damp(
      visualScale.current,
      targetScale,
      7,
      delta,
    );

    if (!reducedMotion) {
      meshLayers.current.rotateOnAxis(
        axis,
        delta * config.rotationSpeed * motionRate.current,
      );
      root.current.position.y =
        basePosition.y +
        Math.sin(clock.elapsedTime * config.floatSpeed + config.floatPhase) *
          config.floatAmplitude *
          motionRate.current;
      root.current.position.x =
        basePosition.x +
        Math.cos(
          clock.elapsedTime * config.floatSpeed * 0.72 + config.floatPhase,
        ) *
          config.floatAmplitude *
          0.28 *
          motionRate.current;
    } else if (selected) {
      root.current.position.lerpVectors(basePosition, detailPosition, progress);
    } else {
      root.current.position.copy(basePosition);
    }

    const reducedDetailScale =
      reducedMotion && selected ? THREE.MathUtils.lerp(1, 24, progress) : 1;
    root.current.scale.setScalar(visualScale.current * reducedDetailScale);
    if (primaryMaterial.current) {
      primaryMaterial.current.opacity = 0.31 * visibility * emphasis;
    }
    if (crossMaterial.current) {
      crossMaterial.current.opacity = 0.115 * visibility * emphasis;
    }
    if (glowMaterial.current) {
      glowMaterial.current.opacity =
        0.048 * visibility * (highlighted ? 2.4 : selected ? 2 : 1);
    }
    if (label.current) {
      label.current.style.opacity = String(
        Math.max(0, (1 - progress * 1.35) * (highlighted ? 1 : 0.7)),
      );
    }
    positions.current[config.id].copy(root.current.position);
  });

  const stopAndSelect = (event: ThreeEvent<MouseEvent>) => {
    if (phase !== "overview") return;
    event.stopPropagation();
    onSelect(config.id);
  };

  const handlePointerOver = (event: ThreeEvent<PointerEvent>) => {
    if (phase !== "overview") return;
    event.stopPropagation();
    onHover(config.id);
  };

  const handlePointerOut = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    onHover(null);
  };

  return (
    <group
      ref={root}
      position={position}
      onClick={stopAndSelect}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      <group ref={meshLayers} scale={config.scale}>
        <mesh
          geometry={sharedGeometry}
          material={depthMaterial}
          renderOrder={-1}
          scale={0.992}
        />
        <mesh geometry={sharedGeometry} scale={1.006}>
          <meshBasicMaterial
            ref={primaryMaterial}
            color={config.color}
            wireframe
            transparent
            opacity={0.31}
            depthTest
            depthWrite={false}
            side={THREE.DoubleSide}
          />
        </mesh>
        <mesh
          geometry={sharedGeometry}
          rotation={[0.31, 0.47, 0.18]}
          scale={1.018}
        >
          <meshBasicMaterial
            ref={crossMaterial}
            color={config.color}
            wireframe
            transparent
            opacity={0.115}
            depthTest
            depthWrite={false}
            side={THREE.DoubleSide}
          />
        </mesh>
        <mesh
          geometry={sharedGeometry}
          rotation={[-0.22, 0.19, 0.36]}
          scale={1.075}
        >
          <meshBasicMaterial
            ref={glowMaterial}
            color={config.color}
            wireframe
            transparent
            opacity={0.048}
            depthTest
            depthWrite={false}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>
      <Html
        center
        position={[0, -config.scale - 0.34, 0]}
        zIndexRange={[8, 0]}
        style={{ pointerEvents: "none" }}
      >
        <div
          ref={label}
          className="node-label"
          style={{ "--node-color": config.color } as React.CSSProperties}
        >
          <span aria-hidden="true" />
          {config.name}
        </div>
      </Html>
    </group>
  );
});

function Connection({
  config,
  positions,
  highlightedId,
  phase,
  transitionProgress,
}: {
  config: HolographicNodeConfig;
  positions: PositionStore;
  highlightedId: NodeId | null;
  phase: GraphPhase;
  transitionProgress: ProgressStore;
}) {
  const material = useRef<THREE.LineBasicMaterial>(null);
  const geometry = useMemo(() => {
    const nextGeometry = new THREE.BufferGeometry();
    nextGeometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute([0, 0, 0, 0, 0, 0], 3),
    );
    return nextGeometry;
  }, []);

  useEffect(() => () => geometry.dispose(), [geometry]);

  useFrame(() => {
    const attribute = geometry.getAttribute("position") as THREE.BufferAttribute;
    const source = positions.current.ticonsky;
    const target = positions.current[config.id];
    const hoverFade =
      phase === "overview" && highlightedId && highlightedId !== config.id
        ? 0.35
        : 1;

    attribute.setXYZ(0, source.x, source.y, source.z);
    attribute.setXYZ(1, target.x, target.y, target.z);
    attribute.needsUpdate = true;
    geometry.computeBoundingSphere();
    if (material.current) {
      material.current.opacity =
        0.23 * hoverFade * (1 - transitionProgress.current);
    }
  });

  return (
    <lineSegments
      geometry={geometry}
      renderOrder={-2}
      raycast={() => null}
    >
      <lineBasicMaterial
        ref={material}
        color={config.color}
        transparent
        opacity={0.23}
        depthTest
        depthWrite={false}
      />
    </lineSegments>
  );
}

function easeInOutQuart(value: number) {
  return value < 0.5
    ? 8 * value * value * value * value
    : 1 - Math.pow(-2 * value + 2, 4) / 2;
}

function HolographicGraph(props: SceneProps) {
  const {
    reducedMotion,
    hoveredId,
    focusedId,
    selectedId,
    phase,
    onHover,
    onSelect,
    onTransitionComplete,
  } = props;
  const { camera, scene, size } = useThree();
  const isMobile = size.width / size.height < 0.82;
  const progress = useRef(phase === "detail" ? 1 : 0);
  const completionSent = useRef(false);
  const animationVectors = useRef({
    overviewCamera: new THREE.Vector3(0, 0, 11.5),
    lookTarget: new THREE.Vector3(),
    detailCamera: new THREE.Vector3(),
    origin: new THREE.Vector3(),
    baseBackground: new THREE.Color("#101416"),
    tintBackground: new THREE.Color("#101416"),
  });
  const positions = useRef(
    Object.fromEntries(
      HOLOGRAPHIC_NODES.map((node) => [node.id, new THREE.Vector3()]),
    ) as Record<NodeId, THREE.Vector3>,
  );

  const resolvedNodes = useMemo(
    () =>
      HOLOGRAPHIC_NODES.map((config) => ({
        config,
        position: isMobile ? config.mobilePosition : config.position,
      })),
    [isMobile],
  );
  const selectedConfig = useMemo(
    () => HOLOGRAPHIC_NODES.find((node) => node.id === selectedId) ?? null,
    [selectedId],
  );
  const highlightedId = hoveredId ?? focusedId;

  useEffect(() => {
    completionSent.current = false;
    if (phase === "detail") progress.current = 1;
    if (phase === "overview") progress.current = 0;
  }, [phase, selectedId]);

  useFrame((_, delta) => {
    const duration = reducedMotion ? 0.2 : 1.55;

    if (phase === "entering") {
      progress.current = Math.min(1, progress.current + delta / duration);
    } else if (phase === "exiting") {
      progress.current = Math.max(0, progress.current - delta / duration);
    }

    const eased = easeInOutQuart(progress.current);
    const target = selectedId ? positions.current[selectedId] : null;
    const vectors = animationVectors.current;

    if (!reducedMotion && target && selectedConfig) {
      vectors.detailCamera.copy(target);
      vectors.detailCamera.z += selectedConfig.scale * 0.1;
      camera.position.lerpVectors(
        vectors.overviewCamera,
        vectors.detailCamera,
        eased,
      );
      vectors.lookTarget.lerpVectors(vectors.origin, target, eased);
      camera.lookAt(vectors.lookTarget);
    } else {
      camera.position.copy(vectors.overviewCamera);
      camera.lookAt(0, 0, 0);
    }

    if (selectedConfig) {
      vectors.tintBackground
        .set(selectedConfig.color)
        .multiplyScalar(0.065);
      (scene.background as THREE.Color)
        .copy(vectors.baseBackground)
        .lerp(vectors.tintBackground, eased * 0.72);
    } else {
      (scene.background as THREE.Color).copy(vectors.baseBackground);
    }

    if (
      phase === "entering" &&
      progress.current >= 1 &&
      !completionSent.current
    ) {
      completionSent.current = true;
      onTransitionComplete("detail");
    }
    if (
      phase === "exiting" &&
      progress.current <= 0 &&
      !completionSent.current
    ) {
      completionSent.current = true;
      onTransitionComplete("overview");
    }
  });

  return (
    <>
      <color attach="background" args={["#101416"]} />
      {PROJECT_NODES.map((config) => (
        <Connection
          key={config.id}
          config={config}
          positions={positions}
          highlightedId={highlightedId}
          phase={phase}
          transitionProgress={progress}
        />
      ))}
      {resolvedNodes.map(({ config, position }) => (
        <HolographicNode
          key={config.id}
          config={config}
          position={position}
          positions={positions}
          reducedMotion={reducedMotion}
          highlightedId={highlightedId}
          selectedId={selectedId}
          phase={phase}
          transitionProgress={progress}
          onHover={onHover}
          onSelect={onSelect}
        />
      ))}
    </>
  );
}

export function UniverseCanvas(props: SceneProps) {
  return (
    <Canvas
      dpr={[1, 1.45]}
      camera={{ position: [0, 0, 11.5], fov: 44, near: 0.025, far: 40 }}
      gl={{
        antialias: true,
        alpha: false,
        powerPreference: "high-performance",
      }}
      frameloop={props.active ? "always" : "demand"}
      onPointerMissed={() => props.onHover(null)}
    >
      <HolographicGraph {...props} />
    </Canvas>
  );
}
