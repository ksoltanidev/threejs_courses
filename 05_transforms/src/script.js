import './style.css'
import * as THREE from 'three'

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Objects
 */
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
const cube1 = new THREE.Mesh(geometry, material)
cube1.position.x = 1;
cube1.position.y = 1;
cube1.scale.set(2, 0.5, 0.5);

const cube2 = new THREE.Mesh(
    new THREE.BoxGeometry(1,1,1),
    new THREE.MeshBasicMaterial({color: "green"})
)
cube2.position.set(-1, 1, -1);

const cube3 = new THREE.Mesh(
    new THREE.BoxGeometry(1,1,1),
    new THREE.MeshBasicMaterial({color: "blue"})
)
cube3.position.set(1, 0, 0);


//Group
const group = new THREE.Group();
group.add(cube1);
group.add(cube2);
group.add(cube3);
scene.add(group);


//Axes Helper
const axesHelper = new THREE.AxesHelper(2);
scene.add(axesHelper)
/**
 * Sizes
 */
const sizes = {
    width: 800,
    height: 600
}

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.set(1, 0.3, 3);
camera.lookAt(group.position);
scene.add(camera)

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.render(scene, camera)