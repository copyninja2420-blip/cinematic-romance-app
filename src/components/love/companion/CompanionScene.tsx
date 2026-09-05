import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { getCompanion, reportX, type Mood } from "@/lib/companion";

/** ── palette (light-blue shirt, dark-brown hair, warm skin) ── */
const SKIN = "#e8b38b";
const SKIN_DARK = "#d59b74";
const HAIR = "#3a2418";
const SHIRT = "#a8d4f2";
const SHIRT_DARK = "#7fb8e0";
const PANTS = "#2f3a52";
const SHOE = "#1a1a22";
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

/** The little husband — fully procedural, so the payload stays tiny. */
function Guy() {
  const root = useRef<THREE.Group>(null);
  const body = useRef<THREE.Group>(null);
  const head = useRef<THREE.Group>(null);
  const eyeL = useRef<THREE.Group>(null);
  const eyeR = useRef<THREE.Group>(null);
  const browL = useRef<THREE.Mesh>(null);
  const browR = useRef<THREE.Mesh>(null);
  const armL = useRef<THREE.Group>(null);
  const armR = useRef<THREE.Group>(null);
  const legL = useRef<THREE.Group>(null);
  const legR = useRef<THREE.Group>(null);
  const heart = useRef<THREE.Group>(null);
  const bigHeart = useRef<THREE.Mesh>(null);

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

  const cur = useRef({ x: 0.18, facing: 1, sit: 0, blink: 0, duck: 0 });

  useFrame((st, rawDelta) => {
    const dt = Math.min(rawDelta, 0.05);
    const t = st.clock.elapsedTime;
    const s = getCompanion();
    const mood: Mood = s.mood;
    const c = cur.current;

    const grounded = mood === "sit" || mood === "read" || mood === "present" || mood === "kneel";

    /* ── move along the bottom of the screen ───────────────── */
    const dx = s.targetX - c.x;
    const running = mood === "run";
    const walking = Math.abs(dx) > 0.012 && !grounded;
    if (walking) {
      const speed = running ? 0.42 : 0.18;
      c.x += Math.sign(dx) * Math.min(Math.abs(dx), speed * dt);
      c.facing = Math.sign(dx);
    }
    reportX(c.x);

    const halfW = viewport.width / 2;
    if (root.current) {
      root.current.position.x = lerp(
        root.current.position.x,
        (c.x - 0.5) * viewport.width,
        1 - Math.exp(-8 * dt),
      );
      root.current.position.x = THREE.MathUtils.clamp(root.current.position.x, -halfW + 0.55, halfW - 0.55);
    }

    /* ── posture: sitting / kneeling / ducking behind a card ─ */
    c.sit = lerp(c.sit, grounded ? 1 : 0, 1 - Math.exp(-6 * dt));
    c.duck = lerp(c.duck, mood === "peek" ? 1 : 0, 1 - Math.exp(-7 * dt));

    /* ── body: breathing, bob, hop ─────────────────────────── */
    const cadence = running ? 11 : 7;
    const breath = Math.sin(t * 1.9) * 0.022;
    const bob = walking ? Math.abs(Math.sin(t * cadence)) * (running ? 0.12 : 0.07) : 0;
    const hop = mood === "jump" ? Math.abs(Math.sin(t * 7)) * 0.35 : 0;
    if (body.current) {
      body.current.position.y = 0.02 + breath + bob + hop - c.sit * 0.4 - c.duck * 0.62;
      body.current.rotation.z = walking ? Math.sin(t * cadence) * 0.05 : Math.sin(t * 1.4) * 0.02;
      body.current.rotation.x = running ? 0.22 : c.sit * 0.06;
    }
    if (root.current) {
      const faceTarget = walking ? c.facing * 0.55 : (s.pointer.x - 0.5) * 0.9;
      root.current.rotation.y = lerp(root.current.rotation.y, faceTarget, 1 - Math.exp(-5 * dt));
    }

    /* ── head: look at the cursor, nod while reading ───────── */
    if (head.current) {
      const readNod = mood === "read" ? Math.sin(t * 1.6) * 0.16 + 0.35 : 0;
      const idleLook = mood === "idle" ? Math.sin(t * 0.6) * 0.25 : 0;
      head.current.rotation.y = lerp(
        head.current.rotation.y,
        (s.pointer.x - 0.5) * 0.7 + idleLook,
        1 - Math.exp(-5 * dt),
      );
      head.current.rotation.x = lerp(
        head.current.rotation.x,
        (s.pointer.y - 0.4) * 0.35 + readNod,
        1 - Math.exp(-5 * dt),
      );
    }

    /* ── blinking + expressive brows ───────────────────────── */
    c.blink -= dt;
    if (c.blink < -0.1) c.blink = 1.8 + Math.random() * 3;
    const lid = c.blink < 0 ? 0.08 : 1;
    if (eyeL.current) eyeL.current.scale.y = lerp(eyeL.current.scale.y, lid, 0.5);
    if (eyeR.current) eyeR.current.scale.y = lerp(eyeR.current.scale.y, lid, 0.5);
    const browLift = mood === "jump" || mood === "wave" || mood === "peek" ? 0.05 : 0;
    if (browL.current) browL.current.position.y = lerp(browL.current.position.y, 0.14 + browLift, 0.2);
    if (browR.current) browR.current.position.y = lerp(browR.current.position.y, 0.14 + browLift, 0.2);

    /* ── arms ──────────────────────────────────────────────── */
    let lTarget = 0.12;
    let rTarget = 0.12;
    let lZ = 0.1;
    let rZ = -0.1;
    if (walking) {
      const amp = running ? 0.95 : 0.6;
      lTarget = Math.sin(t * cadence) * amp;
      rTarget = -Math.sin(t * cadence) * amp;
    }
    if (mood === "wave") {
      rZ = -2.5 + Math.sin(t * 9) * 0.35;
      rTarget = 0;
    }
    if (mood === "point") {
      rZ = -1.35;
      rTarget = -0.35 + Math.sin(t * 4) * 0.08;
      lZ = 0.15;
      lTarget = 0.1;
    }
    if (mood === "kiss") {
      rZ = -1.5 - Math.abs(Math.sin(t * 3)) * 0.9;
      rTarget = -0.6;
    }
    if (mood === "heart" || mood === "present" || mood === "peek") {
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

    /* ── legs (kneel = one leg folded) ─────────────────────── */
    const swing = walking ? Math.sin(t * cadence) * (running ? 0.9 : 0.55) : 0;
    const kneel = mood === "kneel" || mood === "present" ? 1 : 0;
    if (legL.current) {
      legL.current.rotation.x = lerp(
        legL.current.rotation.x,
        swing - c.sit * 1.5 - c.duck * 1.1,
        1 - Math.exp(-9 * dt),
      );
    }
    if (legR.current) {
      legR.current.rotation.x = lerp(
        legR.current.rotation.x,
        -swing - c.sit * 1.5 * (kneel ? 0.35 : 1) - c.duck * 1.1,
        1 - Math.exp(-9 * dt),
      );
    }

    /* ── the floating heart he carries ─────────────────────── */
    const showHeart = mood === "heart" || mood === "present" || mood === "kiss" || mood === "peek";
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
      bigHeart.current.scale.setScalar((mood === "present" ? 2 : 1) * pulse);
    }
  });

  return (
    <group ref={root} position={[0, -0.95, 0]}>
      <group ref={body}>
        {/* legs */}
        {[-0.15, 0.15].map((px, i) => (
          <group key={px} ref={i === 0 ? legL : legR} position={[px, 0.54, 0]}>
            <mesh position={[0, -0.27, 0]} castShadow>
              <capsuleGeometry args={[0.105, 0.34, 4, 12]} />
              <meshStandardMaterial color={PANTS} roughness={0.85} />
            </mesh>
            <mesh position={[0, -0.55, 0.06]}>
              <boxGeometry args={[0.185, 0.1, 0.28]} />
              <meshStandardMaterial color={SHOE} roughness={0.5} />
            </mesh>
          </group>
        ))}

        {/* torso — light-blue shirt */}
        <mesh position={[0, 0.84, 0]} castShadow>
          <capsuleGeometry args={[0.265, 0.38, 8, 20]} />
          <meshStandardMaterial color={SHIRT} roughness={0.65} />
        </mesh>
        {/* shirt button placket */}
        <mesh position={[0, 0.84, 0.245]}>
          <boxGeometry args={[0.05, 0.5, 0.03]} />
          <meshStandardMaterial color={SHIRT_DARK} roughness={0.6} />
        </mesh>
        {/* open collar */}
        <mesh position={[-0.09, 1.06, 0.19]} rotation={[0.25, 0, 0.5]}>
          <boxGeometry args={[0.16, 0.13, 0.03]} />
          <meshStandardMaterial color={SHIRT_DARK} roughness={0.6} />
        </mesh>
        <mesh position={[0.09, 1.06, 0.19]} rotation={[0.25, 0, -0.5]}>
          <boxGeometry args={[0.16, 0.13, 0.03]} />
          <meshStandardMaterial color={SHIRT_DARK} roughness={0.6} />
        </mesh>
        {/* neck */}
        <mesh position={[0, 1.14, 0]}>
          <capsuleGeometry args={[0.085, 0.1, 4, 10]} />
          <meshStandardMaterial color={SKIN_DARK} roughness={0.8} />
        </mesh>

        {/* arms */}
        {[-0.3, 0.3].map((px, i) => (
          <group key={px} ref={i === 0 ? armL : armR} position={[px, 1.0, 0]}>
            <mesh position={[0, -0.2, 0]} castShadow>
              <capsuleGeometry args={[0.088, 0.2, 4, 12]} />
              <meshStandardMaterial color={SHIRT} roughness={0.65} />
            </mesh>
            <mesh position={[0, -0.38, 0]}>
              <capsuleGeometry args={[0.072, 0.16, 4, 12]} />
              <meshStandardMaterial color={SKIN} roughness={0.8} />
            </mesh>
            <mesh position={[0, -0.51, 0]}>
              <sphereGeometry args={[0.085, 14, 12]} />
              <meshStandardMaterial color={SKIN} roughness={0.8} />
            </mesh>
          </group>
        ))}

        {/* head */}
        <group ref={head} position={[0, 1.44, 0]}>
          <mesh castShadow scale={[1, 1.06, 0.98]}>
            <sphereGeometry args={[0.33, 28, 24]} />
            <meshStandardMaterial color={SKIN} roughness={0.72} />
          </mesh>
          {/* ears */}
          <mesh position={[-0.32, -0.01, 0]} scale={[0.5, 1, 0.7]}>
            <sphereGeometry args={[0.075, 12, 10]} />
            <meshStandardMaterial color={SKIN_DARK} roughness={0.8} />
          </mesh>
          <mesh position={[0.32, -0.01, 0]} scale={[0.5, 1, 0.7]}>
            <sphereGeometry args={[0.075, 12, 10]} />
            <meshStandardMaterial color={SKIN_DARK} roughness={0.8} />
          </mesh>
          {/* thick dark-brown hair */}
          <mesh position={[0, 0.07, -0.01]} rotation={[-0.12, 0, 0]}>
            <sphereGeometry args={[0.35, 26, 20, 0, Math.PI * 2, 0, Math.PI / 1.95]} />
            <meshStandardMaterial color={HAIR} roughness={0.9} />
          </mesh>
          <mesh position={[0, 0.16, 0.13]} rotation={[0.5, 0, 0]} scale={[1.25, 0.55, 0.8]}>
            <sphereGeometry args={[0.22, 18, 14]} />
            <meshStandardMaterial color={HAIR} roughness={0.9} />
          </mesh>
          <mesh position={[0.15, 0.24, 0.12]} rotation={[0.5, 0.4, 0.6]}>
            <capsuleGeometry args={[0.05, 0.13, 4, 10]} />
            <meshStandardMaterial color={HAIR} roughness={0.9} />
          </mesh>
          {/* brows */}
          <mesh ref={browL} position={[-0.13, 0.14, 0.28]} rotation={[0, 0, 0.12]}>
            <boxGeometry args={[0.11, 0.026, 0.03]} />
            <meshStandardMaterial color={HAIR} roughness={0.9} />
          </mesh>
          <mesh ref={browR} position={[0.13, 0.14, 0.28]} rotation={[0, 0, -0.12]}>
            <boxGeometry args={[0.11, 0.026, 0.03]} />
            <meshStandardMaterial color={HAIR} roughness={0.9} />
          </mesh>
          {/* large expressive eyes */}
          {[-0.125, 0.125].map((px, i) => (
            <group key={px} ref={i === 0 ? eyeL : eyeR} position={[px, 0.025, 0.26]}>
              <mesh>
                <sphereGeometry args={[0.075, 18, 16]} />
                <meshStandardMaterial color="#fdfbfa" roughness={0.35} />
              </mesh>
              <mesh position={[0, 0, 0.055]}>
                <sphereGeometry args={[0.042, 16, 14]} />
                <meshStandardMaterial color="#43281a" roughness={0.25} />
              </mesh>
              <mesh position={[0, 0, 0.08]}>
                <sphereGeometry args={[0.022, 12, 10]} />
                <meshStandardMaterial color="#12080a" roughness={0.2} />
              </mesh>
              <mesh position={[0.018, 0.024, 0.095]}>
                <sphereGeometry args={[0.014, 10, 8]} />
                <meshBasicMaterial color="#ffffff" />
              </mesh>
            </group>
          ))}
          {/* nose */}
          <mesh position={[0, -0.04, 0.31]}>
            <sphereGeometry args={[0.043, 12, 10]} />
            <meshStandardMaterial color={SKIN_DARK} roughness={0.8} />
          </mesh>
          {/* blush */}
          <mesh position={[-0.21, -0.08, 0.23]}>
            <sphereGeometry args={[0.055, 12, 10]} />
            <meshStandardMaterial color="#e8748c" transparent opacity={0.45} roughness={1} />
          </mesh>
          <mesh position={[0.21, -0.08, 0.23]}>
            <sphereGeometry args={[0.055, 12, 10]} />
            <meshStandardMaterial color="#e8748c" transparent opacity={0.45} roughness={1} />
          </mesh>
          {/* warm smile */}
          <mesh position={[0, -0.14, 0.27]} rotation={[0, 0, Math.PI]}>
            <torusGeometry args={[0.078, 0.017, 8, 18, Math.PI]} />
            <meshStandardMaterial color="#8c2a3c" roughness={0.5} />
          </mesh>
        </group>

        {/* the heart he holds / blows */}
        <group ref={heart} position={[0, 1.15, 0.5]} scale={0.001}>
          <mesh ref={bigHeart} geometry={heartGeo} scale={1} rotation={[0, 0, Math.PI]}>
            <meshStandardMaterial color={HEART} emissive={HEART} emissiveIntensity={0.75} roughness={0.3} />
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
      <ambientLight intensity={0.8} />
      <directionalLight position={[2.5, 4, 3]} intensity={1.6} />
      <directionalLight position={[-3, 1.5, 2]} intensity={0.65} color="#ff9ec4" />
      <directionalLight position={[0, 2, -4]} intensity={0.9} color="#9fd0ff" />
      <Guy />
    </Canvas>
  );
}
