import { useThree, useFrame } from "@react-three/fiber"
import { EffectComposer, Bloom } from "@react-three/postprocessing"
import CentralHub from "./CentralHub.jsx"
import PortfolioSpheres from "./PortfolioSpheres.jsx"
import ContactSatellite from "./ContactSatellite.jsx"
import BlogArchive from "./BlogArchive.jsx"
import { useEffect, useRef, useState } from "react"
import { Vector3 } from "three"

export default function Scene({ projects, focusedItem, setFocusedItem }) {
  const { camera } = useThree()


  useFrame(() => {
    if (!focusedItem) {
      // camera.position.lerp(new Vector3(0, 0, 18), 0.05)
      return
    }

    let itemPosition
    itemPosition = focusedItem.getWorldPosition(new Vector3())
    camera.lookAt(itemPosition)
    itemPosition.y += 2
    itemPosition.z += 3
    camera.position.lerp(itemPosition, 0.05)
  })

  return (
    <>
      <color attach="background" args={["#000008"]} />
      {/* <fog attach="fog" args={["#0000f8", 20, 40]} /> */}
      <ambientLight intensity={5} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#48a2ff" />
      <CentralHub setFocusedItem={setFocusedItem} />
      <PortfolioSpheres projects={projects} setFocusedItem={setFocusedItem} />
      <ContactSatellite position={[8, 4, 0]} setFocusedItem={setFocusedItem} />
      <BlogArchive position={[-8, -4, 0]} setFocusedItem={setFocusedItem} />
      <EffectComposer>
        {/* Bloom is a post-processing effect that adds a glow to bright areas */}
        <Bloom luminanceThreshold={0.2} luminanceSmoothing={0.9} height={200} layers={1}/>
      </EffectComposer>
    </>
  )
}

