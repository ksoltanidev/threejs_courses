import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import *  as CANNON from 'cannon-es'

/**
 * Debug
 */
const gui = new dat.GUI()

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * SOUNDS
 */

const hitSound = new Audio('/sounds/hit.mp3')

const playSound = (collision) =>
{
    const impactStrength = collision.contact.getImpactVelocityAlongNormal()

    if(impactStrength > 1.5)
    {
        hitSound.volume = Math.random()
        hitSound.currentTime = 0
        hitSound.play()
    }
}

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const cubeTextureLoader = new THREE.CubeTextureLoader()

const environmentMapTexture = cubeTextureLoader.load([
    '/textures/environmentMaps/0/px.png',
    '/textures/environmentMaps/0/nx.png',
    '/textures/environmentMaps/0/py.png',
    '/textures/environmentMaps/0/ny.png',
    '/textures/environmentMaps/0/pz.png',
    '/textures/environmentMaps/0/nz.png'
])

/**
 * PHYSICS
 */

const physicsWorld = new CANNON.World();
physicsWorld.broadphase = new CANNON.SAPBroadphase(physicsWorld)
physicsWorld.allowSleep = true
physicsWorld.gravity.set(0, -9.82, 0)

const defaultMaterial = new CANNON.Material('concrete')
//const plasticMaterial = new CANNON.Material('plastic')

const defaultContactMeterial = new CANNON.ContactMaterial(
    defaultMaterial,
    defaultMaterial,
    {
        friction:  0.1,
        //restitution: 0.7,
    }
)
physicsWorld.addContactMaterial(defaultContactMeterial);
physicsWorld.defaultContactMaterial = defaultContactMeterial

/* const sphereShape = new CANNON.Sphere(0.5)
const sphereBody = new CANNON.Body({
    mass: 1,
    position: new CANNON.Vec3(0, 3, 0),
    shape: sphereShape,
    //material: defaultMaterial
})
physicsWorld.addBody(sphereBody);

sphereBody.applyForce(new CANNON.Vec3(150, 0, 0), sphereBody.position) */

const floorShape = new CANNON.Plane()
const floorBody = new CANNON.Body()
floorBody.mass = 0;
floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(-1, 0, 0), Math.PI/2)
//floorBody.material = defaultMaterial;
floorBody.addShape(floorShape);
physicsWorld.addBody(floorBody)

/**
 * Test sphere
 */
/* const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 32),
    new THREE.MeshStandardMaterial({
        metalness: 0.3,
        roughness: 0.4,
        envMap: environmentMapTexture
    })
)
sphere.castShadow = true
sphere.position.y = 1
scene.add(sphere)
 */
/**
 * Floor
 */
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    new THREE.MeshStandardMaterial({
        color: '#777777',
        metalness: 0.3,
        roughness: 0.4,
        envMap: environmentMapTexture
    })
)
floor.receiveShadow = true
floor.rotation.x = - Math.PI * 0.5
scene.add(floor)

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.7)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.2)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.camera.left = - 7
directionalLight.shadow.camera.top = 7
directionalLight.shadow.camera.right = 7
directionalLight.shadow.camera.bottom = - 7
directionalLight.position.set(5, 5, 5)
scene.add(directionalLight)

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
camera.position.set(- 3, 3, 3)
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
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Utils
 */

//BALLS
const SphereGeometry = new THREE.SphereGeometry(1, 32, 32)
const SphereMaterial = new THREE.MeshStandardMaterial({
    metalness: 0.3,
    roughness: 0.4,
    envMap: environmentMapTexture
})

function createSphere(radius, position){
    //ThreeMesh
    const mesh = new THREE.Mesh(SphereGeometry, SphereMaterial)
    mesh.scale.set(radius, radius, radius)
    mesh.castShadow = true 
    mesh.position.copy(position);
    scene.add(mesh)

    //cannon.js body;
    const shape = new CANNON.Sphere(radius)
    const body = new CANNON.Body({
        mass: 1,
        position: new CANNON.Vec3(0, 3, 0),
        shape,
        material: defaultMaterial
    })
    body.position.copy(position)
    physicsWorld.addBody(body)

    spheres.push({ mesh: mesh, body: body });
}

const debugObject = {}
debugObject.createSphere = ()=> {
    createSphere(Math.random(),
        {
            x: 0 + (Math.random() - 0.5) *3,
            y: 3 + (Math.random() - 0.5) *3,
            z: 0 + (Math.random() - 0.5) *3
        }
    ) 
}

//BOXES
const BoxGeometry = new THREE.BoxGeometry(1, 1, 1)
const BoxMaterial = new THREE.MeshStandardMaterial({
    metalness: 0.3,
    roughness: 0.4,
    envMap: environmentMapTexture
})

function createBox(radiusX, radiusY, radiusZ, position){
    //ThreeMesh
    const mesh = new THREE.Mesh(BoxGeometry, BoxMaterial)
    mesh.scale.set(radiusX, radiusY, radiusZ)
    mesh.castShadow = true 
    mesh.position.copy(position);
    scene.add(mesh)

    //cannon.js body;
    const shape = new CANNON.Box(new CANNON.Vec3(radiusX/2, radiusY/2, radiusZ/2))
    const body = new CANNON.Body({
        mass: 1,
        position: new CANNON.Vec3(0, 3, 0),
        shape,
        material: defaultMaterial
    })
    body.position.copy(position)

    body.addEventListener('collide', playSound)
    physicsWorld.addBody(body)

    boxes.push({ mesh: mesh, body: body });
}

debugObject.createBox = () => {
    createBox(
        Math.random() + 0.3,
        Math.random() + 0.3,
        Math.random() + 0.3,
        {
            x: 0 + (Math.random() - 0.5) * 3,
            y: 3 + (Math.random() - 0.5) * 3,
            z: 0 + (Math.random() - 0.5) * 3
        }
    )
}

debugObject.reset = () => {
    spheres.forEach(s => {
        physicsWorld.remove(s.body)
        scene.remove(s.mesh)
    })
    boxes.forEach(b => {
        b.body.removeEventListener('collide', playSound)
        physicsWorld.remove(b.body)
        scene.remove(b.mesh)

    })
}


gui.add(debugObject, 'createSphere');
gui.add(debugObject, 'createBox');
gui.add(debugObject, 'reset');

const spheres = []
const boxes = []

function UpdatePosition(spheres){
    spheres.forEach(s => {
        s.mesh.position.copy(s.body.position)
    })
    boxes.forEach(b => {
        b.mesh.position.copy(b.body.position)
        b.mesh.quaternion.copy(b.body.quaternion)
    })
}

createSphere(0.5, {x: 0, y: 3, z: 0})




/**
 * Animate
 */
const clock = new THREE.Clock()

let oldElapsedTime = 0;
const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - oldElapsedTime;
    oldElapsedTime = elapsedTime;

    //update physics world
    physicsWorld.step(1/60, deltaTime, 3)
    UpdatePosition(spheres)
    /*sphereBody.applyForce(new CANNON.Vec3(-0.5, 0, 0), sphereBody.position)
    sphere.position.copy(sphereBody.position) */
    //createBox(0.05, 0.05, 0.05, {x: 0, y: 1, z: 0});
    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)


    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()