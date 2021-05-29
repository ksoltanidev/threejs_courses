import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui';

/**
 * DatGUI
 */
 let gui = new dat.GUI();

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
scene.add(ambientLight)

const pointLight = new THREE.PointLight(0xffffff, 0.5)
pointLight.position.x = 2
pointLight.position.y = 3
pointLight.position.z = 4
scene.add(pointLight)

/**
 * Objects
 */
 
 const textureLoader = new THREE.TextureLoader()

 const doorColorTexture = textureLoader.load('/textures/door/color.jpg')
 const doorAlphaTexture = textureLoader.load('/textures/door/alpha.jpg')
 const doorHeightTexture = textureLoader.load('/textures/door/height.jpg')
 const doorNormalTexture = textureLoader.load('/textures/door/normal.jpg')
 const doorAmbientOcclusionTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg')
 const doorMetalnessTexture = textureLoader.load('/textures/door/metalness.jpg')
 const doorRoughnessTexture = textureLoader.load('/textures/door/roughness.jpg')
 
 const matcapsTexture1 = textureLoader.load('/textures/matcaps/1.png')
 const matcapsTexture2 = textureLoader.load('/textures/matcaps/2.png')
 const matcapsTexture3 = textureLoader.load('/textures/matcaps/3.png')
 const matcapsTexture4 = textureLoader.load('/textures/matcaps/4.png')
 const matcapsTexture5 = textureLoader.load('/textures/matcaps/5.png')
 const matcapsTexture6 = textureLoader.load('/textures/matcaps/6.png')
 const matcapsTexture7 = textureLoader.load('/textures/matcaps/7.png')
 const matcapsTexture8 = textureLoader.load('/textures/matcaps/8.png')
 
 const gradientTexture3 = textureLoader.load('/textures/gradients/3.jpg')
 gradientTexture3.minFilter = THREE.NearestFilter
 gradientTexture3.magFilter = THREE.NearestFilter
 gradientTexture3.generateMipmaps = false;
 const gradientTexture5 = textureLoader.load('/textures/gradients/5.jpg')
 gradientTexture5.minFilter = THREE.NearestFilter
 gradientTexture5.magFilter = THREE.NearestFilter
 gradientTexture5.generateMipmaps = false;

 
 const cubeTextureLoader = new THREE.CubeTextureLoader()

 const environmentMapTexture = cubeTextureLoader.load([
     '/textures/environmentMaps/0/px.jpg',
     '/textures/environmentMaps/0/nx.jpg',
     '/textures/environmentMaps/0/py.jpg',
     '/textures/environmentMaps/0/ny.jpg',
     '/textures/environmentMaps/0/pz.jpg',
     '/textures/environmentMaps/0/nz.jpg'
 ])

/* const material = new THREE.MeshBasicMaterial()
material.map = doorColorTexture;
material.transparent = true;
material.alphaMap = doorAlphaTexture; */

/* const material = new THREE.MeshNormalMaterial()
material.flatShading = true; */

//const material = new THREE.MeshDepthMaterial()

/* const material = new THREE.MeshMatcapMaterial() 
material.matcap = matcapsTexture8;*/

//const material = new THREE.MeshLambertMaterial()

/* const material = new THREE.MeshPhongMaterial();
material.shininess = 100;
material.specular = new THREE.Color('#008937') */

/* const material = new THREE.MeshToonMaterial();
material.gradientMap = gradientTexture5; */

const material = new THREE.MeshStandardMaterial();
material.metalness = 0.7;
material.roughness = 0.2;
material.envMap = environmentMapTexture
/* material.aoMap = doorAmbientOcclusionTexture;
material.aoMapIntensity = 1;
material.map = doorColorTexture;
material.displacementMap = doorHeightTexture;
material.displacementScale = 0.1;

material.normalMap = doorNormalTexture;
material.metalnessMap = doorMetalnessTexture;
material.roughnessMap = doorRoughnessTexture;
material.alphaMap = doorAlphaTexture;
material.transparent = true; */

gui.add(material, "metalness", 0, 1, 0.01)
gui.add(material, "roughness", 0, 1, 0.01)
/* gui.add(material, "aoMapIntensity", 0, 10, 0.01)
gui.add(material, "displacementScale", 0, 1, 0.01) */

const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 64, 64),
    material
)
sphere.position.x = - 1.5
sphere.geometry.setAttribute('uv2', new THREE.BufferAttribute(sphere.geometry.attributes.uv.array, 2))

const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 1, 100, 100),
    material
)

plane.geometry.setAttribute('uv2', new THREE.BufferAttribute(plane.geometry.attributes.uv.array, 2))

const torus = new THREE.Mesh(
    new THREE.TorusGeometry(0.35, 0.15, 64, 128),
    material
)
torus.position.x = 1.5
torus.geometry.setAttribute('uv2', new THREE.BufferAttribute(torus.geometry.attributes.uv.array, 2))

scene.add(sphere, plane, torus)

const plane2 = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10, 100, 100),
    material
)
plane2.geometry.setAttribute('uv2', new THREE.BufferAttribute(plane2.geometry.attributes.uv.array, 2))

plane2.rotation.x = 3*Math.PI/2
plane2.position.y = -1
scene.add(plane2)

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
camera.position.x = 0
camera.position.y = 0
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

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    // Update objects
    sphere.rotation.y = 0.1 * elapsedTime
    plane.rotation.y = 0.1 * elapsedTime
    torus.rotation.y = 0.1 * elapsedTime

    sphere.rotation.x = 0.15 * elapsedTime
    plane.rotation.x = 0.15 * elapsedTime
    torus.rotation.x = 0.15 * elapsedTime

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
