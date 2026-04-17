import { Canvas, useFrame } from '@react-three/fiber';
import { Text, OrbitControls } from '@react-three/drei';
import { useRef, useMemo } from 'react';
import * as THREE from 'three';

interface Building3DProps {
  activeFloor: number;
  totalFloors: number;
}

function Floor({ position, isActive, floorNumber }: { position: [number, number, number]; isActive: boolean; floorNumber: number }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (meshRef.current) {
      // Simple pulsing for active floor
      const intensity = isActive ? 1.0 : 0.7;
      (meshRef.current.material as THREE.MeshBasicMaterial).opacity = intensity;
    }
  });

  return (
    <group position={position}>
      {/* Floor platform - simple wireframe */}
      <mesh ref={meshRef} position={[0, 0, 0]}>
        <boxGeometry args={[2.8, 0.02, 2.8]} />
        <meshBasicMaterial
          color={isActive ? "#00ffff" : "#008888"}
          wireframe
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* Floor numbers */}
      <Text
        position={[0, 0.1, 1.3]}
        fontSize={0.55}
        color={isActive ? "#00ffff" : "#00aaaa"}
        anchorX="center"
        anchorY="middle"
      >
        {floorNumber}
      </Text>
      <Text
        position={[1.3, 0.1, 0]}
        rotation={[0, -Math.PI / 2, 0]}
        fontSize={0.55}
        color={isActive ? "#00ffff" : "#00aaaa"}
        anchorX="center"
        anchorY="middle"
      >
        {floorNumber}
      </Text>
    </group>
  );
}

function BuildingStructure() {
  const buildingRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (buildingRef.current) {
      buildingRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.1;
    }
  });

  return (
    <group ref={buildingRef}>
      {/* Building outline using EdgesGeometry - no diagonals */}
      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(3, 4, 3)]} />
        <lineBasicMaterial color="#00aaaa" transparent opacity={0.8} />
      </lineSegments>
    </group>
  );
}

function FuturisticBuilding({ activeFloor, totalFloors }: Building3DProps) {
  const floors = useMemo(() => {
    return Array.from({ length: totalFloors }, (_, i) => {
      const floorNum = i + 1;
      // Position floors evenly within the building height (0 to 4)
      const y = (floorNum - 1) * (4 / (totalFloors - 1)) - 2; // Center around 0
      return {
        position: [0, y, 0] as [number, number, number],
        isActive: floorNum === activeFloor,
        floorNumber: floorNum
      };
    });
  }, [activeFloor, totalFloors]);

  return (
    <div style={{ width: '200px', height: '200px' }}>
      <Canvas camera={{ position: [5, 2, 5], fov: 50 }}>
        {/* Lighting - brighter for wireframe */}
        <ambientLight intensity={1.0} color="#ffffff" />
        <pointLight position={[10, 10, 10]} intensity={2} color="#ffffff" />
        <pointLight position={[-10, -10, -10]} intensity={1} color="#00ffff" />

        {/* Building structure */}
        <BuildingStructure />

        {/* Floors */}
        {floors.map((floor, index) => (
          <Floor
            key={index}
            position={floor.position}
            isActive={floor.isActive}
            floorNumber={floor.floorNumber}
          />
        ))}

        {/* Controls for interaction */}
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 2}
          autoRotate
          autoRotateSpeed={0.5}
        />
      </Canvas>
    </div>
  );
}

export default function Building3D({ activeFloor, totalFloors }: Building3DProps) {
  return (
    <div style={{
      borderRadius: '10px',
      overflow: 'hidden',
      boxShadow: '0 0 30px rgba(0, 255, 255, 0.4)',
      background: 'linear-gradient(135deg, rgba(0, 20, 20, 0.9), rgba(0, 40, 40, 0.7))',
      border: '1px solid rgba(0, 255, 255, 0.3)'
    }}>
      <FuturisticBuilding activeFloor={activeFloor} totalFloors={totalFloors} />
    </div>
  );
}