import './style.css'
import * as THREE from 'three'
import { Mesh } from 'three'
import gsap from 'gsap';

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Object
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
const cube = new THREE.Mesh(geometry, material)
scene.add(cube)

// Sizes
const sizes = {
    width: 800,
    height: 600
}

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.z = 3
scene.add(camera)

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.render(scene, camera)

/**
 * Animate
 */
/* let previousTime = Date.now();
//
const elapsedTime = clock.getElapsedTime();
function tick() {
    const now = Date.now();
    const deltaTime = now - previousTime;
    previousTime = now;
    cube.rotation.x = cube.rotation.x + 0.001 * deltaTime;
    cube.rotation.y = cube.rotation.y + 0.001 * deltaTime;
    renderer.render(scene, camera);
    window.requestAnimationFrame(tick);
} */

gsap.to(cube.position, {duration: 1, x : 2});
function tick() {
    
    renderer.render(scene, camera);
    window.requestAnimationFrame(tick);
}

tick();
