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

        this.geometry = new THREE.SphereGeometry(1, 16, 8)
        this.material = new THREE.MeshBasicMaterial({color: this.color, wireframe: true})
        this.mesh = new THREE.Mesh(this.geometry, this.material)
        scene.add(this.mesh)        
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
        if (true) { // If object is visible in general (place marker) or in local space (place real model)
            this.mesh.position.copy(transform(sv2r(this.stateVector), focus))
            this.mesh.scale.copy(new THREE.Vector3(this.radius / scale, this.radius / scale, this.radius / scale))
            // Draw orbit
        }
        // Update children
    }
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
    console.log(focusSV)
    return focusSV
}