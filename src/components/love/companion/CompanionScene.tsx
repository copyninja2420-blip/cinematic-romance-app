import { Canvas, useFrame, useGraph, useThree } from "@react-three/fiber";
import { ContactShadows, Environment, Lightformer, useAnimations, useGLTF } from "@react-three/drei";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { SkeletonUtils } from "three-stdlib";
import { getCompanion, reportX, type Mood } from "@/lib/companion";

const MODEL = "/models/companion.glb";

/** reference palette — warm skin, dark-brown swept hair, light-blue shirt */
const PALETTE: Record<string, { color: string; roughness?: number }> = {
  Skin: { color: "#f0bd94", roughness: 0.62 },
  Shirt: { color: "#b7d8f4", roughness: 0.72 },
  Shirt2: { color: "#9cc6ea", roughness: 0.72 },
  Hair: { color: "#43291a", roughness: 0.55 },
  Hair2: { color: "#5a3a24", roughness: 0.55 },
  Pants: { color: "#2f3a52", roughness: 0.85 },
  Shoes: { color: "#1b1b23", roughness: 0.45 },
  Socks: { color: "#efe7dd", roughness: 0.9 },
  Eyes: { color: "#3b2418", roughness: 0.2 },
};

const CLIP: Record<string, string> = {
  idle: "Man_Idle",
  walk: "Man_Walk",
  run: "Man_Run",
  jump: "Man_Jump",
  sit: "Man_Sitting",
  read: "Man_Sitting",
  kneel: "Man_Sitting",
  present: "Man_Sitting",
  wave: "Man_Idle",
  kiss: "Man_Idle",
  heart: "Man_Idle",
  point: "Man_Idle",
  peek: "Man_Idle",
};

function heartShape() {
  const s = new THREE.Shape();
  s.moveTo(0, -0.5);
  s.bezierCurveTo(0.6, 0.15, 0.45, 0.75, 0, 0.42);
  s.bezierCurveTo(-0.45, 0.75, -0.6, 0.15, 0, -0.5);
  return s;
}

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const HEART = "#ff5d84";

const TARGET_HEIGHT = 1.9;

