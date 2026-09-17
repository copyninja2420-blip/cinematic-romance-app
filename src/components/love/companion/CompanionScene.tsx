import { useEffect, useMemo, useRef } from "react";
import {
  Canvas,
  useFrame,
  useThree,
} from "@react-three/fiber";
import {
  ContactShadows,
  Environment,
  Float,
  Lightformer,
  useAnimations,
  useGLTF,
} from "@react-three/drei";
import * as THREE from "three";
import { SkeletonUtils } from "three-stdlib";

import {
  getCompanion,
  reportX,
  type Mood,
} from "@/lib/companion";

const MODEL = "/models/companion.glb";

const HEART = "#ff5d84";
const HEART_GLOW = "#ff8eaa";

const TARGET_HEIGHT = 1.9;

/* -------------------------------------------------------
   Animation mapping

   The important part is that your existing GLB animations
   are still used. If an animation doesn't exist, the code
   safely falls back to another available animation.
------------------------------------------------------- */

const CLIP: Record<string, string> = {
  idle: "Man_Idle",
  walk: "Man_Walk",
  run: "Man_Run",

  jump: "Man_Jump",

  // Your current GLB appears to use sitting for these.
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

/* -------------------------------------------------------
   Heart geometry
------------------------------------------------------- */

function createHeartShape() {
  const shape = new THREE.Shape();

  shape.moveTo(0, -0.35);

  shape.bezierCurveTo(
    -0.65,
    -0.85,
    -1.05,
    -0.15,
    -0.7,
    0.35
  );

  shape.bezierCurveTo(
    -0.4,
    0.75,
    0,
    0.95,
    0,
    0.95
  );

  shape.bezierCurveTo(
    0,
    0.95,
    0.4,
    0.75,
    0.7,
    0.35
  );

  shape.bezierCurveTo(
    1.05,
    -0.15,
    0.65,
    -0.85,
    0,
    -0.35
  );

  return shape;
}

/* -------------------------------------------------------
   Floating decorative heart
------------------------------------------------------- */

function FloatingHeart({
  position,
  scale = 0.08,
  speed = 1,
}: {
  position: [number, number, number];
  scale?: number;
  speed?: number;
}) {
  const ref = useRef<THREE.Mesh>(null);

  const geometry = useMemo(
    () =>
      new THREE.ExtrudeGeometry(createHeartShape(), {
        depth: 0.08,
        bevelEnabled: true,
        bevelSegments: 2,
        bevelSize: 0.025,
        bevelThickness: 0.025,
      }),
    []
  );

  useFrame(({ clock }) => {
    if (!ref.current) return;

    const t = clock.elapsedTime * speed;

    ref.current.rotation.y = Math.sin(t * 0.8) * 0.25;
    ref.current.rotation.z = Math.sin(t * 0.6) * 0.08;

    ref.current.position.y =
      position[1] + Math.sin(t) * 0.06;
  });

  return (
    <mesh
      ref={ref}
      geometry={geometry}
      position={position}
      scale={scale}
    >
      <meshStandardMaterial
        color={HEART}
        emissive={HEART}
        emissiveIntensity={1.8}
        roughness={0.3}
        metalness={0.05}
      />
    </mesh>
  );
}

/* -------------------------------------------------------
   Main 3D character
------------------------------------------------------- */

function Guy() {
  const gltf = useGLTF(MODEL);

  const cloned = useMemo(
    () => SkeletonUtils.clone(gltf.scene),
    [gltf.scene]
  );

  const rig = useRef<THREE.Group>(null);
  const root = useRef<THREE.Group>(null);

  const heart = useRef<THREE.Group>(null);
  const bigHeart = useRef<THREE.Mesh>(null);

  const { actions, mixer } = useAnimations(
    gltf.animations,
    rig
  );

  const { viewport } = useThree();

  /* -----------------------------------------------------
     Find correct character height and scale
  ----------------------------------------------------- */

  const fit = useMemo(() => {
    const box = new THREE.Box3().setFromObject(cloned);

    const size = new THREE.Vector3();
    box.getSize(size);

    const height = Math.max(size.y, 0.001);

    return {
      scale: TARGET_HEIGHT / height,
      height,
    };
  }, [cloned]);

  /* -----------------------------------------------------
     Character state
  ----------------------------------------------------- */

  const state = useRef({
    x: 0.18,
    facing: 1,
    animation: "",
    lastMood: "",
  });

  /* -----------------------------------------------------
     Character bones
  ----------------------------------------------------- */

  const bones = useMemo(() => {
    const result: {
      head?: THREE.Bone;
      neck?: THREE.Bone;

      armR?: THREE.Bone;
      foreR?: THREE.Bone;

      armL?: THREE.Bone;
      foreL?: THREE.Bone;
    } = {};

    cloned.traverse((obj) => {
      if (!(obj as THREE.Bone).isBone) return;

      const bone = obj as THREE.Bone;

      const name = bone.name.toLowerCase();

      if (name === "head") result.head = bone;

      if (name === "neck") result.neck = bone;

      if (
        name.includes("upperarm.r") ||
        name.includes("upper_arm.r")
      ) {
        result.armR = bone;
      }

      if (
        name.includes("lowerarm.r") ||
        name.includes("lower_arm.r")
      ) {
        result.foreR = bone;
      }

      if (
        name.includes("upperarm.l") ||
        name.includes("upper_arm.l")
      ) {
        result.armL = bone;
      }

      if (
        name.includes("lowerarm.l") ||
        name.includes("lower_arm.l")
      ) {
        result.foreL = bone;
      }
    });

    return result;
  }, [cloned]);

  /* -----------------------------------------------------
     Character materials

     We do not replace the model. We only slightly enhance
     existing materials.
  ----------------------------------------------------- */

  useEffect(() => {
    cloned.traverse((obj) => {
      const mesh = obj as THREE.Mesh;

      if (!mesh.isMesh) return;

      mesh.castShadow = true;
      mesh.receiveShadow = true;

      const material = mesh.material;

      if (Array.isArray(material)) {
        material.forEach((mat) => {
          if ("roughness" in mat) {
            mat.roughness = Math.min(
              0.8,
              Number(mat.roughness)
            );
          }

          if ("metalness" in mat) {
            mat.metalness = Math.min(
              0.25,
              Number(mat.metalness)
            );
          }
        });
      } else if (material) {
        if ("roughness" in material) {
          material.roughness = Math.min(
            0.8,
            Number(material.roughness)
          );
        }

        if ("metalness" in material) {
          material.metalness = Math.min(
            0.25,
            Number(material.metalness)
          );
        }
      }
    });
  }, [cloned]);

  /* -----------------------------------------------------
     Create heart
  ----------------------------------------------------- */

  const heartGeometry = useMemo(
    () =>
      new THREE.ExtrudeGeometry(createHeartShape(), {
        depth: 0.12,
        bevelEnabled: true,
        bevelSegments: 3,
        bevelSize: 0.04,
        bevelThickness: 0.04,
      }),
    []
  );

  /* -----------------------------------------------------
     Animation controller

     IMPORTANT:
     Animation is changed only when required.
     It is NOT searched every frame.
  ----------------------------------------------------- */

  const play = (name: string) => {
    if (!actions) return;

    if (state.current.animation === name) {
      return;
    }

    const next = actions[name];

    if (!next) return;

    const previous =
      actions[state.current.animation];

    next.reset();
    next.setEffectiveWeight(1);
    next.setEffectiveTimeScale(1);
    next.fadeIn(0.4);
    next.play();

    if (previous && previous !== next) {
      previous.fadeOut(0.4);
    }

    state.current.animation = name;
  };

  /* -----------------------------------------------------
     Start idle animation
  ----------------------------------------------------- */

  useEffect(() => {
    if (!actions) return;

    const available = Object.keys(actions);

    const idle =
      available.find(
        (name) =>
          name.toLowerCase() ===
          CLIP.idle.toLowerCase()
      ) ??
      available.find((name) =>
        name.toLowerCase().includes("idle")
      ) ??
      available[0];

    if (idle) {
      play(idle);
    }

    return () => {
      mixer.stopAllAction();
    };

    // Animation system intentionally initialized once.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actions]);

  /* -----------------------------------------------------
     Choose animation
  ----------------------------------------------------- */

  const chooseAnimation = (
    mood: string,
    walking: boolean,
    running: boolean
  ) => {
    if (!actions) return;

    let wanted = CLIP.idle;

    if (running) {
      wanted = CLIP.run;
    } else if (walking) {
      wanted = CLIP.walk;
    } else if (CLIP[mood]) {
      wanted = CLIP[mood];
    }

    /* Find exact animation first */
    let found = Object.keys(actions).find(
      (key) =>
        key.toLowerCase() === wanted.toLowerCase()
    );

    /* Then partial match */
    if (!found) {
      found = Object.keys(actions).find((key) =>
        key
          .toLowerCase()
          .includes(wanted.toLowerCase().replace("man_", ""))
      );
    }

    /* Final fallback */
    if (!found) {
      found = Object.keys(actions).find((key) =>
        key.toLowerCase().includes("idle")
      );
    }

    if (found) {
      play(found);
    }
  };

  /* -----------------------------------------------------
     Gesture helper
  ----------------------------------------------------- */

  const gesture = (
    arm?: THREE.Bone,
    fore?: THREE.Bone,
    x = 0,
    y = 0,
    z = 0
  ) => {
    if (arm) {
      arm.rotation.x = THREE.MathUtils.lerp(
        arm.rotation.x,
        x,
        0.12
      );

      arm.rotation.y = THREE.MathUtils.lerp(
        arm.rotation.y,
        y,
        0.12
      );

      arm.rotation.z = THREE.MathUtils.lerp(
        arm.rotation.z,
        z,
        0.12
      );
    }

    if (fore) {
      fore.rotation.z = THREE.MathUtils.lerp(
        fore.rotation.z,
        z * 0.55,
        0.12
      );
    }
  };

  /* -----------------------------------------------------
     Main animation loop
  ----------------------------------------------------- */

  useFrame((st, rawDelta) => {
    const dt = Math.min(rawDelta, 0.05);
    const t = st.clock.elapsedTime;

    const companion = getCompanion();

    const mood = String(companion.mood);

    const current = state.current;

    /* -----------------------------------------------
       Target movement
    ------------------------------------------------ */

    const dx = companion.targetX - current.x;

    const running = mood === "run";

    const grounded =
      mood === "sit" ||
      mood === "read" ||
      mood === "kneel";

    const walking =
      Math.abs(dx) > 0.012 &&
      !grounded;

    if (walking) {
      const speed = running
        ? 0.42
        : 0.20;

      current.x +=
        Math.sign(dx) *
        Math.min(Math.abs(dx), speed * dt);

      current.facing =
        Math.sign(dx) || current.facing;
    }

    reportX(current.x);

    /* -----------------------------------------------
       Change animation only when mood/walking state
       changes.
    ------------------------------------------------ */

    const animationState =
      `${mood}-${walking}-${running}`;

    if (current.lastMood !== animationState) {
      chooseAnimation(
        mood,
        walking,
        running
      );

      current.lastMood = animationState;
    }

    /* -----------------------------------------------
       Smooth horizontal movement
    ------------------------------------------------ */

    if (root.current) {
      const targetX =
        (current.x - 0.5) *
        viewport.width;

      root.current.position.x =
        THREE.MathUtils.damp(
          root.current.position.x,
          targetX,
          8,
          dt
        );

      root.current.position.x =
        THREE.MathUtils.clamp(
          root.current.position.x,
          -viewport.width * 0.48,
          viewport.width * 0.48
        );

      /* ---------------------------------------------
         Face movement direction
      --------------------------------------------- */

      const faceTarget =
        walking
          ? current.facing * 1.15
          : THREE.MathUtils.clamp(
              (companion.pointer?.x ?? 0.5) - 0.5,
              -0.8,
              0.8
            );

      root.current.rotation.y =
        THREE.MathUtils.damp(
          root.current.rotation.y,
          faceTarget,
          5,
          dt
        );

      /* ---------------------------------------------
         Vertical position
      --------------------------------------------- */

      const targetY =
        grounded
          ? -0.95
          : -0.95 +
            Math.sin(t * 2) *
              0.008;

      root.current.position.y =
        THREE.MathUtils.damp(
          root.current.position.y,
          targetY,
          6,
          dt
        );
    }

    /* -----------------------------------------------
       Natural breathing
    ------------------------------------------------ */

    if (rig.current) {
      const breathing =
        Math.sin(t * 1.8) * 0.012;

      rig.current.scale.y =
        fit.scale *
        (1 + breathing);

      rig.current.scale.x =
        fit.scale *
        (1 - breathing * 0.35);

      rig.current.scale.z =
        fit.scale *
        (1 - breathing * 0.35);
    }

    /* -----------------------------------------------
       Head follows pointer/touch
    ------------------------------------------------ */

    if (bones.head) {
      const px =
        companion.pointer?.x ?? 0.5;

      const py =
        companion.pointer?.y ?? 0.45;

      const targetY =
        (px - 0.5) * 0.65;

      const targetX =
        -(py - 0.45) * 0.4;

      bones.head.rotation.y =
        THREE.MathUtils.damp(
          bones.head.rotation.y,
          targetY,
          5,
          dt
        );

      bones.head.rotation.x =
        THREE.MathUtils.damp(
          bones.head.rotation.x,
          targetX,
          5,
          dt
        );
    }

    /* -----------------------------------------------
       Reset / gesture layer
    ------------------------------------------------ */

    if (mood === "wave") {
      const wave =
        Math.sin(t * 5) * 0.28;

      gesture(
        bones.armR,
        bones.foreR,
        -2.0,
        0,
        -0.55 + wave
      );
    } else if (mood === "point") {
      gesture(
        bones.armR,
        bones.foreR,
        -1.2,
        -0.25,
        0.12
      );
    } else if (mood === "kiss") {
      gesture(
        bones.armR,
        bones.foreR,
        -1.45,
        -0.25,
        0.1
      );
    } else if (
      mood === "heart" ||
      mood === "present"
    ) {
      gesture(
        bones.armR,
        bones.foreR,
        -0.9,
        -0.7,
        -0.9
      );

      gesture(
        bones.armL,
        bones.foreL,
        0.9,
        -0.7,
        0.9
      );
    }

    /* -----------------------------------------------
       Small idle body movement
    ------------------------------------------------ */

    if (
      rig.current &&
      !walking &&
      !grounded
    ) {
      rig.current.rotation.z =
        Math.sin(t * 1.1) *
        0.008;

      rig.current.rotation.y =
        Math.sin(t * 0.7) *
        0.012;
    }

    /* -----------------------------------------------
       Main glowing heart
    ------------------------------------------------ */

    const showHeart =
      mood === "heart" ||
      mood === "present";

    if (heart.current) {
      const targetScale =
        showHeart ? 1 : 0;

      const currentScale =
        heart.current.scale.x;

      const nextScale =
        THREE.MathUtils.damp(
          currentScale,
          targetScale,
          8,
          dt
        );

      heart.current.scale.setScalar(
        Math.max(0.001, nextScale)
      );

      heart.current.visible =
        nextScale > 0.01;

      heart.current.position.y =
        1.3 +
        Math.sin(t * 2.2) *
          0.045;

      heart.current.rotation.z =
        Math.sin(t * 1.3) *
        0.05;
    }

    /* -----------------------------------------------
       Big heart pulse
    ------------------------------------------------ */

    if (bigHeart.current) {
      const pulse =
        1 +
        Math.sin(t * 4) *
          (showHeart ? 0.08 : 0.015);

      bigHeart.current.scale.set(
        pulse,
        pulse,
        pulse
      );

      bigHeart.current.rotation.y =
        Math.sin(t * 1.2) *
        0.15;
    }
  });

  return (
    <group
      ref={root}
      position={[0, -0.95, 0]}
    >
      {/* Character */}
      <group
        ref={rig}
        scale={fit.scale}
        position={[0, 0, 0]}
      >
        <primitive object={cloned} />
      </group>

      {/* Main glowing heart */}
      <group
        ref={heart}
        position={[0, 1.3, 0.5]}
        scale={0}
      >
        <mesh
          ref={bigHeart}
          geometry={heartGeometry}
          rotation={[0, 0, Math.PI]}
        >
          <meshStandardMaterial
            color={HEART}
            emissive={HEART_GLOW}
            emissiveIntensity={2.8}
            roughness={0.25}
            metalness={0.05}
          />
        </mesh>

        <pointLight
          color={HEART_GLOW}
          intensity={2.5}
          distance={2.5}
        />
      </group>

      {/* Decorative hearts */}
      <FloatingHeart
        position={[-0.75, 1.65, 0.1]}
        scale={0.055}
        speed={0.9}
      />

      <FloatingHeart
        position={[0.75, 1.85, 0.05]}
        scale={0.045}
        speed={1.15}
      />

      <FloatingHeart
        position={[0.55, 0.9, 0.05]}
        scale={0.035}
        speed={0.75}
      />
    </group>
  );
}

/* -------------------------------------------------------
   Main Scene
------------------------------------------------------- */

useGLTF.preload(MODEL);

export default function CompanionScene() {
  return (
    <Canvas
      dpr={[1, 1.5]}
      shadows
      gl={{
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
      }}
      camera={{
        position: [0, 0.35, 4.2],
        fov: 38,
      }}
      style={{
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        background: "transparent",
      }}
    >
      {/* Soft base lighting */}
      <ambientLight intensity={0.5} />

      {/* Main cinematic light */}
      <directionalLight
        position={[2.5, 4, 3]}
        intensity={1.8}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />

      {/* Warm front light */}
      <directionalLight
        position={[-3, 2, 2]}
        intensity={0.7}
      />

      {/* Soft rim light */}
      <directionalLight
        position={[0, 2, -4]}
        intensity={0.9}
      />

      {/* Romantic environment lighting */}
      <Environment resolution={128}>
        <Lightformer
          intensity={1.4}
          position={[0, 4, 2]}
          scale={[4, 2, 1]}
        />

        <Lightformer
          intensity={0.7}
          position={[-3, 2, 1]}
          scale={[2, 2, 1]}
        />
      </Environment>

      {/* Character floating effect */}
      <Float
        speed={0.7}
        rotationIntensity={0.025}
        floatIntensity={0.04}
      >
        <Guy />
      </Float>

      {/* Soft ground shadow */}
      <ContactShadows
        position={[0, -0.95, 0]}
        opacity={0.35}
        scale={4}
        blur={2.5}
        far={2}
      />

      {/* Very subtle ground plane */}
      <mesh
        position={[0, -0.97, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <planeGeometry args={[4, 4]} />
        <meshStandardMaterial
          transparent
          opacity={0}
        />
      </mesh>
    </Canvas>
  );
}
      
