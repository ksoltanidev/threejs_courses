import './style.css'
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const cursor = {x: 0, y: 0}
window.addEventListener('mousemove', (event) => {
    cursor.x = 2*(event.clientX/sizes.width) - 1;
    cursor.y = 2*(event.clientY/sizes.height) -1;
    console.log(cursor);
})


// Canvas
const canvas = document.querySelector('canvas.webgl')

// Sizes


const sizes = {
    width: document.body.clientWidth,
    height: 504
}

// Scene
const scene = new THREE.Scene();

// Object
let material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
material.wireframe = true;
const mesh = new THREE.Mesh( new THREE.BoxGeometry(1, 1, 1, 5, 5, 5), material )
scene.add(mesh)

// Camera
//const aspectRatio = sizes.width / sizes.height;
//const camera = new THREE.OrthographicCamera(-2*aspectRatio, 2*aspectRatio, 2, -2, 0.1, 100)
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
/* camera.position.x = 2
camera.position.y = 2 */
camera.position.z = 3
camera.lookAt(mesh.position)
scene.add(camera)

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)

// Animate
const clock = new THREE.Clock()

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.target.y = 1;

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()


    // Update objects
    mesh.rotation.y = elapsedTime*0.1;
/*  camera.position.x = Math.sin(cursor.x*Math.PI)*3;
    camera.position.z = Math.cos(cursor.x*Math.PI)*3 - Math.sin(cursor.y*Math.PI)*3;
    camera.position.y = Math.sin(cursor.y*Math.PI)*3; 
    camera.lookAt(mesh.position);*/

    // Update controls
    controls.update();

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()