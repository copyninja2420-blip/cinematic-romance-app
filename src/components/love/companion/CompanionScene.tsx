import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { getCompanion, reportX, type Mood } from "@/lib/companion";

/** ── palette ─────────────────────────────────────────────── */
const SKIN = "#f0c39a";
const HAIR = "#2a1a1d";
const SHIRT = "#7d1230";
const SHIRT_TRIM = "#e9c37a";
const PANTS = "#241a24";
const HEART = "#ff5d84";

function heartShape() {
  const s = new THREE.Shape();
  s.moveTo(0, -0.5);
  s.bezierCurveTo(0.6, 0.15, 0.45, 0.75, 0, 0.42);
  s.bezierCurveTo(-0.45, 0.75, -0.6, 0.15, 0, -0.5);
  return s;
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

/** The little husband. Everything is procedural so the payload stays tiny. */
function Guy() {
  const root = useRef<THREE.Group>(null);
  const body = useRef<THREE.Group>(null);
  const head = useRef<THREE.Group>(null);
  const eyeL = useRef<THREE.Mesh>(null);
  const eyeR = useRef<THREE.Mesh>(null);
  const armL = useRef<THREE.Group>(null);
  const armR = useRef<THREE.Group>(null);
  const legL = useRef<THREE.Group>(null);
  const legR = useRef<THREE.Group>(null);
  const heart = useRef<THREE.Group>(null);
  const bigHeart = useRef<THREE.Mesh>(null);

  const { viewport } = useThree();
  const heartGeo = useMemo(
    () => new THREE.ExtrudeGeometry(heartShape(), { depth: 0.12, bevelEnabled: true, bevelSize: 0.05, bevelThickness: 0.05, bevelSegments: 2, curveSegments: 10 }),
    [],
  );

  const cur = useRef({ x: 0.18, facing: 1, sit: 0, blink: 0, nextBlink: 2 });

  useFrame((st, rawDelta) => {
    const dt = Math.min(rawDelta, 0.05);
    const t = st.clock.elapsedTime;
    const s = getCompanion();
    const mood: Mood = s.mood;
    const c = cur.current;

    /* ── move along the bottom of the screen ───────────────── */
    const dx = s.targetX - c.x;
    const walking = Math.abs(dx) > 0.012 && mood !== "sit" && mood !== "read" && mood !== "present";
    if (walking) {
      const step = Math.sign(dx) * Math.min(Math.abs(dx), 0.16 * dt);
      c.x += step;
      c.facing = Math.sign(dx);
    }
    reportX(c.x);

    const halfW = viewport.width / 2;
    if (root.current) {
      root.current.position.x = lerp(root.current.position.x, (c.x - 0.5) * viewport.width, 1 - Math.exp(-8 * dt));
      root.current.position.x = THREE.MathUtils.clamp(root.current.position.x, -halfW + 0.55, halfW - 0.55);
    }

    /* ── posture: sitting / kneeling ───────────────────────── */
    const wantSit = mood === "sit" || mood === "read" || mood === "present" ? 1 : 0;
    c.sit = lerp(c.sit, wantSit, 1 - Math.exp(-6 * dt));

    /* ── body: breathing, bob, hop ─────────────────────────── */
    const breath = Math.sin(t * 1.9) * 0.02;
    const bob = walking ? Math.abs(Math.sin(t * 7)) * 0.07 : 0;
    const hop = mood === "jump" ? Math.abs(Math.sin(t * 7)) * 0.35 : 0;
    if (body.current) {
      body.current.position.y = 0.02 + breath + bob + hop - c.sit * 0.38;
      body.current.rotation.z = walking ? Math.sin(t * 7) * 0.05 : Math.sin(t * 1.4) * 0.02;
    }
    if (root.current) {
      const faceTarget = walking ? c.facing * 0.5 : (s.pointer.x - 0.5) * 0.9;
      root.current.rotation.y = lerp(root.current.rotation.y, faceTarget, 1 - Math.exp(-5 * dt));
    }

    /* ── head: look at the cursor, nod while reading ───────── */
    if (head.current) {
      const readNod = mood === "read" ? Math.sin(t * 1.6) * 0.16 + 0.35 : 0;
      head.current.rotation.y = lerp(head.current.rotation.y, (s.pointer.x - 0.5) * 0.7, 1 - Math.exp(-5 * dt));
      head.current.rotation.x = lerp(head.current.rotation.x, (s.pointer.y - 0.4) * 0.35 + readNod, 1 - Math.exp(-5 * dt));
    }

    /* ── blinking ──────────────────────────────────────────── */
    c.blink -= dt;
    if (c.blink < -0.11) {
      c.nextBlink = 1.6 + Math.random() * 3;
      c.blink = c.nextBlink;
    }
    const lid = c.blink < 0 ? 0.1 : 1;
    if (eyeL.current) eyeL.current.scale.y = lerp(eyeL.current.scale.y, lid, 0.5);
    if (eyeR.current) eyeR.current.scale.y = lerp(eyeR.current.scale.y, lid, 0.5);

    /* ── arms ──────────────────────────────────────────────── */
    let lTarget = 0.12;
    let rTarget = 0.12;
    let lZ = 0.1;
    let rZ = -0.1;
    if (walking) {
      lTarget = Math.sin(t * 7) * 0.6;
      rTarget = -Math.sin(t * 7) * 0.6;
    }
    if (mood === "wave") {
      rZ = -2.5 + Math.sin(t * 9) * 0.35;
      rTarget = 0;
    }
    if (mood === "kiss") {
      rZ = -1.5 - Math.abs(Math.sin(t * 3)) * 0.9;
      rTarget = -0.6;
    }
    if (mood === "heart" || mood === "present") {
      lZ = 0.95;
      rZ = -0.95;
      lTarget = -0.9;
      rTarget = -0.9;
    }
    if (mood === "read") {
      lTarget = -1.15;
      rTarget = -1.15;
      lZ = 0.45;
      rZ = -0.45;
    }
    if (armL.current) {
      armL.current.rotation.x = lerp(armL.current.rotation.x, lTarget, 1 - Math.exp(-9 * dt));
      armL.current.rotation.z = lerp(armL.current.rotation.z, lZ, 1 - Math.exp(-9 * dt));
    }
    if (armR.current) {
      armR.current.rotation.x = lerp(armR.current.rotation.x, rTarget, 1 - Math.exp(-9 * dt));
      armR.current.rotation.z = lerp(armR.current.rotation.z, rZ, 1 - Math.exp(-9 * dt));
    }

    /* ── legs ──────────────────────────────────────────────── */
    const swing = walking ? Math.sin(t * 7) * 0.55 : 0;
    if (legL.current) {
      legL.current.rotation.x = lerp(legL.current.rotation.x, swing - c.sit * 1.5, 1 - Math.exp(-9 * dt));
    }
    if (legR.current) {
      legR.current.rotation.x = lerp(legR.current.rotation.x, -swing - c.sit * 1.5, 1 - Math.exp(-9 * dt));
    }

    /* ── the floating heart he carries ─────────────────────── */
    const showHeart = mood === "heart" || mood === "present" || mood === "kiss";
    if (heart.current) {
      const target = showHeart ? 1 : 0;
      const k = lerp(heart.current.scale.x, target, 1 - Math.exp(-7 * dt));
      heart.current.scale.setScalar(Math.max(0.001, k));
      heart.current.visible = k > 0.01;
      heart.current.position.y = 1.15 + Math.sin(t * 2.2) * 0.07 + (mood === "kiss" ? 0.15 : 0);
      heart.current.rotation.y = Math.sin(t * 1.4) * 0.5;
    }
    if (bigHeart.current) {
      const pulse = 1 + Math.sin(t * 3) * 0.07;
      bigHeart.current.scale.setScalar((mood === "present" ? 1.9 : 1) * pulse);
    }
  });

  return (
    <group ref={root} position={[0, -0.95, 0]}>
      <group ref={body}>
        {/* legs */}
        <group ref={legL} position={[-0.16, 0.52, 0]}>
          <mesh position={[0, -0.26, 0]} castShadow>
            <capsuleGeometry args={[0.11, 0.32, 4, 10]} />
            <meshStandardMaterial color={PANTS} roughness={0.8} />
          </mesh>
          <mesh position={[0, -0.53, 0.06]}>
            <boxGeometry args={[0.19, 0.1, 0.28]} />
            <meshStandardMaterial color="#120c12" roughness={0.6} />
          </mesh>
        </group>
        <group ref={legR} position={[0.16, 0.52, 0]}>
          <mesh position={[0, -0.26, 0]} castShadow>
            <capsuleGeometry args={[0.11, 0.32, 4, 10]} />
            <meshStandardMaterial color={PANTS} roughness={0.8} />
          </mesh>
          <mesh position={[0, -0.53, 0.06]}>
            <boxGeometry args={[0.19, 0.1, 0.28]} />
            <meshStandardMaterial color="#120c12" roughness={0.6} />
          </mesh>
        </group>

        {/* torso */}
        <mesh position={[0, 0.82, 0]} castShadow>
          <capsuleGeometry args={[0.27, 0.36, 6, 16]} />
          <meshStandardMaterial color={SHIRT} roughness={0.55} />
        </mesh>
        {/* collar + little bow tie */}
        <mesh position={[0, 1.06, 0.2]}>
          <torusGeometry args={[0.11, 0.03, 8, 18]} />
          <meshStandardMaterial color={SHIRT_TRIM} roughness={0.35} metalness={0.35} />
        </mesh>

        {/* arms */}
        <group ref={armL} position={[-0.3, 1.0, 0]}>
          <mesh position={[0, -0.26, 0]} castShadow>
            <capsuleGeometry args={[0.085, 0.3, 4, 10]} />
            <meshStandardMaterial color={SHIRT} roughness={0.6} />
          </mesh>
          <mesh position={[0, -0.48, 0]}>
            <sphereGeometry args={[0.095, 14, 12]} />
            <meshStandardMaterial color={SKIN} roughness={0.7} />
          </mesh>
        </group>
        <group ref={armR} position={[0.3, 1.0, 0]}>
          <mesh position={[0, -0.26, 0]} castShadow>
            <capsuleGeometry args={[0.085, 0.3, 4, 10]} />
            <meshStandardMaterial color={SHIRT} roughness={0.6} />
          </mesh>
          <mesh position={[0, -0.48, 0]}>
            <sphereGeometry args={[0.095, 14, 12]} />
            <meshStandardMaterial color={SKIN} roughness={0.7} />
          </mesh>
        </group>

        {/* head */}
        <group ref={head} position={[0, 1.42, 0]}>
          <mesh castShadow>
            <sphereGeometry args={[0.33, 24, 20]} />
            <meshStandardMaterial color={SKIN} roughness={0.75} />
          </mesh>
          {/* hair */}
          <mesh position={[0, 0.09, -0.02]} rotation={[-0.15, 0, 0]}>
            <sphereGeometry args={[0.335, 22, 18, 0, Math.PI * 2, 0, Math.PI / 2.1]} />
            <meshStandardMaterial color={HAIR} roughness={0.85} />
          </mesh>
          <mesh position={[0.16, 0.2, 0.18]} rotation={[0.4, 0.3, 0.5]}>
            <capsuleGeometry args={[0.05, 0.12, 4, 8]} />
            <meshStandardMaterial color={HAIR} roughness={0.85} />
          </mesh>
          {/* eyes */}
          <mesh ref={eyeL} position={[-0.12, 0.03, 0.29]}>
            <sphereGeometry args={[0.045, 14, 12]} />
            <meshStandardMaterial color="#1a1016" roughness={0.3} />
          </mesh>
          <mesh ref={eyeR} position={[0.12, 0.03, 0.29]}>
            <sphereGeometry args={[0.045, 14, 12]} />
            <meshStandardMaterial color="#1a1016" roughness={0.3} />
          </mesh>
          {/* blush */}
          <mesh position={[-0.2, -0.06, 0.24]}>
            <sphereGeometry args={[0.055, 12, 10]} />
            <meshStandardMaterial color="#e8748c" transparent opacity={0.5} roughness={1} />
          </mesh>
          <mesh position={[0.2, -0.06, 0.24]}>
            <sphereGeometry args={[0.055, 12, 10]} />
            <meshStandardMaterial color="#e8748c" transparent opacity={0.5} roughness={1} />
          </mesh>
          {/* smile */}
          <mesh position={[0, -0.11, 0.28]} rotation={[0, 0, Math.PI]}>
            <torusGeometry args={[0.075, 0.016, 8, 16, Math.PI]} />
            <meshStandardMaterial color="#8c2a3c" roughness={0.5} />
          </mesh>
        </group>

        {/* the heart he holds / blows */}
        <group ref={heart} position={[0, 1.15, 0.5]} scale={0.001}>
          <mesh ref={bigHeart} geometry={heartGeo} scale={1} rotation={[0, 0, Math.PI]}>
            <meshStandardMaterial
              color={HEART}
              emissive={HEART}
              emissiveIntensity={0.7}
              roughness={0.35}
            />
          </mesh>
          <pointLight color={HEART} intensity={2.2} distance={3} />
        </group>
      </group>

      {/* soft contact shadow */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <circleGeometry args={[0.45, 20]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.28} />
      </mesh>
    </group>
  );
}

export default function CompanionScene() {
  return (
    <Canvas
      dpr={[1, 1.6]}
      gl={{ alpha: true, antialias: true, powerPreference: "low-power" }}
      camera={{ position: [0, 0.2, 4.4], fov: 38 }}
      style={{ pointerEvents: "none", background: "transparent" }}
    >
      <ambientLight intensity={0.85} />
      <directionalLight position={[2.5, 4, 3]} intensity={1.5} />
      <directionalLight position={[-3, 1.5, 2]} intensity={0.6} color="#ff9ec4" />
      <Guy />
    </Canvas>
  );
}
