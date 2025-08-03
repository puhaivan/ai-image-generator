import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { useRef, useState } from 'react'

function FloatingCube({ position = [0, 1, 0], size = 1, color = '#6366f1' }) {
  const meshRef = useRef()
  const [cubeColor, setCubeColor] = useState(color)

  useFrame((state) => {
    if (!meshRef.current) return
    // Rotate and float
    meshRef.current.rotation.y += 0.01
    meshRef.current.rotation.x += 0.005
    meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 2 + position[0]) * 0.5 + 1
  })

  return (
    <mesh
      ref={meshRef}
      castShadow
      position={position}
      onPointerOver={() => meshRef.current.scale.set(1.2, 1.2, 1.2)}
      onPointerOut={() => meshRef.current.scale.set(1, 1, 1)}
      onClick={() => setCubeColor(cubeColor === '#6366f1' ? '#f59e0b' : '#6366f1')}
    >
      <boxGeometry args={[size, size, size]} />
      <meshStandardMaterial color={cubeColor} />
    </mesh>
  )
}

export default function Interactive3D() {
  return (
    <div className="w-full h-45 mt-8 mb-8">
      <Canvas shadows camera={{ position: [5, 5, 7], fov: 50 }}>
        <ambientLight intensity={0.3} />
        <directionalLight
          position={[5, 10, 5]}
          intensity={1.5}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
          <planeGeometry args={[20, 20]} />
          <shadowMaterial opacity={0.3} />
        </mesh>

        <FloatingCube position={[0, 1, 0]} size={1} color="#6366f1" />
        <FloatingCube position={[2, 1, -1]} size={1.5} color="#22c55e" />
        <FloatingCube position={[-2, 1, 1]} size={0.8} color="#f43f5e" />
        <FloatingCube position={[1.5, 1, 2]} size={1.2} color="#f59e0b" />

        <OrbitControls enableZoom={false} />
      </Canvas>
    </div>
  )
}
