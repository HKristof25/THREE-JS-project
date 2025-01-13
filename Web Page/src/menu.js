import { ThreeMFLoader } from 'three/examples/jsm/Addons.js';
import './style.css'

import * as THREE from 'three'
import { and, color } from 'three/tsl';
import { RenderOutputNode } from 'three/webgpu';

import { OrbitControls } from 'three/examples/jsm/Addons.js';
import { cubeMapNode } from 'three/src/nodes/utils/CubeMapNode.js';
import { PointsNodeMaterial } from 'three/webgpu';

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1,1000);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight)
camera.position.set( 9,9,9);
camera.rotateX(-0.78)
camera.rotateY(0.61)
camera.rotateZ(0.52)

renderer.render(scene,camera)

//Floor
const PlaneGeometry = new THREE.PlaneGeometry(10,10)
const planeMaterial = new THREE.MeshStandardMaterial({color: 0xdddada})
const Plane = new THREE.Mesh(PlaneGeometry, planeMaterial)
Plane.rotation.x = -(Math.PI / 2)
Plane.position.y = 0.4
Plane.castShadow = false
Plane.receiveShadow = true
scene.add(Plane)

//Adding Cubes 7x7
function AddCubes(){
  for (let x = -3; x <= 3; x++) {
    for (let y = -3; y <= 3; y++) {
      const CubeGeometry = new THREE.BoxGeometry(0.8,0.8,0.8)
      const CubeMaterial = new THREE.MeshStandardMaterial({color: 0xffffff})
      const Cube = new THREE.Mesh(CubeGeometry,CubeMaterial)
      Cube.castShadow = true
      Cube.receiveShadow = true
      Cube.name = "Cube"

      Cube.position.set(x,1,y)
      
      scene.add(Cube)
    }
    
  }
}
AddCubes()

//Shadows and Lighting
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFShadowMap

const light = new THREE.DirectionalLight(0xffffff, 1)
light.position.set(3,10,3)
light.castShadow = true
scene.add(light)

light.shadow.mapSize.width = 512
light.shadow.mapSize.height = 512
light.shadow.camera.near= 0.5
light.shadow.camera.far= 500

const ambientLight = new THREE.AmbientLight(0xffffff, 2)

scene.add(ambientLight)

function addStar(){
  const geometry = new THREE.SphereGeometry(0.25,24,24)
  const material = new THREE.MeshStandardMaterial({color: 0xffffff})
  const star = new THREE.Mesh( geometry, material)

  const [x,y,z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100))
  star.position.set(x,y,z)
  scene.add(star)
}

Array(200).fill().forEach(addStar)

//Function called every frame
const controls = new OrbitControls( camera, renderer.domElement );
controls.autoRotate = true
function animate(){
  requestAnimationFrame(animate)
  controls.enabled = false
  controls.update()
  renderer.render(scene,camera)
}
animate()