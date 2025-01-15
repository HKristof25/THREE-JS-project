import { ThreeMFLoader } from 'three/examples/jsm/Addons.js';
import './style.css'

import * as THREE from 'three'
import { and, color } from 'three/tsl';
import { RenderOutputNode } from 'three/webgpu';

import { OrbitControls } from 'three/examples/jsm/Addons.js';
import { cubeMapNode } from 'three/src/nodes/utils/CubeMapNode.js';
import { PointsNodeMaterial } from 'three/webgpu';

//Three js setup dont touch it
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
//camera.position.set( -5.47283435693948,8.719480629687583,12.0075850771697);

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

//Shows shadow and lighting directions
const helper = new THREE.CameraHelper( light.shadow.camera );
//scene.add( helper );

const ambientLight = new THREE.AmbientLight(0xffffff, 1.2)

scene.add(ambientLight)

//Camera Control
const controls = new OrbitControls(camera,renderer.domElement)
controls.enabled = true

//Adding background stars
function addStar(){
  const geometry = new THREE.SphereGeometry(0.25,24,24)
  const material = new THREE.MeshStandardMaterial({color: 0xffffff})
  const star = new THREE.Mesh( geometry, material)

  const [x,y,z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100))
  star.position.set(x,y,z)
  scene.add(star)
}

Array(200).fill().forEach(addStar)

//On Mouse Hover

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

document.addEventListener('click', onPointerMove)
let INTERSECTED;

function onPointerMove( event ) {

	// calculate pointer position in normalized device coordinates
	// (-1 to +1) for both components

	pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
  render()

}

function render() {

	// update the picking ray with the camera and pointer position
	raycaster.setFromCamera( pointer, camera );

	// calculate objects intersecting the picking ray
	const intersects = raycaster.intersectObjects( scene.children, false );

    if (INTERSECTED != intersects[0].object){
						INTERSECTED = intersects[ 0 ].object;
            console.log(INTERSECTED)
            if(INTERSECTED.name == "Cube" && INTERSECTED.position.y < 1.5)
            {
              INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
              INTERSECTED.material.emissive.setHex( 0x29ffd6 );
              //0x29ffd6
              //0xff1100
              INTERSECTED.position.y += 0.5
            }
    }



}


//Function called every frame
function animate(){
  console.log(camera.position, camera.rotation)
  requestAnimationFrame(animate)
  renderer.render(scene,camera)
}
animate()