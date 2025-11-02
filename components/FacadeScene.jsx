"use client";
import { Canvas, useThree } from '@react-three/fiber';
import { Environment, ContactShadows, OrbitControls, Html } from '@react-three/drei';
import { useCallback, useMemo, useState } from 'react';
import * as THREE from 'three';

function Export8KButton() {
  const { gl, scene, camera, size } = useThree();
  const [busy, setBusy] = useState(false);

  const handleExport = useCallback(async () => {
    if (busy) return;
    setBusy(true);
    try {
      const targetWidth = 7680;
      const targetHeight = 4320;
      const prevPR = gl.getPixelRatio();
      const prevW = size.width;
      const prevH = size.height;

      gl.setPixelRatio(1);
      gl.setSize(targetWidth, targetHeight, false);
      gl.render(scene, camera);
      const dataUrl = gl.domElement.toDataURL('image/png');

      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = 'facade-8k.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      gl.setSize(prevW, prevH, false);
      gl.setPixelRatio(prevPR);
    } catch (e) {
      console.error(e);
    } finally {
      setBusy(false);
    }
  }, [busy, gl, scene, camera, size.width, size.height]);

  return (
    <Html position={[0,0,0]} fullscreen style={{ pointerEvents: 'none' }}>
      <div style={{ position:'absolute', right:16, bottom:16, display:'flex', gap:8, pointerEvents:'auto' }}>
        <button onClick={handleExport} disabled={busy} style={{
          background: busy ? 'rgba(255,255,255,0.08)' : 'linear-gradient(180deg, #2a2f39, #1c212a)',
          color:'#e6e9ef', border:'1px solid rgba(255,255,255,0.1)', borderRadius:10,
          padding:'10px 14px', cursor: busy ? 'not-allowed' : 'pointer', fontWeight:600, letterSpacing:0.3
        }}>
          {busy ? 'Rendering 8K?' : 'Export 8K PNG'}
        </button>
      </div>
    </Html>
  );
}

function Facade() {
  // Materials
  const concrete = useMemo(() => new THREE.MeshStandardMaterial({ color: '#8b8f94', roughness: 0.9, metalness: 0.05 }), []);
  const glass = useMemo(() => new THREE.MeshPhysicalMaterial({ color: '#bcd0ff', metalness: 0.0, roughness: 0.05, transmission: 1, thickness: 0.2, ior: 1.45, reflectivity: 0.9, transparent: true }), []);
  const metal = useMemo(() => new THREE.MeshStandardMaterial({ color: '#b5bcc6', roughness: 0.25, metalness: 1.0 }), []);
  const wood = useMemo(() => new THREE.MeshStandardMaterial({ color: '#9a6b3d', roughness: 0.8, metalness: 0.05 }), []);
  const led = useMemo(() => new THREE.MeshStandardMaterial({ color: '#111111', emissive: '#cfe8ff', emissiveIntensity: 2.4, roughness: 0.4, metalness: 0.1 }), []);

  // Group container
  return (
    <group position={[0, 1.8, 0]}>
      {/* Base building volume - concrete */}
      <mesh castShadow receiveShadow material={concrete} position={[0, 1.8, 0]}>
        <boxGeometry args={[10, 3.6, 4]} />
      </mesh>

      {/* Recessed glass strip */}
      <group position={[0, 2.2, 2.02]}>
        <mesh castShadow material={glass}>
          <boxGeometry args={[8.4, 2.0, 0.05]} />
        </mesh>
        {/* Metal mullions */}
        {Array.from({ length: 7 }).map((_, i) => (
          <mesh key={i} castShadow material={metal} position={[ -3.6 + i*(8.4/6), 0, 0.06 ]}>
            <boxGeometry args={[0.06, 2.0, 0.06]} />
          </mesh>
        ))}
      </group>

      {/* Wood-clad box projection */}
      <group position={[-2.2, 2.6, 0.8]}>
        <mesh castShadow receiveShadow material={wood}>
          <boxGeometry args={[2.8, 1.6, 1.6]} />
        </mesh>
        {/* LED underlight */}
        <mesh material={led} position={[0, -0.8, 0.8]}>
          <boxGeometry args={[2.6, 0.04, 0.04]} />
        </mesh>
      </group>

      {/* Geometric white boxes */}
      <mesh castShadow material={concrete} position={[2.8, 3.0, 1.0]}>
        <boxGeometry args={[1.6, 0.9, 1.2]} />
      </mesh>
      <mesh castShadow material={concrete} position={[3.4, 2.2, -0.3]}>
        <boxGeometry args={[0.8, 0.8, 0.8]} />
      </mesh>

      {/* Vertical fins across the glass */}
      <group position={[0, 2.2, 2.12]}>
        {Array.from({ length: 17 }).map((_, i) => {
          const x = -4.2 + i * 0.5;
          const height = 1.9 + Math.sin(i * 0.5) * 0.2;
          return (
            <mesh key={i} castShadow material={metal} position={[x, 0, 0]}>
              <boxGeometry args={[0.06, height, 0.12]} />
            </mesh>
          );
        })}
      </group>

      {/* Subtle LED linear lights under overhang */}
      <group position={[0, 0.9, 2.02]}>
        <mesh material={led} position={[-2.4, -0.02, 0]}>
          <boxGeometry args={[4.8, 0.03, 0.03]} />
        </mesh>
        <mesh material={led} position={[2.4, -0.02, 0]}>
          <boxGeometry args={[4.8, 0.03, 0.03]} />
        </mesh>
      </group>
    </group>
  );
}

function Ground() {
  return (
    <group>
      <mesh receiveShadow rotation={[-Math.PI/2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="#1b1f24" roughness={1} metalness={0} />
      </mesh>
      <ContactShadows position={[0, 0.001, 0]} opacity={0.5} scale={20} blur={2.5} far={10} />
    </group>
  );
}

export default function FacadeCanvas() {
  return (
    <Canvas
      shadows
      gl={{ antialias: true, preserveDrawingBuffer: true }}
      dpr={[1, 2]}
      camera={{ position: [9, 5, 10.5], fov: 40 }}
    >
      <color attach="background" args={["#0b0d10"]} />

      {/* Lighting */}
      <hemisphereLight intensity={0.15} groundColor="#0b0d10" />
      <directionalLight
        position={[8, 10, 6]}
        intensity={1.25}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />

      <Environment preset="sunset" background={false} />

      <Facade />
      <Ground />

      <OrbitControls enableDamping dampingFactor={0.08} target={[0, 2.0, 0]} maxPolarAngle={Math.PI/2.05} />
      <Export8KButton />
    </Canvas>
  );
}
