import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useRef, useMemo } from 'react';
import {
  BoxGeometry,
  Group,
  LineBasicMaterial,
  LineSegments,
  Mesh,
  MeshBasicMaterial,
} from 'three';

interface Building3DProps {
  activeFloor: number;
  totalFloors: number;
}

function Floor({ position, isActive }: { position: [number, number, number]; isActive: boolean }) {
  const meshRef = useRef<Mesh>(null);

  useFrame(() => {
    if (meshRef.current) {
      // Simple pulsing for active floor
      const intensity = isActive ? 1.0 : 0.4;
      (meshRef.current.material as MeshBasicMaterial).opacity = intensity;
    }
  });

  return (
    <group position={position}>
      {/* Floor platform - simple wireframe */}
      <mesh ref={meshRef} position={[0, 0, 0]}>
        <boxGeometry args={[1.5, 0.05, 1.5]} />
        <meshBasicMaterial
          color={isActive ? '#ffff00' : '#008888'}
          transparent
          opacity={isActive ? 0.95 : 0.7}
        />
      </mesh>
    </group>
  );
}

function BuildingStructure() {
  const buildingRef = useRef<Group>(null);

  // useFrame((state) => {
  //   if (buildingRef.current) {
  //     buildingRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.1;
  //   }
  // });

  return (
    <group ref={buildingRef}>
      <lineSegments>
        <edgesGeometry args={[new BoxGeometry(1.5, 8, 1.5)]} />
        <lineBasicMaterial color="#00aaaa" transparent opacity={0.5} />
      </lineSegments>
    </group>
  );
}

function Lift({ activeFloor, totalFloors }: { activeFloor: number; totalFloors: number }) {
  const liftRef = useRef<Group>(null);
  const shaftRef = useRef<LineSegments>(null);
  const leftDoorRef = useRef<Mesh>(null);
  const rightDoorRef = useRef<Mesh>(null);

  useFrame(() => {
    let delta = 0;
    if (liftRef.current) {
      const maxOffset = totalFloors > 1 ? 5 / (totalFloors - 1) : 0;
      const targetY = -2.4 + (activeFloor - 1) * maxOffset;
      const currentY = liftRef.current.position.y;
      delta = targetY - currentY;
      if (Math.abs(delta) < 0.01) {
        liftRef.current.position.y = targetY;
      } else {
        liftRef.current.position.y += delta * 0.1;
      }
    }

    if (shaftRef.current) {
      (shaftRef.current.material as LineBasicMaterial).opacity = 0.6;
    }

    const isMoving = Math.abs(delta) > 0.01;
    if (leftDoorRef.current) {
      const targetX = isMoving ? -0.125 : -0.17;
      const currentX = leftDoorRef.current.position.x;
      leftDoorRef.current.position.x += (targetX - currentX) * 0.1;
    }
    if (rightDoorRef.current) {
      const targetX = isMoving ? 0.125 : 0.17;
      const currentX = rightDoorRef.current.position.x;
      rightDoorRef.current.position.x += (targetX - currentX) * 0.1;
    }
  });

  return (
    <group position={[-0, 0, 0]}>
      <lineSegments ref={shaftRef}>
        <edgesGeometry args={[new BoxGeometry(0.5, 8, 0.5)]} />
        <lineBasicMaterial color="#00ffff" transparent opacity={0.5} />
      </lineSegments>
      <group ref={liftRef} position={[0, -2, 0]}>
        {/* Main lift body */}
        <mesh>
          <boxGeometry args={[0.5, 0.7, 0.5]} />
          <meshStandardMaterial
            color="#ffff00"
            emissive="#ffff00"
            emissiveIntensity={1.5}
            metalness={0.2}
            roughness={0.15}
            transparent
            opacity={0.75}
          />
        </mesh>

        {/* Left door */}
        <mesh ref={leftDoorRef} position={[-0.125, 0, 0.26]}>
          <boxGeometry args={[0.12, 0.6, 0.02]} />
          <meshStandardMaterial color="#777777" roughness={0.2} />
        </mesh>

        {/* Right door */}
        <mesh ref={rightDoorRef} position={[0.125, 0, 0.26]}>
          <boxGeometry args={[0.12, 0.6, 0.02]} />
          <meshStandardMaterial color="#777777" roughness={0.2} />
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
    <div style={{ width: '300px', height: '100%' }}>
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
