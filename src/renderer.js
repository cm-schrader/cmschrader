import '../style.css'
import * as Astro from './astro.js'
import * as THREE from 'three'
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import { NoToneMapping } from 'three';
import space_ft from './static/skybox/space_ft.png'
import space_bk from './static/skybox/space_bk.png'
import space_up from './static/skybox/space_up.png'
import space_dn from './static/skybox/space_dn.png'
import space_rt from './static/skybox/space_rt.png'
import space_lf from './static/skybox/space_lf.png'  

export function Scene() {
    const scene = new THREE.Scene()
    const camera  = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 1000000);
    const renderer = new THREE.WebGLRenderer({canvas: document.querySelector("#space"),})

    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(window.innerWidth, window.innerHeight)
    camera.position.set(0, 40, 20);
    camera.lookAt(new THREE.Vector3(0,0,0))
    camera.updateMatrixWorld(); 
    const loader = new THREE.CubeTextureLoader();
    const texture = loader.load([
        space_ft,
        space_bk,
        space_up,
        space_dn,
        space_rt,
        space_lf        
    ]);
    scene.background = texture;
    return {scene, renderer, camera}
}

export function System(focus, renderSystem, title, baseScale, baseTimeScale, scrollScale, scrollTimeScale) {
    var time = Date.now()
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

    function onScaleScroll (e) {
        Astro.setScale(Math.pow(window.scrollY, 2) * scrollScale + baseScale)
        timeScale =  baseTimeScale + Math.pow((window.scrollY)/scrollTimeScale, 2) 
    
        document.getElementById("scaleText").innerHTML = "Distance Scale: x1/" + Math.round(Astro.scale).toLocaleString() + "<br/>Time Scale: x" + Math.round(timeScale*1000).toLocaleString()//.toExponential(2)
    
    }
    onScaleScroll()

    Astro.setFocus(focus)
    document.getElementById("simtitle").innerHTML = title
    document.addEventListener('scroll', onScaleScroll)
    document.getElementById("scaleText").innerHTML = "Distance Scale: x1/" + Math.round(Astro.scale).toLocaleString() + "<br/>Time Scale: x" + Math.round(timeScale*1000).toLocaleString()//.toExponential(2)

    var hiddenText = false
    var hidebtn = document.getElementById("hide")
    var content = document.getElementById("content")
    hidebtn.addEventListener("click", function (e) {
        if (hiddenText) {
            hidebtn.innerHTML = "Hide Content"
            content.style.visibility = "hidden"
        } else {
            hidebtn.innerHTML = "Show Content"
            content.style.visibility = "visible"
        }
        hiddenText = !hiddenText
    })
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    if (urlParams.get("view") == "space")
    {
        document.getElementById("hide").style.display = "none"
        if (document.getElementById("menu"))
        {
            document.getElementById("menu").style.display = "none"
        }
        content.style.visibility = "hidden"
    }    
    animate()
}

function createPathStrings(filename) {
    const basePath = "../static/skybox/";
    const baseFilename = basePath + filename;
    const fileType = ".png";
    const sides = ["ft", "bk", "up", "dn", "rt", "lf"];
    const pathStings = sides.map(side => {
      return baseFilename + "_" + side + fileType;
    })
  
    return pathStings;
}

function createMaterialArray(filename) {
const skyboxImagepaths = createPathStrings(filename);
    const materialArray = skyboxImagepaths.map(image => {
        let texture = new THREE.TextureLoader().load(image);

        return texture;
    })
    return materialArray
}