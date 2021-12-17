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
const ORBIT_RES = 360
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

        this.markerGeometry = new THREE.SphereGeometry(3, 8, 4)
        this.markerMaterial = new THREE.MeshBasicMaterial({color: this.color, wireframe: true})
        this.markerMesh = new THREE.Mesh(this.markerGeometry, this.markerMaterial)
        scene.add(this.markerMesh)   

        this.realGeometry = new THREE.SphereGeometry(1, 32, 16)
        this.realMaterial = new THREE.MeshBasicMaterial({color: this.color, wireframe: true})
        this.realMesh = new THREE.Mesh(this.realGeometry, this.realMaterial)
        scene.add(this.realMesh)    
        
        if (this.parent != null) {
            this.orbitMaterial = new THREE.LineBasicMaterial({color: this.color})
            this.orbitGeometry = new THREE.BufferGeometry()
            const vertices = new Float32Array(ORBIT_RES * 3 + 3); 
	        this.orbitGeometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
            this.orbit = new THREE.Line(this.orbitGeometry, this.orbitMaterial)
            scene.add(this.orbit)
        }
        
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
        if (this.parent == null) {
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

        // Determine Velocity
        let V = matrix([
            [-Math.sin(trueAnom)],
            [this.e + Math.cos(trueAnom)],
            [0]
        ])
        V = multiply(this.mu/this.h, V)
        V = multiply(QxX, V)

        return [R._data[0], R._data[1], R._data[2], V._data[0], V._data[1], V._data[2]]
    }

    transform(point, focus, time)
    {
        var pointSV = sv2r(point)
        var focusSV = sv2r(focus.stateVector(time))
        if (pointSV.equals(focusSV)){
            return new THREE.Vector3(0, 0, 0)
        }
        focusSV = v3sub(pointSV, focusSV)
        // var parent = this.parent
        // while (parent != null) {
        //     focusSV.add(sv2r(parent.stateVector(time)))
        //     parent = parent.parent
        // }
        // console.log(this.name + " " + focusSV.toArray()[0])
        if (this.name === "Luna") {
        }
        focusSV.add(this.getOffset(time))
        // TODO Fix moon offsets
        // if (this.name === "Luna") {
        //     console.log(focusSV)
        // }
        focusSV.multiplyScalar(1/scale)
        return focusSV.clone()
    }

    getOffset(time) {
        var offset
        if (this.parent != null) {
            offset = sv2r(this.parent.stateVector(time))
            offset.add(this.parent.getOffset())
        } else {
            offset = new THREE.Vector3(0, 0, 0) 
        }
        return offset
    }

    // Draws a bodies and it's children's orbits.  Called whenever scale is changed.
    drawOrbit(focus) {
        if (this.parent == null) {return}
        const vertices = this.orbit.geometry.attributes.position.array
        let time = this.timeOfPeriapsis
        var point
        var index = 0
        while (time < this.timeOfPeriapsis + this.T) {
            point = this.transform(this.stateVector(time), focus, time).toArray()
            vertices[index++] = point[0]
            vertices[index++] = point[1]
            vertices[index++] = point[2]
            time += this.T / ORBIT_RES
        }
        point = this.transform(this.stateVector(time), focus, time)
        vertices[index++] = vertices[0]
        vertices[index++] = vertices[1]
        vertices[index++] = vertices[2]
        this.orbit.geometry.attributes.position.needsUpdate = true

        // Children
    }

    // Draw a body.  Called every frame.
    update(focus, time) {
        var visualRadius = this.radius / scale
        if (false) {    // Object Hidden
            this.markerMesh.visible = false;
            this.realMesh.visible = false;
        }  
        else if (visualRadius < 0.1) {  // Marker Mesh
            this.markerMesh.visible = true;
            this.realMesh.visible = false;
            if (this.parent != null) {
                this.markerMesh.position.copy(this.transform(this.stateVector(time), focus, time))
            }
        }
        else {  // Visible in local space
            this.markerMesh.visible = false;
            this.realMesh.visible = true;
            if (this.parent != null) {
                this.realMesh.position.copy(this.transform(this.stateVector(time), focus, time))
            }
            this.realMesh.scale.copy(new THREE.Vector3(visualRadius, visualRadius, visualRadius))
        }
        this.drawOrbit(focus) // TODO only do this when scale changes

        this.children.forEach(child => {
            if (child !== null) child.update(focus, time)
        })
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
    return new THREE.Vector3(sv[0], sv[2], sv[1])
}