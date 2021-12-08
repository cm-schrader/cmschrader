import './style.css'
import * as Astro from './astro.js'
import * as THREE from 'three'
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";

const scene = new THREE.Scene()
const camera  = new THREE.PerspectiveCamera(100, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({canvas: document.querySelector("#space"),})

renderer.setPixelRatio(window.devicePixelRatio)
renderer.setSize(window.innerWidth, window.innerHeight)
camera.position.set(2, 5, 10);
camera.lookAt(new THREE.Vector3(0,0,0))
const controls = new OrbitControls(camera, renderer.domElement);

// TODO find log how long average frame takes
function animate() {
	requestAnimationFrame(animate)

	Sol.update(Sol)
	Mercury.update(Sol)
	controls.update()
	renderer.render(scene, camera)
}

window.addEventListener( 'resize', onWindowResize, false );
function onWindowResize(){

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}

document.addEventListener('mousedown', onDocumentMouseDown, false);
document.addEventListener('mousemove', onDocumentMouseMove, false); 

function onDocumentMouseDown(event) {

    event.preventDefault();

    mouseYOnMouseDown = event.clientY - windowHalfY;
    mouseXOnMouseDown = event.clientX - windowHalfX;

    var vector = new THREE.Vector3((event.clientX / window.innerWidth) * 2 - 1, -(event.clientY / window.innerHeight) * 2 + 1, 0.5);
    vector = vector.unproject(camera);

    var raycaster = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());
    var intersects = raycaster.intersectObjects(circleObj, true); // Circle element which you want to identify

    if (intersects.length > 0) {
        alert("Mouse on Circle");
    }

}

// TODO read bodies from files.  Maybe split into multiple files so its not just one huge CSV?
const Sol = new Astro.Body(scene, "Sol", null, Astro.Star, 696000e+3, 1.9891e+30, 0, 0, 0, 0, 0, 0, 0xffcb3d)
const Mercury = new Astro.Body(scene, "Mercury", Sol, Astro.Planet, 2439.7e+3, 3.3011e+23, 57909050e+3, 6.35, 0.205, 210, 48.331, 29.124, 0x995532)

animate()