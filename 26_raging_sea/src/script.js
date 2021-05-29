import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import waterVertexShader from './shaders/water/vertex.glsl'
import waterFragmenthader from './shaders/water/fragment.glsl'

/**
 * Base
 */
// Debug
const gui = new dat.GUI({ width: 340 })
const debugObject = {}
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Water
 */
// Geometry
const waterGeometry = new THREE.PlaneGeometry(4, 4, 2048, 2048)

// Colors
debugObject.depthColor = '#10430e';
debugObject.surfaceColor = '#66d477'; //66d477

// Material
const waterMaterial = new THREE.ShaderMaterial({
    vertexShader : waterVertexShader,
    fragmentShader : waterFragmenthader,
    uniforms : {
        uTime : { value: 0},
        uBigWavesSpeed : { value: 0.75},
        uBigWavesElevation : {value: 0.2},
        uBigWavesFrequency : {value: new THREE.Vector2(4, 1.5)},
        uDepthColor: { value: new THREE.Color(debugObject.depthColor)},
        uSurfaceColor: { value: new THREE.Color(debugObject.surfaceColor)},
        uColorOffset : {value: 0.35},
        uColorMultiplier : {value: 0.7},
        uSmallWavesElevation: { value: 0.15 },
        uSmallWavesFrequency: { value: 3 },
        uSmallWavesSpeed: { value: 0.2 },
        uSmallIterations: { value: 4 },
    }
})

/**
 * DEBUG
 */
gui.add(waterMaterial.uniforms.uBigWavesElevation, "value").min(0).max(1).step(0.001).name("Big Waves Elevation");
gui.add(waterMaterial.uniforms.uBigWavesFrequency.value, "x").min(1).max(20).step(0.1).name("Big Waves Frequency.X");
gui.add(waterMaterial.uniforms.uBigWavesFrequency.value, "y").min(1).max(20).step(0.1).name("Big Waves Frequency.Z");
gui.add(waterMaterial.uniforms.uBigWavesSpeed, "value").min(0).max(5).step(0.01).name("Big Waves Speed");
gui.addColor(debugObject, "depthColor").name("depht Color").onChange(() => waterMaterial.uniforms.uDepthColor.value.set(debugObject.depthColor));
gui.addColor(debugObject, "surfaceColor").name("surface Color").onChange(() => waterMaterial.uniforms.uSurfaceColor.value.set(debugObject.surfaceColor));
gui.add(waterMaterial.uniforms.uColorOffset, "value").min(0).max(1).step(0.01).name("Color Offset");
gui.add(waterMaterial.uniforms.uColorMultiplier, "value").min(0).max(2).step(0.001).name("Color Multiplier");
gui.add(waterMaterial.uniforms.uSmallWavesElevation, 'value').min(0).max(3).step(0.001).name('Small Waves Elevation')
gui.add(waterMaterial.uniforms.uSmallWavesFrequency, 'value').min(0).max(30).step(0.001).name('Small Waves Frequency')
gui.add(waterMaterial.uniforms.uSmallWavesSpeed, 'value').min(0).max(4).step(0.001).name('Small Waves Speed')
gui.add(waterMaterial.uniforms.uSmallIterations, 'value').min(0).max(5).step(1).name('Small Waves Iterations')


// Mesh
const water = new THREE.Mesh(waterGeometry, waterMaterial)
water.rotation.x = - Math.PI * 0.5
scene.add(water)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(1, 1, 1)
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

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    waterMaterial.uniforms.uTime.value = elapsedTime;
    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()