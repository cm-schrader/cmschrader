import './style.css'
import * as Astro from './astro.js'
import * as THREE from 'three'
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import { NoToneMapping } from 'three';

const scene = new THREE.Scene()
const camera  = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 10000);
const renderer = new THREE.WebGLRenderer({canvas: document.querySelector("#space"),})

renderer.setPixelRatio(window.devicePixelRatio)
renderer.setSize(window.innerWidth, window.innerHeight)
camera.position.set(2, 40, 20);
camera.lookAt(new THREE.Vector3(0,0,0))
camera.updateMatrixWorld(); 
// const controls = new OrbitControls(camera, renderer.domElement);
// controls.touches.TWO = THREE.TOUCH.

var startTime = Date.now()
// var scale = 10e8
var time
function animate() {
	requestAnimationFrame(animate)
    // camera.updateMatrixWorld()

    time = (Date.now() - startTime)*10*86400/1000 
    // scale *= 1.005
    // Astro.setScale(scale)

	Sol.update(time, camera)
	// controls.update()
	renderer.render(scene, camera)
}

window.addEventListener('resize', onWindowResize, false);
function onWindowResize(){

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}

// TODO Get real time of periapsis
// Bodies
const Sol = new Astro.Body(scene, "Sol", null, Astro.Star, 696000e+3, 1.9891e+30, 0, 0, 0, 0, 0, 0, 0xffcb3d)
const Mercury = new Astro.Body(scene, "Mercury", Sol, Astro.Planet, 2439.7e+3, 3.3011e+23, 57909050e+3, 6.35, 0.205, 210, 48.331, 29.124, 0x995532)
const Venus = new Astro.Body(scene, "Venus", Sol, Astro.Planet, 6051.8e+3, 4.8675e+24, 108.209e+9, 3.395, 0.0067, 270, 54, 54, 0xffb44a)
const Earth = new Astro.Body(scene, "Earth", Sol, Astro.Planet, 6371e+3, 5.9724e+24, 149.6e+9, 1.578690, 0.0167086, 10, 174.873, 288.1, 0x345eeb)
const Mars = new Astro.Body(scene, "Mars", Sol, Astro.Planet, 3389.5e+3, 6.39e+23, 227.923e+9, 1.851, .0935, 80, 5, 6, 0xd14136)
const Vesta = new Astro.Body(scene, "Vesta", Sol, Astro.Asteroid, 262.7e+3, 2.589e+20, 353.319e+9, 5.58, .08874, 144, 103.85, 151.198, 0x394666)
const Ceres = new Astro.Body(scene, "Ceres", Sol, Astro.DwarfPlanet, 473e+3, 9.3835e+20, 414261e+6, 9.2, 0.079009, 210, 80.305, 73.597, 0x3b6370) 
const Pallas = new Astro.Body(scene, "Pallas", Sol, Astro.Asteroid, 272.5e+3, 2.04e+20, 414960772.18583e+3, 34.43, .2299, 180.1, 173.024, 310.202, 0x006656)
const Hygiea = new Astro.Body(scene, "Hygiea", Sol, Astro.Asteroid, 222e+3, 8.32e+19, 469961711e+3, 3.8316, .1125, 200, 283.2, 312.32, 0x484469)
const Jupiter = new Astro.Body(scene, "Jupiter", Sol, Astro.Planet, 69911e+3, 1.8982e+27, 778567158e+3, .32, 0.04, 77, 100.464, 273.867, 0xeb9642)
const Saturn = new Astro.Body(scene, "Saturn", Sol, Astro.Planet, 58232e+3, 5.6834e+26, 1.433537e+12, 0.93, 0.0565, 190, 113.665, 339.392, 0xFFDEAD)
const Uranus = new Astro.Body(scene, "Uranus", Sol, Astro.Planet, 25362e+3, 8.6810e+25, 2875046678e+3, 0.99, 0.046, 235, 74.006, 96.998, 0xb0c4de)
const Neptune = new Astro.Body(scene, "Neptune", Sol, Astro.Planet, 24622e+3, 1.02413e+26, 4.49841e+12, 0.74, 0, 300, 131.784, 276.336, 0x000099)
const Pluto = new Astro.Body(scene, "Pluto", Sol, Astro.DwarfPlanet, 1188.3e+3, 1.309e+22, 5.906423e+12, 17.16, 0.2488, 163, 110.299, 113.834, 0x5F9EA0)
// Haumea // TODO Add remaining Bodies
// Arrokoth
// Makemake
const Sedna = new Astro.Body(scene, "Sedna", Sol, Astro.DwarfPlanet, 998e+3, 8.32e+21, 7.57e+13, 11.9307, 0.8496, 170, 144.248, 311.352, 0xffc0cb)  
const Eris = new Astro.Body(scene, "Eris", Sol, Astro.DwarfPlanet, 1163e+3, 1.6466e+22, 1.015231e+13, 44.040, 0.43607, 200, 35.951, 151.639, 0x5F9EA0)
const Biden = new Astro.Body(scene, "2012 VP113", Sol, Astro.DwarfPlanet, 597e+3, 1.782e+21, 6.5246064e+13, 24.110, 0.68876, 200, 90.680, 293.62, 0x1E90FF)
const Orcus = new Astro.Body(scene, "Orcus", Sol, Astro.DwarfPlanet, 910e+3, 6.348e+20, 5.860347e+12, 20.592, 0.22701, 85, 268.799, 72.310, 0x884343)
// Gonggong
// Halley's commet
// Donatis Commet
// Coggia's Commet
// Ceasar's Commet
// Comet Mrkos
// Comet Kohoutek
// Comet West   
// Comet Hyakutake

Astro.setFocus(Sol)
// document.getElementById("focusSelect").onchange = function() {Astro.updateFocus()}

// TODO Display Time and Distance Scales
// TODO Realsize for local systems (ei real scale moon)
document.addEventListener('scroll', function (e) {
    Astro.setScale(Math.pow(window.scrollY, 2) * 1e4 + 15e8)
})

animate()