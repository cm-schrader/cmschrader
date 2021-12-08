import * as THREE from 'three'


export const Star = Symbol("Star")
export const Planet = Symbol("Planet")
export const DwarfPlanet = Symbol("DwarfPlanet")
export const Moon = Symbol("Moon")
export const Asteroid = Symbol("Asteroid")
export const Station = Symbol("Station")
export const Vessel = Symbol("Vessel")
export const Satellite = Symbol("Satellite")
export const Probe = Symbol("Probe")


export var scale = 5e8
const G = 6.67408e-11
// var time // TODO Make actual date time? Let you set the solar system to any arbitrary datetime
// TODO Could I lazy load bodies?  Load in the focus and stuff near it first

function deg2rad(deg) {
    return deg * Math.PI/180;
}

export class Body {
    constructor(scene, name, parent, bodyType, radius, mass, 
            a, i, e, theta, raan, w, color) {
        this.name = name
        this.mass = mass
        this.bodyType = bodyType
        this.color = color
        this.parent  = parent
        this.radius = radius
        this.a = a
        this.i = deg2rad(i)
        this.e = e
        this.theta = deg2rad(theta)
        this.raan = deg2rad(raan)
        this.w = deg2rad(w)

        this.children = []
        if (this.parent !== null) {
            this.parent.children.push(this)
        }

        this.markerGeometry = new THREE.SphereGeometry(1, 8, 4)
        this.markerMaterial = new THREE.MeshBasicMaterial({color: this.color, wireframe: true})
        this.markerMesh = new THREE.Mesh(this.markerGeometry, this.markerMaterial)
        scene.add(this.markerMesh)   

        this.realGeometry = new THREE.SphereGeometry(1, 32, 16)
        this.realMaterial = new THREE.MeshBasicMaterial({color: this.color, wireframe: true})
        this.realMesh = new THREE.Mesh(this.realGeometry, this.realMaterial)
        scene.add(this.realMesh)      
        
        
        // const focusOnBody = (ev) => {setFocus(this)}
        // this.markerMesh.on('click', focusOnBody);
        // this.realMesh.on('click', focusOnBody);
    }

    // Gravitational Constant
    get mu() {
        if (this.parent === null) {
            return 0
        } 
        return G * this.parent.mass
    }

    // Specific Angular Momentum
    get h() {
        return Math.sqrt(this.mu * this.a * (1 - Math.pow(this.e, 2)))
    }

    // Orbital Period
    get T() {
        2 * Math.PI * Math.sqrt(Math.pow(this.a, 3) / this.mu())
    }

    // Perifocal to Inertial Transfomation matrix
    get QxX() {
        return null
    }

    get stateVector() {
        return [this.a, 0, 0, 0, 0, 0]
    }

    update(focus) {
        var visualRadius = this.radius / scale
        if (false) {    // Object Hidden
            this.markerMesh.visible = false;
            this.realMesh.visible = false;
        }
        else if (visualRadius < 0.01) {  // Marker Mesh
            this.markerMesh.visible = true;
            this.realMesh.visible = false;
            this.markerMesh.position.copy(transform(sv2r(this.stateVector), focus))
        }
        else {  // Visible in local space
            this.markerMesh.visible = false;
            this.realMesh.visible = true;
            this.realMesh.position.copy(transform(sv2r(this.stateVector), focus))
            this.realMesh.scale.copy(new THREE.Vector3(visualRadius, visualRadius, visualRadius))
        }

        // this.children.forEach(child => {
        //     if (child !== null) child.update()
        // })
    }
}

function setFocus(newFocus) {
    console.log("Focus on " + newFocus.name)
    focus = newFocus // TODO make focus position so you can lerp, bonus, make it async lerp to something
}

function setScale(newScale) {
    scale = newScale
}

//https://www.cs.uaf.edu/2013/spring/cs493/lecture/01_24_vectors.html
// v1 - v2
function v3sub(v1, v2) {
    var nv2 = v2.clone().multiplyScalar(-1)
    return v1.clone().add(nv2)
}

function sv2r(sv) {
    var r = sv.slice(0, 3)
    return new THREE.Vector3(r[0], r[1], r[2])
}

function transform(point, focus)
{
    var focusSV = sv2r(focus.stateVector)
    if (point.equals(focusSV)){
        return new THREE.Vector3(0, 0, 0)
    }
    focusSV = v3sub(point, focusSV)
    focusSV.multiplyScalar(1/scale)
    return focusSV
}