'use client'

import { Html, OrbitControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import * as THREE from 'three'
import type { RoomSceneHotspot, RoomSceneData } from '@/types/room'

// Room dimensions
const ROOM_W = 7
const ROOM_D = 6
const ROOM_H = 3.2

function RoomShell({ palette }: { palette: RoomSceneData['palette'] }) {
  const wallMat = new THREE.MeshStandardMaterial({ color: palette.wall, roughness: 0.85, metalness: 0 })
  const floorMat = new THREE.MeshStandardMaterial({ color: palette.floor, roughness: 0.9, metalness: 0.05 })
  const ceilMat = new THREE.MeshStandardMaterial({ color: '#f5ede0', roughness: 1 })

  return (
    <group>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[ROOM_W, ROOM_D]} />
        <primitive object={floorMat} attach="material" />
      </mesh>
      {/* Ceiling */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, ROOM_H, 0]}>
        <planeGeometry args={[ROOM_W, ROOM_D]} />
        <primitive object={ceilMat} attach="material" />
      </mesh>
      {/* Back wall */}
      <mesh position={[0, ROOM_H / 2, -ROOM_D / 2]} receiveShadow>
        <planeGeometry args={[ROOM_W, ROOM_H]} />
        <primitive object={wallMat} attach="material" />
      </mesh>
      {/* Left wall */}
      <mesh rotation={[0, Math.PI / 2, 0]} position={[-ROOM_W / 2, ROOM_H / 2, 0]}>
        <planeGeometry args={[ROOM_D, ROOM_H]} />
        <primitive object={wallMat} attach="material" />
      </mesh>
      {/* Right wall */}
      <mesh rotation={[0, -Math.PI / 2, 0]} position={[ROOM_W / 2, ROOM_H / 2, 0]}>
        <planeGeometry args={[ROOM_D, ROOM_H]} />
        <primitive object={wallMat} attach="material" />
      </mesh>
    </group>
  )
}

