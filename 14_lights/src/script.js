import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Lights
 */

/* const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
scene.add(ambientLight) */

/* const directionalLight = new THREE.DirectionalLight(0x00fffc, 0.3)
directionalLight.position.set(1, 0.25, 0)
scene.add(directionalLight) */

/* const hemisphereLight = new THREE.HemisphereLight(0xff0000, 0x0000ff, 1)
scene.add(hemisphereLight) */
/* const hlh = new THREE.HemisphereLightHelper(hemisphereLight, 0.2)
scene.add(hlh); */

const pointLight = new THREE.PointLight(0xff9000, 0.5, 6, 4)
pointLight.position.set(1, -0.5, 1)
/* gui.add(pointLight, 'intensity').min(0).max(1).step(0.01);*/
gui.add(pointLight, 'decay').min(0).max(10).step(0.01)
scene.add(pointLight)

const rectLight = new THREE.RectAreaLight('#aa2266', 5, 10, 0.3);
rectLight.position.set(0, 0, 2.5)
scene.add(rectLight)

const spotLight = new THREE.SpotLight(0x78ff00, 1, 10, Math.PI * 0.03, 0.25, 1)
spotLight.position.set(0, 3, 0)


const slh = new THREE.SpotLightHelper(spotLight)
scene.add(slh);
window.requestAnimationFrame(() => slh.update())

/**
 * Objects
 */
// Material
const material = new THREE.MeshStandardMaterial()
material.roughness = 0.2
material.metalness = 0.5

// Objects
const ball = new THREE.Mesh(
    new THREE.SphereGeometry(0.2, 16, 16),
    material
)
ball.position.x = - 2
ball.position.y = - 0.5
ball.material.metalness = 0.2
ball.material.roughness = 0.7
scene.add(ball)
spotLight.lookAt(ball);
scene.add(spotLight)


const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 32),
    material
)
sphere.position.x = - 1.5
sphere.material.metalness = 0.2
sphere.material.roughness = 0.7

const cube = new THREE.Mesh(
    new THREE.BoxGeometry(0.75, 0.75, 0.75),
    material
)

const torus = new THREE.Mesh(
    new THREE.TorusGeometry(0.3, 0.2, 32, 64),
    material
)
torus.position.x = 1.5

const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(5, 5),
    material
)
plane.rotation.x = - Math.PI * 0.5
plane.position.y = - 0.65

scene.add(sphere, cube, torus, plane)


//rectLight.lookAt(torus)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    slh.update()
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

let xMove = 0.01;
let zMove = 0.012;
const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    // Update objects
    sphere.rotation.y = 0.1 * elapsedTime
    cube.rotation.y = 0.1 * elapsedTime
    torus.rotation.y = 0.1 * elapsedTime

    sphere.rotation.x = 0.15 * elapsedTime
    cube.rotation.x = 0.15 * elapsedTime
    torus.rotation.x = 0.15 * elapsedTime

    //move
    ball.position.x += xMove;
    ball.position.z += zMove;
    if (ball.position.x > 2) xMove = -xMove
    if (ball.position.x < - 2) xMove = -xMove
    if (ball.position.z > 2) zMove = -zMove
    if (ball.position.z < - 2) zMove = -zMove
    spotLight.target = ball ;
    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()