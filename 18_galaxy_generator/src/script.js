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
 * STARS
 */
 const starsParameters = {
    count : 1000,
    size : 0.01,
    radius : 200,
}

const starsPositions = new Float32Array(starsParameters.count * 3);

for (let i = 0; i < starsParameters.count; i++) {
    const i3 = i * 3
    starsPositions[i3] = (Math.random() - 0.5) * starsParameters.radius
    starsPositions[i3 + 1] = (Math.random() - 0.5) * starsParameters.radius
    starsPositions[i3 + 2] = (Math.random() - 0.5) * starsParameters.radius
}
console.log(starsPositions)

let starsGeometry = new THREE.BufferGeometry();
starsGeometry.setAttribute('position', new THREE.BufferAttribute(starsPositions, 3))

let starsMaterial = new THREE.PointsMaterial({
    size: starsParameters.size,
    sizeAttenuation: true,
    depthWrite: false,
    color: '#ffffff'
})
let stars = new THREE.Points(starsGeometry, starsMaterial)
scene.add(stars)

/**
 * GALAXY GENERATOR
 */
const parameters = {
    count : 100000,
    size : 0.01,
    radius : 5,
    branches : 5,
    spin : 0.3,
    randomness : 0.5,
    randomnessPower : 3,
    insideColor: '#ff6030',
    outsideColor: '#1b3984',
    rotationSpeed : 0.2,
    rotate : false,
    animate : false,
}

let geometry
let material
let galaxy

function generateGalaxy() {
    if (galaxy != null) {
        geometry.dispose();
        material.dispose();
        scene.remove(galaxy);
    }

    geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(parameters.count * 3);
    const colors = new Float32Array(parameters.count * 3)

    const insideColor = new THREE.Color(parameters.insideColor);
    const outsideColor = new THREE.Color(parameters.outsideColor);

    for (let i = 0; i < parameters.count; i++) {
        const i3 = i * 3
        const radius = Math.pow(Math.random(), parameters.randomnessPower) * parameters.radius
        const spinAngle = radius*parameters.spin
        const branchAngle = (i % parameters.branches) / parameters.branches * Math.PI * 2
        
        const randomX = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : - 1) * parameters.randomness * radius
        const randomY = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : - 1) * parameters.randomness * radius
        const randomZ = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : - 1) * parameters.randomness * radius

        positions[i3    ] = Math.cos(branchAngle + spinAngle) * radius + randomX
        positions[i3 + 1] = 0 + randomY
        positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ

        let mixedColor = insideColor.clone();
        mixedColor.lerp(outsideColor, radius/parameters.radius)

        //Colors: 
        colors[i3    ] = mixedColor.r
        colors[i3 + 1] = mixedColor.g
        colors[i3 + 2] = mixedColor.b
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

    material = new THREE.PointsMaterial({
        size: parameters.size,
        sizeAttenuation: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexColors: true,
    })
    galaxy = new THREE.Points(geometry, material)
    scene.add(galaxy)

}
generateGalaxy(parameters);

function UpdateGalaxy(){
    scene.remove()
    generateGalaxy()
}

gui.add(parameters, 'count').min(100).max(100000).step(100).onFinishChange(generateGalaxy)
gui.add(parameters, 'size').min(0.001).max(0.1).step(0.001).onFinishChange(generateGalaxy)
gui.add(parameters, 'radius').min(0.01).max(20).step(0.01).onFinishChange(generateGalaxy)
gui.add(parameters, 'branches').min(2).max(20).step(1).onFinishChange(generateGalaxy)
gui.add(parameters, 'spin').min(-5).max(5).step(0.1).onFinishChange(generateGalaxy)
gui.add(parameters, 'randomness').min(0).max(2).step(0.01).onFinishChange(generateGalaxy)
gui.add(parameters, 'randomnessPower').min(1).max(10).step(0.1).onFinishChange(generateGalaxy)
gui.addColor(parameters, 'insideColor').onFinishChange(generateGalaxy)
gui.addColor(parameters, 'outsideColor').onFinishChange(generateGalaxy)
gui.add(parameters, 'rotationSpeed').min(0).max(10).step(0.01).onFinishChange(generateGalaxy)
gui.add(parameters, 'rotate').onFinishChange(generateGalaxy)
gui.add(parameters, 'animate').onFinishChange(generateGalaxy)

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
camera.position.x = 3
camera.position.y = 3
camera.position.z = 3
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

let randomnessPowerStep = 0.024;
let randomnessStep = - 0.004;
const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    if (parameters.animate){
        parameters.randomnessPower += randomnessPowerStep
        parameters.randomness += randomnessStep
        if (parameters.randomnessPower > 10 || parameters.randomnessPower < 1) {
            randomnessPowerStep = - randomnessPowerStep;
            randomnessStep = - randomnessStep;
        }
    }
    if (parameters.rotate || parameters.animate) generateGalaxy()
    if (parameters.rotate) galaxy.rotation.y = elapsedTime*parameters.rotationSpeed

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()