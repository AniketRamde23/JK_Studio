'use client';

import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Pointer parallax camera rig (Design Spec 5.2 & Sec 11)
function CameraRig() {
  useFrame((state, dt) => {
    const { x, y } = state.pointer; // -1..1
    const cam = state.camera;
    // Frame-rate independent lerp
    const factor = 1 - Math.exp(-4 * dt);
    cam.position.x += (x * 0.7 - cam.position.x) * factor;
    cam.position.y += (y * 0.35 - cam.position.y) * factor;
    cam.lookAt(0, 0, 0);
  });
  return null;
}

// Floating Photo Card with authentic JK photograph
function PhotoCard({
  pos,
  rot,
  imgSrc,
  speed,
  index,
  size = [1.0, 1.36],
  featured = false,
}: {
  pos: [number, number, number];
  rot: [number, number, number];
  imgSrc: string;
  speed: number;
  index: number;
  size?: [number, number];
  featured?: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);

  const texture = useMemo(() => {
    const loader = new THREE.TextureLoader();
    const tex = loader.load(imgSrc);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.generateMipmaps = true;
    tex.minFilter = THREE.LinearMipmapLinearFilter;
    return tex;
  }, [imgSrc]);

  useEffect(() => {
    return () => {
      texture.dispose();
    };
  }, [texture]);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();
    const floatAmp = featured ? 0.04 : 0.07;
    groupRef.current.position.y = pos[1] + Math.sin(t * speed + index * 1.5) * floatAmp;
    groupRef.current.rotation.z = rot[2] + Math.cos(t * speed * 0.7 + index) * (featured ? 0.015 : 0.03);
  });

  const [w, h] = size;
  const borderW = w + 0.08;
  const borderH = h + 0.08;

  return (
    <group ref={groupRef} position={pos} rotation={rot}>
      {/* Gold metallic frame border / backing */}
      <mesh position={[0, 0, -0.015]}>
        <planeGeometry args={[borderW, borderH]} />
        <meshStandardMaterial
          color="#C8A96B"
          metalness={0.85}
          roughness={0.25}
          emissive="#C8A96B"
          emissiveIntensity={featured ? 0.25 : 0.12}
        />
      </mesh>
      {/* Authentic JK Photo print */}
      <mesh position={[0, 0, 0]}>
        <planeGeometry args={[w, h]} />
        <meshBasicMaterial map={texture} toneMapped={false} />
      </mesh>
      {/* High-gloss photographic glaze reflection */}
      <mesh position={[0, 0, 0.005]}>
        <planeGeometry args={[w, h]} />
        <meshPhysicalMaterial
          color="#ffffff"
          transmission={0.9}
          opacity={0.12}
          transparent={true}
          roughness={0.15}
          reflectivity={0.6}
        />
      </mesh>
    </group>
  );
}

// Floating Photo Cards (Design Spec 5.2: Centerpiece photo + floating frames at artistic depths)
function FloatingPhotos() {
  const cardPlanes = useMemo(() => {
    return [
      // Main Centerpiece Photo Card on the right
      {
        pos: [1.2, 0.05, 0.1],
        rot: [0.02, -0.12, 0.02],
        speed: 0.6,
        imgSrc: '/images/jk_logo.jpg', // Authentic JK Camera Portrait
        size: [1.35, 1.8] as [number, number],
        featured: true,
      },
      // Top Right floating card
      {
        pos: [2.5, 1.3, -0.6],
        rot: [0.08, -0.2, -0.04],
        speed: 1.1,
        imgSrc: '/photos/thumbs/13.webp', // Fashion Editorial
        size: [0.95, 1.3] as [number, number],
      },
      // Bottom Right floating card
      {
        pos: [2.6, -1.2, -0.4],
        rot: [-0.08, -0.15, 0.08],
        speed: 0.8,
        imgSrc: '/photos/thumbs/19.webp', // Cinema Stills / BTS
        size: [0.95, 1.3] as [number, number],
      },
      // Top Left floating card
      {
        pos: [-1.5, 1.25, -0.7],
        rot: [0.1, 0.22, -0.07],
        speed: 0.85,
        imgSrc: '/photos/thumbs/1.webp', // Weddings & Celebrations
        size: [0.95, 1.3] as [number, number],
      },
      // Bottom Left floating card
      {
        pos: [-1.9, -0.85, -0.4],
        rot: [-0.12, 0.16, 0.08],
        speed: 1.0,
        imgSrc: '/photos/thumbs/4.webp', // Cinematic Performance
        size: [0.95, 1.3] as [number, number],
      },
      // Top Center ambient card
      {
        pos: [-0.1, 1.65, -1.2],
        rot: [0.04, -0.06, 0.04],
        speed: 0.75,
        imgSrc: '/photos/thumbs/2.webp', // Intimacy / Heirloom
        size: [0.9, 1.22] as [number, number],
      },
    ];
  }, []);

  return (
    <group>
      {cardPlanes.map((c, idx) => (
        <PhotoCard
          key={idx}
          index={idx}
          pos={c.pos as [number, number, number]}
          rot={c.rot as [number, number, number]}
          imgSrc={c.imgSrc}
          speed={c.speed}
          size={c.size}
          featured={c.featured}
        />
      ))}
    </group>
  );
}

// Cinematic Dust Particles / Motes (Design Spec 5.2: 150 motes)
function DustParticles({ count = 140 }: { count?: number }) {
  const pointsRef = useRef<THREE.Points>(null);

  const particlesPosition = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 7;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 6;
    }
    return positions;
  }, [count]);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const t = state.clock.getElapsedTime() * 0.08;
    pointsRef.current.rotation.y = t * 0.5;
    pointsRef.current.rotation.x = Math.sin(t) * 0.2;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particlesPosition.length / 3}
          array={particlesPosition}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.035}
        color="#E3C98D"
        transparent
        opacity={0.55}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export default function HeroScene() {
  return (
    <div className="w-full h-full absolute inset-0 pointer-events-auto">
      <Canvas
        camera={{ position: [0, 0, 4.8], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        {/* Lights (Design Spec 5.2: One warm key light top-left, one cool fill right) */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[-4, 4, 3]} intensity={2.2} color="#FCE6C4" />
        <pointLight position={[3, -2, 2]} intensity={0.8} color="#A8C4EC" />
        <pointLight position={[1.2, 0, 2]} intensity={1.5} color="#C8A96B" />

        <CameraRig />
        <FloatingPhotos />
        <DustParticles />
      </Canvas>
    </div>
  );
}