function BaseBoardTrim() {
  const mat = new THREE.MeshStandardMaterial({ color: '#f0e8db', roughness: 0.6 })
  const h = 0.12
  return (
    <group>
      <mesh position={[0, h / 2, -ROOM_D / 2 + 0.01]}>
        <boxGeometry args={[ROOM_W, h, 0.04]} />
        <primitive object={mat} attach="material" />
      </mesh>
      <mesh position={[-ROOM_W / 2 + 0.01, h / 2, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[ROOM_D, h, 0.04]} />
        <primitive object={mat} attach="material" />
      </mesh>
      <mesh position={[ROOM_W / 2 - 0.01, h / 2, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <boxGeometry args={[ROOM_D, h, 0.04]} />
        <primitive object={mat} attach="material" />
      </mesh>
    </group>
  )
}

function FloorItem({ x, z, accent }: { x: number; z: number; accent: string }) {
  const mat = new THREE.MeshStandardMaterial({ color: accent, roughness: 0.7, metalness: 0.05 })
  const legMat = new THREE.MeshStandardMaterial({ color: '#5a3e2b', roughness: 0.9 })
  return (
    <group position={[x, 0, z]}>
      {/* Seat */}
      <mesh position={[0, 0.44, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.1, 0.18, 0.75]} />
        <primitive object={mat} attach="material" />
      </mesh>
      {/* Back cushion */}
      <mesh position={[0, 0.78, -0.3]} castShadow>
        <boxGeometry args={[1.0, 0.6, 0.14]} />
        <primitive object={mat} attach="material" />
      </mesh>
      {/* Legs */}
      {[[-0.45, -0.32], [0.45, -0.32], [-0.45, 0.32], [0.45, 0.32]].map(([lx, lz], i) => (
        <mesh key={i} position={[lx, 0.18, lz]} castShadow>
          <cylinderGeometry args={[0.03, 0.03, 0.36, 8]} />
          <primitive object={legMat} attach="material" />
        </mesh>
      ))}
    </group>
  )
}

function WallDecor({ x, y, accent }: { x: number; y: number; accent: string }) {
  const frameMat = new THREE.MeshStandardMaterial({ color: '#3d2b1a', roughness: 0.6 })
  const artMat = new THREE.MeshStandardMaterial({ color: accent, roughness: 0.85, emissive: accent, emissiveIntensity: 0.08 })
  return (
    <group position={[x, y, -ROOM_D / 2 + 0.04]}>
      {/* Frame */}
      <mesh>
        <boxGeometry args={[0.76, 0.56, 0.06]} />
        <primitive object={frameMat} attach="material" />
      </mesh>
      {/* Art panel */}
      <mesh position={[0, 0, 0.04]}>
        <boxGeometry args={[0.64, 0.44, 0.02]} />
        <primitive object={artMat} attach="material" />
      </mesh>
    </group>
  )
}

function TabletopItem({ x, z, accent }: { x: number; z: number; accent: string }) {
  const tableMat = new THREE.MeshStandardMaterial({ color: '#7a5c3a', roughness: 0.75 })
  const itemMat = new THREE.MeshStandardMaterial({ color: accent, roughness: 0.5, metalness: 0.1 })
  return (
    <group position={[x, 0, z]}>
      {/* Table top */}
      <mesh position={[0, 0.72, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.8, 0.05, 0.5]} />
        <primitive object={tableMat} attach="material" />
      </mesh>
      {/* Table legs */}
      {[[-0.34, -0.2], [0.34, -0.2], [-0.34, 0.2], [0.34, 0.2]].map(([lx, lz], i) => (
        <mesh key={i} position={[lx, 0.35, lz]} castShadow>
          <boxGeometry args={[0.05, 0.7, 0.05]} />
          <primitive object={tableMat} attach="material" />
        </mesh>
      ))}
      {/* Item on table */}
      <mesh position={[0, 0.88, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.1, 0.28, 12]} />
        <primitive object={itemMat} attach="material" />
      </mesh>
    </group>
  )
}

function hotspotTo3D(hotspot: RoomSceneHotspot): [number, number, number] {
  // x: 0–100% → -2.5 to 2.5
  const x = (hotspot.bounds.x / 100) * ROOM_W - ROOM_W / 2 + (hotspot.bounds.width / 100) * ROOM_W * 0.5
  if (hotspot.bounds.anchor === 'wall') {
    // y: 0–100% → wall height, low % = high on wall
    const wallY = ROOM_H - (hotspot.bounds.y / 100) * ROOM_H * 1.1
    return [x, Math.max(0.8, Math.min(ROOM_H - 0.4, wallY)), -ROOM_D / 2 + 0.5]
  }
  if (hotspot.bounds.anchor === 'tabletop') {
    const z = (hotspot.bounds.y / 100) * ROOM_D - ROOM_D / 2
    return [x, 0, z * 0.7]
  }
  // floor
  const z = (hotspot.bounds.y / 100) * ROOM_D - ROOM_D / 2
  return [x, 0, z * 0.7]
}

function HotspotPin({
  hotspot,
  isActive,
  onClick,
}: {
  hotspot: RoomSceneHotspot
  isActive: boolean
  onClick: () => void
}) {
  const pos = hotspotTo3D(hotspot)
  const labelY = hotspot.bounds.anchor === 'wall' ? pos[1] + 0.5 : 1.5

  return (
    <Html
      position={[pos[0], labelY, pos[2]]}
      center
      zIndexRange={[200, 0]}
      distanceFactor={6}
    >
      <button
        type="button"
        onClick={onClick}
        style={{
          whiteSpace: 'nowrap',
          borderRadius: '999px',
          padding: '6px 14px',
          fontSize: '11px',
          fontWeight: 700,
          letterSpacing: '0.08em',
          border: isActive ? '2px solid #c8553d' : '2px solid rgba(255,255,255,0.9)',
          background: isActive ? '#c8553d' : 'rgba(255,255,255,0.92)',
          color: isActive ? '#fff' : '#2c2c2c',
          boxShadow: '0 4px 16px rgba(44,44,44,0.18)',
          cursor: 'pointer',
          transform: isActive ? 'scale(1.08)' : 'scale(1)',
          transition: 'all 0.15s ease',
        }}
      >
        {hotspot.label}
      </button>
    </Html>
  )
}

function Furniture({ hotspots, accent }: { hotspots: RoomSceneHotspot[]; accent: string }) {
  return (
    <>
      {hotspots.map((hotspot) => {
        const [x, , z] = hotspotTo3D(hotspot)
        if (hotspot.bounds.anchor === 'wall') {
          const [wx, wy] = [x, hotspotTo3D(hotspot)[1] - 0.1]
          return <WallDecor key={hotspot.listingId} x={wx} y={wy} accent={accent} />
        }
        if (hotspot.bounds.anchor === 'tabletop') {
          return <TabletopItem key={hotspot.listingId} x={x} z={z} accent={accent} />
        }
        return <FloorItem key={hotspot.listingId} x={x} z={z} accent={accent} />
      })}
    </>
  )
}

interface ProceduralRoomSceneProps {
  scene: RoomSceneData
  activeListingId: string | null
  onHotspotClick: (listingId: string) => void
}

export function ProceduralRoomScene({ scene, activeListingId, onHotspotClick }: ProceduralRoomSceneProps) {
  return (
    <Canvas
      camera={{ position: [0, 1.6, 3.2], fov: 70 }}
      style={{ width: '100%', height: '100%' }}
      shadows={{ type: THREE.PCFShadowMap }}
      gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.1 }}
    >
      <ambientLight intensity={0.55} />
      <directionalLight
        position={[2, 6, 3]}
        intensity={1.4}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <pointLight position={[0, 2.8, -1]} intensity={0.6} color="#fff5e8" />

      <RoomShell palette={scene.palette} />
      <BaseBoardTrim />
      <Furniture hotspots={scene.hotspots} accent={scene.palette.accent} />

      {scene.hotspots.map((hotspot) => (
        <HotspotPin
          key={hotspot.listingId}
          hotspot={hotspot}
          isActive={hotspot.listingId === activeListingId}
          onClick={() => onHotspotClick(hotspot.listingId)}
        />
      ))}

      <OrbitControls
        target={[0, 1.2, -1]}
        enablePan={false}
        enableZoom={true}
        minDistance={1.5}
        maxDistance={5.5}
        minPolarAngle={0.3}
        maxPolarAngle={Math.PI / 2}
      />
    </Canvas>
  )
}
