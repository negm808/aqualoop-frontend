import React, { useState, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Float, MeshDistortMaterial, Html, Environment, ContactShadows, Stage } from '@react-three/drei';
import * as THREE from 'three';

const EcosystemPart = ({ type, position, color, label, detail, active, onClick }: any) => {
  const meshRef = useRef<THREE.Mesh>(null!);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = active ? Math.sin(state.clock.elapsedTime * 2) * 0.1 : 0;
      if (active) meshRef.current.rotation.y += 0.01;
    }
  });

  return (
    <group position={position} onClick={onClick}>
      <mesh ref={meshRef} castShadow receiveShadow>
        {type === 'cylinder' ? (
          <cylinderGeometry args={[2, 2, 4, 32]} />
        ) : (
          <boxGeometry args={[4.5, 1.5, 3]} />
        )}
        <MeshDistortMaterial
          color={color}
          speed={active ? 3 : 1}
          distort={active ? 0.3 : 0.05}
          opacity={0.85}
          transparent
          roughness={0.2}
          metalness={0.1}
        />
      </mesh>
      
      {/* Water Simulation Mesh */}
      <mesh position={[0, type === 'cylinder' ? 1.5 : 0.5, 0]}>
        {type === 'cylinder' ? (
          <cylinderGeometry args={[1.9, 1.9, 0.1, 32]} />
        ) : (
          <boxGeometry args={[4.4, 0.1, 2.9]} />
        )}
        <meshStandardMaterial color="#3498db" transparent opacity={0.6} />
      </mesh>

      <Text
        position={[0, type === 'cylinder' ? 3 : 1.5, 0]}
        fontSize={0.4}
        color="#2c3e50"
        font="https://fonts.gstatic.com/s/fraunces/v9/60U597V3K17iXG1H1fPF-E9_5X1y.woff"
      >
        {label}
      </Text>

      {active && (
        <Html position={[0, type === 'cylinder' ? -3 : -1.5, 0]} center>
          <div className="glass" style={{
            padding: '16px 24px',
            width: '240px',
            borderRadius: 'var(--r-md)',
            border: `2px solid ${color}`,
            background: 'rgba(255,255,255,0.95)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
          }}>
            <div className="text-label" style={{ color, marginBottom: '4px' }}>{label}</div>
            <div className="text-body-sm" style={{ color: 'var(--text)', lineHeight: '1.4' }}>{detail}</div>
          </div>
        </Html>
      )}
    </group>
  );
};

export const SystemModel3D: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const parts = [
    { type: 'cylinder', label: 'FISH TANK', color: '#c8873a', detail: 'Primary habitat for Grey Mullet. Waste production starts the nutrient loop.' },
    { type: 'box', label: 'BIOFILTER', color: '#3a6b35', detail: 'Nitrification zone. Bacteria convert toxic ammonia into nitrates for plant uptake.' },
    { type: 'box', label: 'DWC BED', color: '#27ae60', detail: 'Floating raft system (1m x 0.5m) for Lettuce. Plants clean the water via nutrient uptake.' }
  ];

  return (
    <div style={{ width: '100%', height: '500px', cursor: 'grab' }}>
      <Canvas camera={{ position: [15, 10, 20], fov: 35 }} style={{ background: 'transparent' }} shadows>
        <color attach="background" args={['#F7F3EE']} />
        <Environment preset="city" />
        <ambientLight intensity={0.4} />
        
        <Stage environment="city" intensity={0.5} adjustCamera={false}>
          <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
            <EcosystemPart
              type={parts[0].type}
              position={[-6, 0, 0]}
              color={parts[0].color}
              label={parts[0].label}
              detail={parts[0].detail}
              active={activeIndex === 0}
              onClick={() => setActiveIndex(activeIndex === 0 ? null : 0)}
            />
            <EcosystemPart
              type={parts[1].type}
              position={[0, 0, 0]}
              color={parts[1].color}
              label={parts[1].label}
              detail={parts[1].detail}
              active={activeIndex === 1}
              onClick={() => setActiveIndex(activeIndex === 1 ? null : 1)}
            />
            <EcosystemPart
              type={parts[2].type}
              position={[6, 0, 2]}
              color={parts[2].color}
              label={parts[2].label}
              detail={parts[2].detail}
              active={activeIndex === 2}
              onClick={() => setActiveIndex(activeIndex === 2 ? null : 2)}
            />
          </Float>
        </Stage>

        <ContactShadows position={[0, -2, 0]} opacity={0.4} scale={25} blur={2} far={4} />
        <OrbitControls enableZoom={false} autoRotate={activeIndex === null} autoRotateSpeed={0.5} />
      </Canvas>
    </div>
  );
};
