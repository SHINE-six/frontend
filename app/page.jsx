"use client"

import { useEffect, useState, Suspense } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, Stars, PerspectiveCamera } from "@react-three/drei"
import dynamic from "next/dynamic"
import { GridHelper } from "three"

const Scene = dynamic(() => import("@/components/Scene"), { ssr: false })
const UI = dynamic(() => import("@/components/UI"), { ssr: false })

export default function Portfolio() {
  const [focusedItem, setFocusedItem] = useState(null)
  const [projects, setProjects] = useState([])

  useEffect(() => {
    fetch('/constant.json')
      .then(response => response.json())
      .then(data => setProjects(data.projects))
      .catch(error => console.error("Error : ", error))
  }, [])

  return (
    <div className="w-screen h-screen">
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 0, 18]} fov={60} />
        <Suspense fallback={console.log("Loading...")}>
          <Scene projects={projects} focusedItem={focusedItem} setFocusedItem={setFocusedItem} />
        </Suspense>
        <OrbitControls
          enablePan={false}
          enableZoom={true}
          minDistance={10}
          maxDistance={30}
          enableDamping
          dampingFactor={0.05}
        />
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        {/* <gridHelper args={[100, 100]} /> */}
      </Canvas>
      <UI projects={projects} focusedItem={focusedItem} setFocusedItem={setFocusedItem} />
    </div>
  )
}

