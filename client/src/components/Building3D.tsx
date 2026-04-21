import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useRef, useMemo } from 'react';
import * as THREE from 'three';

interface Building3DProps {
  activeFloor: number;
  totalFloors: number;
}

function Floor({ position, isActive }: { position: [number, number, number]; isActive: boolean }) {
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
        <boxGeometry args={[1.7, 0.1, 1.7]} />
        <meshBasicMaterial
          color={isActive ? '#FBFF00' : '#008888'}
          transparent
          opacity={isActive ? 0.95 : 0.85}
        />
      </mesh>

      {/* Floor numbers */}
      {/* <Text
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
      </Text> */}
    </group>
  );
}

function BuildingStructure() {
  const buildingRef = useRef<THREE.Group>(null);

  // useFrame((state) => {
  //   if (buildingRef.current) {
  //     buildingRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.1;
  //   }
  // });

  return (
    <group ref={buildingRef}>
      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(1.7, 8, 1.7)]} />
        <lineBasicMaterial color="#00aaaa" transparent opacity={0.5} />
      </lineSegments>
    </group>
  );
}

function Lift({ activeFloor, totalFloors }: { activeFloor: number; totalFloors: number }) {
  const liftRef = useRef<THREE.Group>(null);
  const shaftRef = useRef<THREE.LineSegments>(null);

  useFrame(() => {
    if (liftRef.current) {
      const maxOffset = totalFloors > 1 ? 5 / (totalFloors - 1) : 0;
      const targetY = -2.3 + (activeFloor - 1) * maxOffset;
      const currentY = liftRef.current.position.y;
      const delta = targetY - currentY;
      if (Math.abs(delta) < 0.01) {
        liftRef.current.position.y = targetY;
      } else {
        liftRef.current.position.y += delta * 0.1;
      }
    }

    if (shaftRef.current) {
      (shaftRef.current.material as THREE.LineBasicMaterial).opacity = 0.6;
    }
  });

  return (
    <group position={[-0, 0, 0]}>
      <lineSegments ref={shaftRef}>
        <edgesGeometry args={[new THREE.BoxGeometry(0.8, 8, 0.8)]} />
        <lineBasicMaterial color="#00ffff" transparent opacity={0.5} />
      </lineSegments>
      <group ref={liftRef} position={[0, -2, 0]}>
        <mesh>
          <boxGeometry args={[0.75, 0.9, 0.75]} />
          <meshStandardMaterial
            color="#FBFF00"
            emissive="#FBFF00"
            emissiveIntensity={0.2}
            metalness={0.2}
            roughness={0.15}
          />
        </mesh>
        <mesh position={[0, 0, 0.36]}>
          <boxGeometry args={[0.72, 0.7, 0.04]} />
          <meshStandardMaterial color="#001f2f" metalness={0.3} roughness={0.2} />
        </mesh>
        <mesh position={[0, -0.08, 0.42]}>
          <boxGeometry args={[0.3, 0.55, 0.04]} />
          <meshStandardMaterial
            color="#FBFF00"
            emissive="#FBFF00"
            emissiveIntensity={0.25}
            depthWrite={true}
          />
        </mesh>
        <mesh position={[0, 0, -0.38]}>
          <boxGeometry args={[0.7, 0.8, 0.02]} />
          <meshStandardMaterial color="#FBFF00" metalness={0.2} roughness={0.2} />
        </mesh>
      </group>
    </group>
  );
}

function FuturisticBuilding({ activeFloor, totalFloors }: Building3DProps) {
  const floors = useMemo(() => {
    return Array.from({ length: totalFloors }, (_, i) => {
      const floorNum = i + 1;
      // Position floors evenly within the building height (0 to 4)
      const y = (floorNum - 1) * (5 / (totalFloors - 1)) - 4; // Center around 0
      return {
        position: [0, y, 0] as [number, number, number],
        isActive: floorNum === activeFloor + 1,
        floorNumber: floorNum,
      };
    });
  }, [activeFloor, totalFloors]);

  return (
    <div style={{ width: '400px', height: '100%' }}>
      <Canvas camera={{ position: [5, 2, 5], fov: 50 }}>
        {/* Lighting - brighter for wireframe */}
        <ambientLight intensity={1.0} color="#ffffff" />
        <pointLight position={[10, 10, 10]} intensity={2} color="#ffffff" />
        <pointLight position={[-10, -10, -10]} intensity={1} color="#00ffff" />

        {/* Building structure */}
        <group position={[-0, 1, 0]}>
          <BuildingStructure />
          <Lift activeFloor={activeFloor} totalFloors={totalFloors} />

          {/* Floors */}
          {floors.map((floor, index) => (
            <Floor key={index} position={floor.position} isActive={floor.isActive} />
          ))}
        </group>

        {/* Controls for interaction */}
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 2}
          autoRotate
          autoRotateSpeed={1}
        />
      </Canvas>
    </div>
  );
}

export default function Building3D({ activeFloor, totalFloors }: Building3DProps) {
  return (
    <div>
      <FuturisticBuilding activeFloor={activeFloor} totalFloors={totalFloors} />
    </div>
  );
}
