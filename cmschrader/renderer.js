import './style.css'
import * as Astro from './astro.js'
import * as THREE from 'three'
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import { NoToneMapping } from 'three';

export function Scene() {
    const scene = new THREE.Scene()
    const camera  = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 1000000);
    const renderer = new THREE.WebGLRenderer({canvas: document.querySelector("#space"),})

    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(window.innerWidth, window.innerHeight)
    camera.position.set(0, 40, 20);
    camera.lookAt(new THREE.Vector3(0,0,0))
    camera.updateMatrixWorld(); 
    // const controls = new OrbitControls(camera, renderer.domElement);
    // controls.touches.TWO = THREE.TOUCH.
    return {scene, renderer, camera}
}

export function System(focus, renderSystem, title, baseScale, baseTimeScale, scrollScale, scrollTimeScale) {
    var time = Date.now()
    // var baseTimeScale = 10*86400/1000 // 10 days/second
    var timeScale = baseTimeScale
    var lastTime = time
    var cameraAngle = 0
    function animate() {
        requestAnimationFrame(animate)
        time += (Date.now() - lastTime) * timeScale
        lastTime = Date.now()

        
        renderSystem.camera.position.set(30*Math.sin(cameraAngle), 40*Math.cos(cameraAngle), 30*Math.cos(cameraAngle));
        renderSystem.camera.lookAt(new THREE.Vector3(0,0,0))
        renderSystem.camera.updateMatrixWorld(); 
        cameraAngle += .00025

        focus.update(time, renderSystem.camera)
        // renderSystem.controls.update()
        renderSystem.renderer.render(renderSystem.scene, renderSystem.camera)
    }

    window.addEventListener('resize', onWindowResize, false);
    function onWindowResize(){

        renderSystem.camera.aspect = window.innerWidth / window.innerHeight;
        renderSystem.camera.updateProjectionMatrix();

        renderSystem.renderer.setSize( window.innerWidth, window.innerHeight );

    }    

    Astro.setFocus(focus)
    // document.getElementById("focusSelect").onchange = function() {Astro.updateFocus()}
    //TODO Clean up all this code
    document.getElementById("simtitle").innerHTML = title
    document.addEventListener('scroll', function (e) {
        Astro.setScale(Math.pow(window.scrollY, 2) * scrollScale + baseScale)
        timeScale =  baseTimeScale + Math.pow((window.scrollY)/scrollTimeScale, 2) 

        document.getElementById("scaleText").innerHTML = "Distance Scale: x1/" + Math.round(Astro.scale).toLocaleString() + "<br/>Time Scale: x" + Math.round(timeScale*1000).toLocaleString()//.toExponential(2)

    })
    document.getElementById("scaleText").innerHTML = "Distance Scale: x1/" + Math.round(Astro.scale).toLocaleString() + "<br/>Time Scale: x" + Math.round(timeScale*1000).toLocaleString()//.toExponential(2)

    var hiddenText = false
    var hidebtn = document.getElementById("hide")
    var content = document.getElementById("content")
    hidebtn.addEventListener("click", function (e) {
        if (hiddenText) {
            hidebtn.innerHTML = "Hide Content"
            content.style.visibility = "visible"
        } else {
            hidebtn.innerHTML = "Show Content"
            content.style.visibility = "hidden"
        }
        hiddenText = !hiddenText
    })

    animate()
}