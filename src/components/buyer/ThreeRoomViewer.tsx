'use client'

import { Environment, Html, OrbitControls, useGLTF } from '@react-three/drei'
import { Canvas, useThree } from '@react-three/fiber'
import Image from 'next/image'
import { Suspense, useEffect } from 'react'
import * as THREE from 'three'
import type { RoomSceneHotspot } from '@/types/room'

function SceneBackground() {
  const { scene } = useThree()
  useEffect(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 2
    canvas.height = 256
    const ctx = canvas.getContext('2d')!
    const grad = ctx.createLinearGradient(0, 0, 0, 256)
    grad.addColorStop(0, '#dfd0b8')
    grad.addColorStop(0.5, '#ede0cc')
    grad.addColorStop(1, '#f7f0e6')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, 2, 256)
    const tex = new THREE.CanvasTexture(canvas)
    tex.mapping = THREE.EquirectangularReflectionMapping
    // React Three Fiber exposes the scene object specifically so renderer state can be configured.
    // eslint-disable-next-line react-hooks/immutability
    scene.background = tex
    return () => {
      tex.dispose()
      scene.background = null
    }
  }, [scene])
  return null
}

function RoomModel({ url }: { url: string }) {
  const { scene } = useGLTF(url)

  useEffect(() => {
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh
        mesh.castShadow = true
        mesh.receiveShadow = true
      }
    })
  }, [scene])

  return <primitive object={scene} />
}

function ProductCard({
  hotspot,
  isActive,
  onClick,
}: {
  hotspot: RoomSceneHotspot
  isActive: boolean
  onClick: () => void
}) {
  const x = (hotspot.bounds.x / 100) * 6 - 3
  const y = hotspot.bounds.anchor === 'wall' ? 1.5 : hotspot.bounds.anchor === 'tabletop' ? 1.0 : 0.6
  const z = (hotspot.bounds.y / 100) * -4 + 2

  return (
    <Html position={[x, y, z]} center zIndexRange={[100, 0]}>
      <button
        type="button"
        onClick={onClick}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 0,
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: 0,
        }}
      >
        {/* Product image card */}
        <div
          style={{
            width: 72,
            height: 72,
            position: 'relative',
            borderRadius: 16,
            overflow: 'hidden',
            border: isActive ? '3px solid #c8553d' : '2.5px solid rgba(255,255,255,0.9)',
            boxShadow: isActive
              ? '0 4px 20px rgba(200,85,61,0.45)'
              : '0 4px 16px rgba(44,44,44,0.22)',
            transform: isActive ? 'scale(1.08)' : 'scale(1)',
            transition: 'all 0.15s ease',
            background: '#f3ece3',
          }}
        >
          <Image
            src={hotspot.imageUrl}
            alt={hotspot.name}
            fill
            sizes="72px"
            style={{ objectFit: 'cover', display: 'block' }}
          />
        </div>
        {/* Label pill */}
        <div
          style={{
            marginTop: 5,
            whiteSpace: 'nowrap',
            borderRadius: 999,
            padding: '3px 10px',
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: '0.05em',
            background: isActive ? '#c8553d' : 'rgba(255,255,255,0.92)',
            color: isActive ? '#fff' : '#2c2c2c',
            border: isActive ? '2px solid #c8553d' : '2px solid rgba(255,255,255,0.85)',
            boxShadow: '0 2px 8px rgba(44,44,44,0.15)',
          }}
        >
          {hotspot.label}
        </div>
      </button>
    </Html>
  )
}

interface ThreeRoomViewerProps {
  worldAssetUrl: string
  hotspots: RoomSceneHotspot[]
  activeListingId: string | null
  onHotspotClick: (listingId: string) => void
}

export function ThreeRoomViewer({
  worldAssetUrl,
  hotspots,
  activeListingId,
  onHotspotClick,
}: ThreeRoomViewerProps) {
  return (
    <Canvas
      camera={{ position: [0, 1.6, 3.5], fov: 65 }}
      style={{ width: '100%', height: '100%' }}
      shadows={{ type: THREE.PCFShadowMap }}
      gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.05 }}
    >
      <SceneBackground />

      <ambientLight intensity={0.6} />
      <directionalLight
        position={[4, 8, 4]}
        intensity={1.4}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <directionalLight position={[-4, 4, -2]} intensity={0.4} />
      <pointLight position={[0, 3, 0]} intensity={0.5} color="#fff5e8" />

      <Suspense
        fallback={
          <Html center>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  border: '3px solid #1b5e3f',
                  borderTopColor: 'transparent',
                  animation: 'spin 0.8s linear infinite',
                }}
              />
              <span style={{ fontSize: 12, fontWeight: 600, color: '#1b5e3f' }}>Loading 3D room…</span>
            </div>
          </Html>
        }
      >
        <RoomModel url={worldAssetUrl} />
        <Environment preset="apartment" background={false} />
        {hotspots.map((hotspot) => (
          <ProductCard
            key={hotspot.listingId}
            hotspot={hotspot}
            isActive={hotspot.listingId === activeListingId}
            onClick={() => onHotspotClick(hotspot.listingId)}
          />
        ))}
      </Suspense>

      <OrbitControls
        enablePan={false}
        enableZoom={true}
        enableRotate={true}
        minDistance={1.5}
        maxDistance={8}
        maxPolarAngle={Math.PI / 1.8}
      />
    </Canvas>
  )
}
