import './style.css'
import Body from './body'

import * as THREE from 'three'
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";

const scene = new THREE.Scene()

const camera  = new THREE.PerspectiveCamera(100, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#bg"),
})

renderer.setPixelRatio(window.devicePixelRatio)
renderer.setSize(window.innerWidth, window.innerHeight)
camera.position.set(0, 5, -5);
// camera.position.setZ(30)
camera.lookAt(new THREE.Vector3(0,0,0))
const controls = new OrbitControls( camera, renderer.domElement );

// renderer.render(scene, camera)




// function body() {
//   const bodyGeo = new THREE.SphereGeometry( 3, 32, 16 )
//   // const bodyGeo = new THREE.TorusGeometry(10, 3, 16, 100);
//   const bodyMat = new THREE.MeshBasicMaterial({color: 0x1122ff, wireframe: true})
//   return new THREE.Mesh(bodyGeo, bodyMat)
// }

function animate() {
  // renderer.setPixelRatio(window.devicePixelRatio)
  // renderer.setSize(window.innerWidth, window.innerHeight)

  requestAnimationFrame(animate)

  // earth.rotation.x += .01
  // earth.rotation.y += .02
  // earth.rotation.z += .01

  controls.update()
  renderer.render(scene, camera)
}

const earth = new Body(scene, 2, new THREE.Vector3(0, 0, 0))

animate()