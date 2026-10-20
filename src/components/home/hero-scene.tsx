'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

const emerald = 0x34d399
const violet = 0x8b5cf6
const amber = 0xf59e0b

/**
 * A deliberately quiet Three.js scene: a wireframe orbital cluster that drifts
 * slowly and leans toward the pointer. It is loaded only on the homepage and
 * pauses when the hero leaves the viewport or the tab is hidden.
 */
export default function HeroScene() {
  const hostRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const host = hostRef.current
    if (!host) return

    let renderer: THREE.WebGLRenderer
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: 'low-power',
      })
    } catch {
      // WebGL is unavailable. The CSS glow behind the hero remains visible.
      return
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75))
    renderer.setClearAlpha(0)
    renderer.domElement.style.cssText = 'display:block;width:100%;height:100%'
    renderer.domElement.setAttribute('aria-hidden', 'true')
    host.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 50)
    camera.position.z = 7.4

    const root = new THREE.Group()
    const shell = new THREE.Group()
    root.add(shell)
    scene.add(root)

    const coreGeometry = new THREE.IcosahedronGeometry(1.75, 1)
    const coreMaterial = new THREE.MeshBasicMaterial({
      color: emerald,
      wireframe: true,
      transparent: true,
      opacity: 0.24,
    })
    const core = new THREE.Mesh(coreGeometry, coreMaterial)
    shell.add(core)

    const outerGeometry = new THREE.IcosahedronGeometry(2.55, 1)
    const outerMaterial = new THREE.MeshBasicMaterial({
      color: violet,
      wireframe: true,
      transparent: true,
      opacity: 0.1,
    })
    const outer = new THREE.Mesh(outerGeometry, outerMaterial)
    outer.rotation.set(0.5, 0.1, 0.35)
    shell.add(outer)

    const accentGeometry = new THREE.IcosahedronGeometry(0.68, 0)
    const accentMaterial = new THREE.MeshBasicMaterial({
      color: amber,
      wireframe: true,
      transparent: true,
      opacity: 0.16,
    })
    const accent = new THREE.Mesh(accentGeometry, accentMaterial)
    accent.rotation.set(0.2, 0.8, 0.4)
    accent.position.set(1.2, -0.65, 0.5)
    shell.add(accent)

    const particleCount = 110
    const positions = new Float32Array(particleCount * 3)
    for (let i = 0; i < particleCount; i += 1) {
      const radius = 3.1 + Math.random() * 2.1
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
      positions[i * 3 + 2] = radius * Math.cos(phi)
    }

    const particleGeometry = new THREE.BufferGeometry()
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    const particleMaterial = new THREE.PointsMaterial({
      color: 0xa78bfa,
      size: 0.035,
      transparent: true,
      opacity: 0.6,
      depthWrite: false,
      sizeAttenuation: true,
    })
    const particles = new THREE.Points(particleGeometry, particleMaterial)
    shell.add(particles)

    const ringGeometry = new THREE.TorusGeometry(2.95, 0.006, 8, 180)
    const ringMaterial = new THREE.MeshBasicMaterial({
      color: emerald,
      transparent: true,
      opacity: 0.14,
    })
    const ring = new THREE.Mesh(ringGeometry, ringMaterial)
    ring.rotation.set(1.24, 0.28, 0)
    root.add(ring)

    const pointer = { x: 0, y: 0 }
    const target = { x: 0, y: 0 }

    const onPointerMove = (event: PointerEvent) => {
      const rect = host.getBoundingClientRect()
      target.x = ((event.clientX - rect.left) / rect.width - 0.5) * 2
      target.y = ((event.clientY - rect.top) / rect.height - 0.5) * 2
    }

    const resize = () => {
      const width = host.clientWidth
      const height = host.clientHeight
      if (!width || !height) return

      renderer.setSize(width, height, false)
      camera.aspect = width / height
      camera.updateProjectionMatrix()

      const fit = Math.min(1, Math.max(0.42, camera.aspect * 1.06))
      root.scale.setScalar(fit)

      if (reduceMotion) renderer.render(scene, camera)
    }

    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(host)
    window.addEventListener('pointermove', onPointerMove, { passive: true })

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    let reduceMotion = motionQuery.matches
    let frame = 0
    let inView = true
    let lastTime = performance.now()

    const renderFrame = (time: number) => {
      frame = requestAnimationFrame(renderFrame)
      const delta = Math.min((time - lastTime) / 1000, 0.05)
      lastTime = time

      pointer.x += (target.x - pointer.x) * Math.min(1, delta * 2.2)
      pointer.y += (target.y - pointer.y) * Math.min(1, delta * 2.2)

      root.rotation.y = pointer.x * 0.14
      root.rotation.x = -pointer.y * 0.1
      shell.rotation.y += delta * 0.08
      core.rotation.x = time * 0.00012
      core.rotation.z = time * 0.00005
      outer.rotation.y = 0.1 + time * 0.00004
      accent.rotation.x = -time * 0.00018
      ring.rotation.z = time * 0.000045

      renderer.render(scene, camera)
    }

    const start = () => {
      if (reduceMotion || frame || !inView || document.hidden) return
      lastTime = performance.now()
      frame = requestAnimationFrame(renderFrame)
    }

    const stop = () => {
      if (frame) cancelAnimationFrame(frame)
      frame = 0
    }

    const onVisibilityChange = () => {
      if (document.hidden) stop()
      else start()
    }

    const onMotionPreferenceChange = () => {
      reduceMotion = motionQuery.matches
      if (reduceMotion) {
        stop()
        renderer.render(scene, camera)
      } else {
        start()
      }
    }

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting
        if (inView) start()
        else stop()
      },
      { threshold: 0.01 }
    )
    intersectionObserver.observe(host)

    document.addEventListener('visibilitychange', onVisibilityChange)
    motionQuery.addEventListener('change', onMotionPreferenceChange)

    resize()
    renderer.render(scene, camera)
    start()

    return () => {
      stop()
      resizeObserver.disconnect()
      intersectionObserver.disconnect()
      document.removeEventListener('visibilitychange', onVisibilityChange)
      motionQuery.removeEventListener('change', onMotionPreferenceChange)
      window.removeEventListener('pointermove', onPointerMove)

      coreGeometry.dispose()
      coreMaterial.dispose()
      outerGeometry.dispose()
      outerMaterial.dispose()
      accentGeometry.dispose()
      accentMaterial.dispose()
      particleGeometry.dispose()
      particleMaterial.dispose()
      ringGeometry.dispose()
      ringMaterial.dispose()
      renderer.dispose()
      renderer.domElement.remove()
    }
  }, [])

  return <div ref={hostRef} className="h-full w-full" aria-hidden="true" />
}
