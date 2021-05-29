import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import { SpotLight } from 'three'

/**
 * Sizes
 */
 const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

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
// Ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.4)
gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001)
scene.add(ambientLight)

const spotLight = new THREE.SpotLight(0xffffff, 0.4, 10, Math.PI*0.2)
spotLight.castShadow = true;
spotLight.position.set(0, 2 ,2);

spotLight.shadow.mapSize.width = 1024;
spotLight.shadow.mapSize.height = 1024;
spotLight.shadow.camera.fov = 30;
spotLight.shadow.camera.near = 1;
spotLight.shadow.camera.far = 6;

scene.add(spotLight);
scene.add(spotLight.target);

const spotLightCameraHelper = new THREE.CameraHelper(spotLight.shadow.camera);
spotLightCameraHelper.visible = false;
scene.add(spotLightCameraHelper);

const pointLight = new THREE.PointLight(0xffffff, 0.2);
pointLight.castShadow = true;
pointLight.shadow.mapSize.width = 1024
pointLight.shadow.mapSize.height = 1024
pointLight.shadow.camera.far = 5;
pointLight.shadow.camera.near = 0.1;


pointLight.position.set(-1, 1, 0);

const pointLightHelper = new THREE.CameraHelper(pointLight.shadow.camera);
scene.add(pointLight);
scene.add(pointLightHelper);

// Directional light
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.3)
directionalLight.position.set(2, 2, - 1)
gui.add(directionalLight, 'intensity').min(0).max(1).step(0.001)
gui.add(directionalLight.position, 'x').min(- 5).max(5).step(0.001)
gui.add(directionalLight.position, 'y').min(- 5).max(5).step(0.001)
gui.add(directionalLight.position, 'z').min(- 5).max(5).step(0.001)
directionalLight.castShadow = true
scene.add(directionalLight)
directionalLight.shadow.mapSize.width = sizes.width;
directionalLight.shadow.mapSize.height = sizes.height;
directionalLight.shadow.camera.near = 1;
directionalLight.shadow.camera.far = 6;
directionalLight.shadow.camera.top = 2;
directionalLight.shadow.camera.bottom = -2;
directionalLight.shadow.camera.left = -2;
directionalLight.shadow.camera.right = 2;
directionalLight.shadow.radius = 5; // don't work with THREE.PCFSoftShadowMap

const directionalLightCameratHelp = new THREE.CameraHelper(directionalLight.shadow.camera)
directionalLightCameratHelp.visible = false;
scene.add(directionalLightCameratHelp);

const directionalLightHelp = new THREE.DirectionalLightHelper(directionalLight, 0.2)
scene.add(directionalLightHelp);
/**
 * Materials
 */
const material = new THREE.MeshStandardMaterial()
material.roughness = 0.7
gui.add(material, 'metalness').min(0).max(1).step(0.001)
gui.add(material, 'roughness').min(0).max(1).step(0.001)

/**
 * Objects
 */
const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 32),
    material
)
sphere.castShadow = true

const textureLoader = new THREE.TextureLoader();
const bakedShadow = textureLoader.load('./textures/bakedShadow.jpg')
const simpleShadow = textureLoader.load('./textures/simpleShadow.jpg')

const groundMaterial = new THREE.MeshBasicMaterial({map: bakedShadow});

const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(5, 5),
    material
)
plane.rotation.x = - Math.PI * 0.5
plane.position.y = - 0.5
plane.receiveShadow = true

const simpleShadowMaterial = new THREE.MeshBasicMaterial({
    color: 0x000000,
    alphaMap: simpleShadow,
    transparent : true,
});
//const simpleShadowMaterial = new THREE.MeshBasicMaterial({color: 0xff0000});

const shadowPlane = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 1),
    simpleShadowMaterial
)
shadowPlane.rotation.x = - Math.PI * 0.5
shadowPlane.position.y = plane.position.y + 0.01
shadowPlane.receiveShadow = true


scene.add(sphere, plane, shadowPlane)

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
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.shadowMap.enabled = false
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    sphere.position.x = Math.cos(clock.elapsedTime*1.5)
    sphere.position.z = Math.sin(clock.elapsedTime*1.5)
    sphere.position.y = Math.abs(Math.sin(clock.elapsedTime*3))
    shadowPlane.position.x = sphere.position.x;
    shadowPlane.position.z = sphere.position.z;
    
    let sinus = Math.abs(Math.sin(clock.elapsedTime*3));
    shadowPlane.material.opacity = 1 - sinus*0.8;
    shadowPlane.scale.x = 1 - sinus*0.3;
    shadowPlane.scale.y = 1 - sinus*0.3;


    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()