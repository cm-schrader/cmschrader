import * as THREE from 'three'
import { matrix, multiply } from 'mathjs'

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
            a, i, e, timeOfPeriapsis, raan, w, color) {
        this.name = name
        this.mass = mass
        this.bodyType = bodyType
        this.color = color
        this.parent  = parent
        this.radius = radius
        this.a = a
        this.i = deg2rad(i)
        this.e = e
        this.timeOfPeriapsis = timeOfPeriapsis
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
        return 2 * Math.PI * Math.sqrt(Math.pow(this.a, 3) / this.mu)
    }

    // Perifocal to Inertial Transfomation matrix
    get QxX() {
        return matrix([
            [-Math.sin(this.raan)*Math.cos(this.i)*Math.sin(this.w)+Math.cos(this.raan)*Math.cos(this.w), -Math.sin(this.raan)*Math.cos(this.i)*Math.cos(this.w)-Math.cos(this.raan)*Math.sin(this.w), Math.sin(this.raan)*Math.sin(this.i)],
            [Math.cos(this.raan)*Math.cos(this.i)*Math.sin(this.w)+Math.sin(this.raan)*Math.cos(this.w), Math.cos(this.raan)*Math.cos(this.i)*Math.cos(this.w)-Math.sin(this.raan)*Math.sin(this.w), -Math.cos(this.raan)*Math.sin(this.i)],
            [Math.sin(this.i)*Math.sin(this.w), Math.sin(this.i)*Math.cos(this.w), Math.cos(this.i)]
        ])
    }

    // Computes the state vector in the inertial frame.
    stateVector(time) {
        if (this.parent === null) {
            return [0, 0, 0, 0, 0, 0]
        } 
        time = (time - this.timeOfPeriapsis) % this.T
             
        // Determine true anomaly
        let trueAnom
        if (this.e === 0) {
            trueAnom = Math.PI * 2 / this.T * time
        } else {
            // Newton's method
            let meanAnom = time * 2 * Math.PI / this.T
            let eccAnomPast = 0
            let eccAnom = meanAnom;
            while (Math.abs(eccAnom - eccAnomPast) > 0.01) {
                eccAnomPast = eccAnom
                eccAnom = eccAnom - (eccAnom-this.e*Math.sin(eccAnom)-meanAnom) / (1-this.e*Math.cos(eccAnom))
            }
            trueAnom = 2*Math.atan(Math.sqrt(1+this.e)/Math.sqrt(1-this.e)*Math.tan(eccAnom/2))
        }

        // Perifocal to Inertial Rotation Matrix
        let QxX = this.QxX

        // Determine Position
        let R = matrix([
            [Math.cos(trueAnom)], 
            [Math.sin(trueAnom)], 
            [0]
        ])
        R = multiply(Math.pow(this.h, 2)/this.mu/(1+this.e*Math.cos(trueAnom)), R) 
        R = multiply(QxX, R)    
        console.log(R._data[0])  

        // Determine Velocity
        let V = matrix([
            [-Math.sin(trueAnom)],
            [this.e + Math.cos(trueAnom)],
            [0]
        ])
        V = multiply(this.mu/this.h, V)
        V = multiply(QxX, V)

        return [R._data[0], R._data[2], R._data[1], V._data[0], V._data[2], V._data[1]]
    }

    // Draws a bodies and it's children's orbits.  Called whenever scale is changed.
    drawOrbit() {
        
    }

    // Draw a body.  Called every frame.
    update(focus, time) {
        var visualRadius = this.radius / scale
        if (false) {    // Object Hidden
            this.markerMesh.visible = false;
            this.realMesh.visible = false;
        }
        else if (visualRadius < 0.01) {  // Marker Mesh
            this.markerMesh.visible = true;
            this.realMesh.visible = false;
            this.markerMesh.position.copy(transform(sv2r(this.stateVector(time)), focus))
        }
        else {  // Visible in local space
            this.markerMesh.visible = false;
            this.realMesh.visible = true;
            this.realMesh.position.copy(transform(sv2r(this.stateVector(time)), focus))
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
    return new THREE.Vector3(sv[0], sv[1], sv[2])
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