function Guy() {
  const { scene, animations } = useGLTF(MODEL);
  const cloned = useMemo(() => SkeletonUtils.clone(scene), [scene]);

  /** the source rig is authored at 100x — normalise him to a human size on screen */
  const fit = useMemo(() => {
    const box = new THREE.Box3().setFromObject(cloned);
    const size = new THREE.Vector3();
    box.getSize(size);
    const h = size.y || 1;
    const s = TARGET_HEIGHT / h;
    return { scale: s, y: -box.min.y * s };
  }, [cloned]);
  const { nodes, materials } = useGraph(cloned) as unknown as {
    nodes: Record<string, THREE.Object3D>;
    materials: Record<string, THREE.MeshStandardMaterial>;
  };

  const rig = useRef<THREE.Group>(null);
  const root = useRef<THREE.Group>(null);
  const heart = useRef<THREE.Group>(null);
  const bigHeart = useRef<THREE.Mesh>(null);
  const { actions, mixer } = useAnimations(animations, rig);
  const { viewport } = useThree();

  const heartGeo = useMemo(
    () =>
      new THREE.ExtrudeGeometry(heartShape(), {
        depth: 0.12,
        bevelEnabled: true,
        bevelSize: 0.05,
        bevelThickness: 0.05,
        bevelSegments: 2,
        curveSegments: 12,
      }),
    [],
  );

  /* restyle the model to match the reference look */
  useEffect(() => {
    for (const [name, mat] of Object.entries(materials)) {
      const p = PALETTE[name];
      if (!p) continue;
      mat.color = new THREE.Color(p.color);
      mat.roughness = p.roughness ?? 0.7;
      mat.metalness = 0;
      mat.needsUpdate = true;
    }
    cloned.traverse((o) => {
      const m = o as THREE.Mesh;
      if (m.isMesh) {
        m.castShadow = true;
        m.frustumCulled = false;
      }
    });
  }, [materials, cloned]);

  const bones = useMemo(
    () => ({
      head: nodes["Head"] as THREE.Bone | undefined,
      neck: nodes["Neck"] as THREE.Bone | undefined,
      armR: nodes["UpperArm.R"] as THREE.Bone | undefined,
      foreR: nodes["LowerArm.R"] as THREE.Bone | undefined,
      armL: nodes["UpperArm.L"] as THREE.Bone | undefined,
      foreL: nodes["LowerArm.L"] as THREE.Bone | undefined,
    }),
    [nodes],
  );

  const cur = useRef({ x: 0.18, facing: 1, clip: "" });

  /* crossfade clips as his mood changes */
  const play = (name: string) => {
    if (cur.current.clip === name) return;
    const next = actions[name];
    if (!next) return;
    const prev = actions[cur.current.clip];
    next.reset().setEffectiveWeight(1).fadeIn(0.35).play();
    prev?.fadeOut(0.35);
    cur.current.clip = name;
  };

  useEffect(() => {
    const first = Object.keys(actions).find((k) => k.includes("Idle")) ?? Object.keys(actions)[0];
    if (first) play(first);
    return () => {
      mixer.stopAllAction();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actions]);

  const clipName = (mood: Mood, walking: boolean, running: boolean) => {
    if (running) return CLIP['run']!;
    if (walking) return CLIP['walk']!;
    return CLIP[mood] ?? CLIP['idle']!;
  };

  useFrame((st, rawDelta) => {
    const dt = Math.min(rawDelta, 0.05);
    const t = st.clock.elapsedTime;
    const s = getCompanion();
    const mood = s.mood;
    const c = cur.current;

    const grounded = mood === "sit" || mood === "read" || mood === "present" || mood === "kneel";

    /* ── travel along the bottom of the screen ── */
    const dx = s.targetX - c.x;
    const running = mood === "run";
    const walking = Math.abs(dx) > 0.012 && !grounded;
    if (walking) {
      const speed = running ? 0.4 : 0.17;
      c.x += Math.sign(dx) * Math.min(Math.abs(dx), speed * dt);
      c.facing = Math.sign(dx);
    }
    reportX(c.x);

    const nameOfClip = Object.keys(actions).find((k) => k.endsWith(clipName(mood, walking, running)));
    if (nameOfClip) play(nameOfClip);

    const halfW = viewport.width / 2;
    if (root.current) {
      root.current.position.x = lerp(
        root.current.position.x,
        (c.x - 0.5) * viewport.width,
        1 - Math.exp(-8 * dt),
      );
      root.current.position.x = THREE.MathUtils.clamp(root.current.position.x, -halfW + 0.5, halfW - 0.5);

      const faceTarget = walking ? c.facing * 1.15 : (s.pointer.x - 0.5) * 0.9;
      root.current.rotation.y = lerp(root.current.rotation.y, faceTarget, 1 - Math.exp(-5 * dt));
      root.current.position.y = -0.95 + (mood === "peek" ? -0.55 : 0);
    }

    /* ── head follows the cursor / touch ── */
    if (bones.head) {
      bones.head.rotation.y = lerp(bones.head.rotation.y, (s.pointer.x - 0.5) * 0.6, 1 - Math.exp(-5 * dt));
      bones.head.rotation.x = lerp(
        bones.head.rotation.x,
        (s.pointer.y - 0.4) * 0.3 + (mood === "read" ? 0.3 : 0),
        1 - Math.exp(-5 * dt),
      );
    }

    /* ── gesture overlays on top of the baked animation ── */
    const gesture = (arm?: THREE.Bone, fore?: THREE.Bone, z = 0, x = 0, foreZ = 0) => {
      if (arm) {
        arm.rotation.z = lerp(arm.rotation.z, z, 1 - Math.exp(-9 * dt));
        arm.rotation.x = lerp(arm.rotation.x, x, 1 - Math.exp(-9 * dt));
      }
      if (fore) fore.rotation.z = lerp(fore.rotation.z, foreZ, 1 - Math.exp(-9 * dt));
    };

    if (mood === "wave") {
      gesture(bones.armR, bones.foreR, -2.2, 0, -0.5 + Math.sin(t * 9) * 0.5);
    } else if (mood === "point") {
      gesture(bones.armR, bones.foreR, -1.2, -0.3, 0.1);
    } else if (mood === "kiss") {
      gesture(bones.armR, bones.foreR, -1.5 - Math.abs(Math.sin(t * 2.5)) * 0.7, -0.4, -0.6);
    } else if (mood === "heart" || mood === "present" || mood === "peek") {
      gesture(bones.armR, bones.foreR, -0.9, -0.7, -0.9);
      gesture(bones.armL, bones.foreL, 0.9, -0.7, 0.9);
    }

    /* ── the glowing heart he carries ── */
    const showHeart = mood === "heart" || mood === "present" || mood === "kiss" || mood === "peek";
    if (heart.current) {
      const k = lerp(heart.current.scale.x, showHeart ? 1 : 0, 1 - Math.exp(-7 * dt));
      heart.current.scale.setScalar(Math.max(0.001, k));
      heart.current.visible = k > 0.01;
      heart.current.position.y = 1.3 + Math.sin(t * 2.2) * 0.07;
    }
    if (bigHeart.current) {
      bigHeart.current.scale.setScalar((mood === "present" ? 2 : 1) * (1 + Math.sin(t * 3) * 0.07));
      bigHeart.current.rotation.y = Math.sin(t * 1.2) * 0.4;
    }
  }, 1);

  return (
    <group ref={root} position={[0, -0.95, 0]}>
      <group ref={rig} scale={fit.scale} position={[0, fit.y, 0]}>
        <primitive object={cloned} />
      </group>

      <group ref={heart} position={[0, 1.3, 0.5]} scale={0.001}>
        <mesh ref={bigHeart} geometry={heartGeo} rotation={[0, 0, Math.PI]}>
          <meshStandardMaterial color={HEART} emissive={HEART} emissiveIntensity={0.8} roughness={0.25} />
        </mesh>
        <pointLight color={HEART} intensity={2.2} distance={3} />
      </group>
    </group>
  );
}

useGLTF.preload(MODEL);

export default function CompanionScene() {
  return (
    <Canvas
      dpr={[1, 1.7]}
      shadows
      gl={{ alpha: true, antialias: true, powerPreference: "low-power", preserveDrawingBuffer: true }}
      camera={{ position: [0, 0.35, 4.2], fov: 38 }}
      style={{ pointerEvents: "none", background: "transparent" }}
    >
      <ambientLight intensity={0.55} />
      <directionalLight position={[2.5, 4, 3]} intensity={1.5} castShadow shadow-mapSize={[1024, 1024]} />
      <directionalLight position={[-3, 1.5, 2]} intensity={0.6} color="#ff9ec4" />
      <directionalLight position={[0, 2, -4]} intensity={0.8} color="#9fd0ff" />
      <Environment>
        <Lightformer intensity={1.6} position={[0, 4, 2]} scale={[8, 8, 1]} />
        <Lightformer intensity={0.8} color="#ffd6e6" position={[-4, 1, 2]} rotation-y={Math.PI / 2} scale={[10, 3, 1]} />
      </Environment>
      <ContactShadows position={[0, -0.95, 0]} opacity={0.35} scale={6} blur={2.6} far={2} />
      <mesh position={[0,0,0]}><boxGeometry args={[1,1,1]} /><meshBasicMaterial color="#ff0000" /></mesh>
      <Guy />
    </Canvas>
  );
}
