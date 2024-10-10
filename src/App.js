const monthlypushups = {
  1: 100,
  2: 100,
  3: 100,
  4: 100,
  5: 110,
  6: 100,
  7: 100,
  8: 100,
  9: 100,
  10: 80,
}

// Add up values in monthlypushups
const totalPushUps = Object.values(monthlypushups).reduce((sum, value) => sum + value, 0)

// currentDay = get last key in object
const currentDay = Object.keys(monthlypushups).reduce((sum, value) => value, 0)
const date = new Date()
const pushUpsToday = monthlypushups[date.getDate()] || 0
// const pushUpsToday = currentDay == date.getDate() ? mostRecentPushups : 0

import * as THREE from 'three'
import { useRef, useReducer, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF, MeshTransmissionMaterial, Environment, Lightformer } from '@react-three/drei'
import { CuboidCollider, BallCollider, Physics, RigidBody } from '@react-three/rapier'
import { EffectComposer, N8AO } from '@react-three/postprocessing'
import { easing } from 'maath'

const scaledTotal = totalPushUps / 10

const accents = ['rgb(69,154,231)', 'rgba(0,0,121)']
const colours = ['rgb(230, 0, 121)', '#fff']
const boxSize = 1.4
// const shuffle = (accent = 0) => [
//   { color: '#444', roughness: 0.1 },
//   { color: '#444', roughness: 0.075 },
//   { color: '#444', roughness: 0.175 },
//   { color: 'white', roughness: 0.1 },
//   { color: 'white', roughness: 0.15 },
//   { color: 'white', roughness: 0.1 },
//   { color: accents[accent], roughness: 0.1, accent: true },
//   { color: accents[accent], roughness: 0.175, accent: true }
// ]

const shuffle = (accent = 0) => {
  let shapeArray = []
  for (let i = 0; i < scaledTotal; i++) {
    let ran = Math.floor(Math.random() * 4)
    if (ran < 3) {
      shapeArray.push({
        color: colours[Math.floor(Math.random() * colours.length)],
        roughness: Math.random() * 1
      })
    } else {
      shapeArray.push({
        color: accents[accent],
        roughness: Math.random() * 1,
        accent: true
      })
    }
  }
  return shapeArray
}

export const App = () => (
  <main>
    <div className="container">
      <div className="nav">
        <img height="40" src="https://rcl.assets.cancerresearchuk.org/images/logos/cruk.svg" />
        {/* <h1 className="label" /> */}
        <div />
        <span className="caption" />
        <div />
        <a href="https://fundraise.cancerresearchuk.org/page/alistairs-100-pushups">
          <div className="button">DONATE</div>
        </a>
        {/* <div className="button gray">///</div> */}
      </div>
      <div className="scene-container">
        <div className="scene-inner">
          <div className="total">
            <span className="total-number">{totalPushUps}</span>
            <br />
            push-ups in October
            {pushUpsToday > 0 && (
              <div>
                <span className="today">
                  day {date.getDate()}: {pushUpsToday}/100
                </span>
              </div>
            )}
            <br />
            <span className="about-cubes">1 cube = 10 pushups</span>
          </div>
          <Scene />
        </div>
      </div>
    </div>
    <section className="container text-container">
      <div>
        <p>
          <a href="https://fundraise.cancerresearchuk.org/page/alistairs-100-pushups">
            Hi i'm Alistair McClymont and I’m doing 100 push ups every day this October to help raise money for Cancer Research UK. Please show your support and
            help fund life-saving research by donating to my page.
          </a>
        </p>
        <p>
          Today i've done{' '}
          <strong>
            <em>{pushUpsToday}/100</em>
          </strong>{' '}
          push-ups, so far in October I have done{' '}
          <strong>
            <em>{totalPushUps}</em>
          </strong>{' '}
          push-ups. Every box above represents 10 push-ups, i'll be doing push-ups in blocks of 10 each day, if you check back on this page you will see the
          number of boxes grow.
        </p>
        <p>
          <a href="https://fundraise.cancerresearchuk.org/page/alistairs-100-pushups">Please donate if you can, all money goes to Cancer Research UK</a>.
        </p>
        <p>
          There is no amount too small - even £1 makes a difference, however if you want to give me a penny a push-up that would be 3100p or £31 by the end of
          the month!
        </p>
      </div>
    </section>
    {/* <section className="container text-container footer">
      <div>
        <h2>about me</h2>
        <p>
          I'm an <a href="https://alistairmcclymont.com">artist</a> and <a href="https://amcc.io">coder</a> from the UK. 
        </p>
      </div>
    </section> */}
  </main>
)

