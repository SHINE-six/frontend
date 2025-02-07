import { useThree, useFrame } from "@react-three/fiber"
import { EffectComposer, Bloom } from "@react-three/postprocessing"
import CentralHub from "./CentralHub.jsx"
import PortfolioSpheres from "./PortfolioSpheres.jsx"
import ContactSatellite from "./ContactSatellite.jsx"
import BlogArchive from "./BlogArchive.jsx"
import { useEffect, useRef, useState } from "react"
import { Vector3 } from "three"

export default function Scene({ focusedItem, setFocusedItem }) {
  const { camera } = useThree()
  const defaultCameraPosition = useRef(camera.position.clone())
  const defaultLookAt = useRef(new Vector3(0, 0, 0))
  const targetPosition = useRef(defaultCameraPosition.current.clone())
  const targetLookAt = useRef(new Vector3(0, 0, 0))

  const [isTransitioning, setIsTransitioning] = useState(false)

  // Update the camera position based on the focusedItem
  // useEffect(() => {
  //   if (focusedItem) {
  //     setIsTransitioning(true)
  //     const itemPosition = focusedItem.getWorldPosition(new Vector3())
  //     targetPosition.current.set(itemPosition.x, itemPosition.y + 2, itemPosition.z + 3)
  //     targetLookAt.current.copy(itemPosition)
  //   } else {
  //     setIsTransitioning(true)
  //     targetPosition.current.copy(defaultCameraPosition.current)
  //     targetLookAt.current.copy(defaultLookAt.current)
  //   }
  // }, [focusedItem])

  useFrame(() => {
    if (!focusedItem) return
    // if (!focusedItem || !isTransitioning) return

    // const positionDistance = camera.position.distanceTo(targetPosition.current)
    let itemPosition
    itemPosition = focusedItem.getWorldPosition(new Vector3())
    camera.lookAt(itemPosition)
    itemPosition.y += 2
    itemPosition.z += 3
    camera.position.lerp(itemPosition, 0.05)
    // camera.lookAt(targetLookAt.current.lerp(targetLookAt.current, 0.05))

    // if (positionDistance < 0.1) {
    //   setIsTransitioning(false)
    // }
  })

  return (
    <>
      <color attach="background" args={["#000008"]} />
      {/* <fog attach="fog" args={["#0000f8", 20, 40]} /> */}
      <ambientLight intensity={5} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#48a2ff" />
      <CentralHub setFocusedItem={setFocusedItem} />
      <PortfolioSpheres count={4} setFocusedItem={setFocusedItem} />
      <ContactSatellite position={[8, 4, 0]} setFocusedItem={setFocusedItem} />
      <BlogArchive position={[-8, -4, 0]} setFocusedItem={setFocusedItem} />
      <EffectComposer>
        {/* Bloom is a post-processing effect that adds a glow to bright areas */}
        <Bloom luminanceThreshold={0.2} luminanceSmoothing={0.9} height={200} layers={1}/>
      </EffectComposer>
    </>
  )
}

