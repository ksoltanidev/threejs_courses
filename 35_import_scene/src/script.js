import './style.css'
import * as dat from 'dat.gui'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import waterVertexShader from './shaders/grass/vertex.glsl'
import waterFragmenthader from './shaders/grass/fragment.glsl'
import whiteBladeVertexShader from './shaders/whiteBlade/vertex.glsl'
import whiteBladeFragmenthader from './shaders/whiteBlade/fragment.glsl'
import {BufferGeometryUtils} from 'three/examples/jsm/utils/BufferGeometryUtils.js'

/**
 * Base
 */
// Debug
const gui = new dat.GUI({
    width: 400
})

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Loaders
 */
// Texture loader
const textureLoader = new THREE.TextureLoader()

// Draco loader
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('draco/')

// GLTF loader
const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)

/**
 * Textures
 */
const bakedTexture = textureLoader.load('falaiseV2.jpg')

/**
 * Environment map
 */
// const cubeTextureLoader = new THREE.CubeTextureLoader()
// const environmentMap = cubeTextureLoader.load([
//     '/skybox/miramar_rt.tga',
//     '/skybox/miramar_lf.tga',
//     '/skybox/miramar_up.tga',
//     '/skybox/miramar_dn.tga',
//     '/skybox/miramar_ft.tga',
//     '/skybox/miramar_bk.tga',
// ])
// scene.background = environmentMap;

/**
 * Materials
 */
// Baked material
const bakedMaterial = new THREE.MeshBasicMaterial({ map: bakedTexture })
bakedTexture.flipY = false
bakedTexture.encoding = THREE.sRGBEncoding

const grassParameter = {
    depthColor : '#000000',
    surfaceColor : '#147faa',
}
const lanternMaterial = new THREE.MeshBasicMaterial({ color: '#ffffe5' })
const rubanMaterial = new THREE.MeshBasicMaterial({ color: '#330000' })
//const grassMaterial = new THREE.MeshBasicMaterial({ color: '#002d33' })
const grassMaterial = new THREE.ShaderMaterial({
    vertexShader : waterVertexShader,
    fragmentShader : waterFragmenthader,
    side: THREE.DoubleSide,
    uniforms : {
        uTime : { value: 0.0},
        uBigWavesSpeed : { value: 1},
        uBigWavesElevation : {value: 0.12},
        uBigWavesFrequency : {value: new THREE.Vector2(4, 1.5)},
        uDepthColor: { value: new THREE.Color(grassParameter.depthColor)},
        uSurfaceColor: { value: new THREE.Color(grassParameter.surfaceColor)},
        //uColorOffset : {value: 0.35},
        //uColorMultiplier : {value: 0.7},
    }
})
const bladeWhiteMaterial = new THREE.ShaderMaterial({
    vertexShader : whiteBladeVertexShader,
    fragmentShader : whiteBladeFragmenthader,
    uniforms : {
        uTime : { value: 0.0},
    }
})

gui.add(grassMaterial.uniforms.uBigWavesElevation, "value").min(0).max(1).step(0.001).name("Grass Waves Elevation");
gui.add(grassMaterial.uniforms.uBigWavesFrequency.value, "x").min(0.1).max(20).step(0.01).name("Grass Waves Frequency.X");
gui.add(grassMaterial.uniforms.uBigWavesFrequency.value, "y").min(0.1).max(20).step(0.01).name("Grass Waves Frequency.Z");
gui.add(grassMaterial.uniforms.uBigWavesSpeed, "value").min(0).max(5).step(0.01).name("Grass Waves Speed");
gui.addColor(grassParameter, "depthColor").name("depht Color").onChange(() => grassMaterial.uniforms.uDepthColor.value.set(grassParameter.depthColor));
gui.addColor(grassParameter, "surfaceColor").name("surface Color").onChange(() => grassMaterial.uniforms.uSurfaceColor.value.set(grassParameter.surfaceColor));


/**
 * Scene
 */
gltfLoader.load(
    'customGrass.glb', //the grass base model
    (grass_gltf) => {
        grass_gltf.scene.traverse((grassMesh) => {
            if (grassMesh.name === "CustomGrass") {
                gltfLoader.load(
                    'grass_particles.glb', //Vertices with final model position/scale/rotation
                    (grass_gltf) => {
                        let grassGeometries = [];
                        grass_gltf.scene.traverse((particle) => {
                            if (particle.name !== 'Scene'){
                                const tGrassGeometry = grassMesh.geometry.clone();
                                tGrassGeometry.rotateZ(particle.rotation.z);
                                tGrassGeometry.rotateY(particle.rotation.y);
                                tGrassGeometry.rotateX(particle.rotation.x);
                                if (particle.scale.x > 0.05) tGrassGeometry.scale(particle.scale.x, particle.scale.x, particle.scale.x);
                                else tGrassGeometry.scale(0.05, 0.05, 0.05);
                                tGrassGeometry.translate(particle.position.x, particle.position.y, particle.position.z);
                                grassGeometries.push(tGrassGeometry);
                                
                            }
                        });
                        const AllGrassGeometries = BufferGeometryUtils.mergeBufferGeometries(grassGeometries);
                        const m = new THREE.Mesh(AllGrassGeometries, grassMaterial);
                        scene.add(m);
                    }
                )
            }
        });
    }
)


gltfLoader.load(
    'falaiseV2_fullBlades.glb',
    (gltf) => {
        gltf.scene.traverse((child) => {
            //console.log(child)
            if (child.name === "Light1" || child.name === 'Light2') child.material = lanternMaterial;
            else if (child.name === "ruban1" || child.name === 'ruban2' || child.name === 'ruban_base') child.material = rubanMaterial;
            //else if (child.name === "Grass" ) child.material = grassMaterial;
            else if (child.name === "fullBlade1" ) child.material = bladeWhiteMaterial;
            else if (child.name === "fullBlade2" ) child.material = bladeWhiteMaterial;
            else child.material = bakedMaterial
            //child.material = bakedMaterial
        })
        scene.add(gltf.scene)
    }
)

/**
 * Light
 */

// const ambientLight = new THREE.AmbientLight(0xffffff, 1)
// gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001)
// scene.add(ambientLight)
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
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 4
camera.position.y = 2
camera.position.z = 4
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})
renderer.outputEncoding = THREE.sRGBEncoding
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
    const elapsedTime = clock.getElapsedTime()
    grassMaterial.uniforms.uTime.value = elapsedTime;
    bladeWhiteMaterial.uniforms.uTime.value = elapsedTime;

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()