function Scene(props) {
  const [accent, click] = useReducer((state) => ++state % accents.length, 0)
  const connectors = useMemo(() => shuffle(accent), [accent])
  return (
    <Canvas onClick={click} shadows dpr={[1, 1.5]} gl={{ antialias: false }} camera={{ position: [0, 0, 50], fov: 17.5, near: 1, far: 100 }} {...props}>
      <color attach="background" args={['#fff']} />
      <ambientLight intensity={0.4} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
      <Physics gravity={[0, 0, 0]}>
        <Pointer />
        {connectors.map((props, i) => <Connector key={i} {...props} />) /* prettier-ignore */}
        {/* <Connector position={[5, 5, 5]}>
          <Model>
            <MeshTransmissionMaterial clearcoat={1} thickness={0.1} anisotropicBlur={0.1} chromaticAberration={0.1} samples={8} resolution={512} />
          </Model>
        </Connector> */}
      </Physics>
      <EffectComposer disableNormalPass multisampling={8}>
        <N8AO distanceFalloff={1} aoRadius={1} intensity={4} />
      </EffectComposer>
      <Environment resolution={256}>
        {/* <group rotation={[-Math.PI / 3, 0, 1]}> */}
        <group>
          <Lightformer form="circle" intensity={4} rotation-x={Math.PI / 2} position={[0, 5, -9]} scale={2} />
          <Lightformer form="circle" intensity={2} rotation-y={Math.PI / 2} position={[-5, 1, -1]} scale={2} />
          <Lightformer form="circle" intensity={2} rotation-y={Math.PI / 2} position={[-5, -1, -1]} scale={2} />
          <Lightformer form="circle" intensity={2} rotation-y={-Math.PI / 2} position={[10, 1, 0]} scale={8} />
        </group>
      </Environment>
    </Canvas>
  )
}

function Connector({ position, children, vec = new THREE.Vector3(), scale, r = THREE.MathUtils.randFloatSpread, accent, ...props }) {
  const api = useRef()
  const pos = useMemo(() => position || [r(10), r(10), r(10)], [])
  useFrame((state, delta) => {
    delta = Math.min(0.1, delta)
    api.current?.applyImpulse(vec.copy(api.current.translation()).negate().multiplyScalar(0.2))
  })
  return (
    <RigidBody linearDamping={0.5} angularDamping={0.5} friction={0.01} position={pos} ref={api} colliders={false}>
      <CuboidCollider args={[boxSize / 2, boxSize / 2, boxSize / 2]} />
      {children ? children : <Model {...props} />}
      {/* {accent && <pointLight intensity={4} distance={2.5} color={props.color} />} */}
    </RigidBody>
  )
}

function Pointer({ vec = new THREE.Vector3() }) {
  const ref = useRef()
  useFrame(({ mouse, viewport }) => {
    ref.current?.setNextKinematicTranslation(vec.set((mouse.x * viewport.width) / 2, (mouse.y * viewport.height) / 2, 0))
  })
  return (
    <RigidBody position={[0, 0, 0]} type="kinematicPosition" colliders={false} ref={ref}>
      <BallCollider args={[1]} />
    </RigidBody>
  )
}

function Model({ children, color = 'white', roughness = 0, ...props }) {
  const ref = useRef()
  // const { nodes, materials } = useGLTF('/c-transformed.glb')
  useFrame((state, delta) => {
    easing.dampC(ref.current.material.color, color, 0.2, delta)
  })
  return (
    // <mesh ref={ref} castShadow receiveShadow scale={10} geometry={nodes.connector.geometry}>
    //   <meshStandardMaterial metalness={0.2} roughness={roughness} map={materials.base.map} />
    //   {children}
    // </mesh>
    <mesh ref={ref} scale={1}>
      <boxGeometry attach="geometry" args={[boxSize, boxSize, boxSize]} />

      {/* <MeshTransmissionMaterial clearcoat={1} thickness={0.1} anisotropicBlur={0.1} chromaticAberration={0.1} samples={8} resolution={512} /> */}

      <meshStandardMaterial attach="material" color="#6be092" />
      {children}
    </mesh>
  )
}
