import * as THREE from 'three'
import { matrix, multiply } from 'mathjs'
import { FloatType, Vector3 } from 'three'

export const Star = Symbol("Star")
export const Planet = Symbol("Planet")
export const DwarfPlanet = Symbol("DwarfPlanet")
export const Moon = Symbol("Moon")
export const Asteroid = Symbol("Asteroid")
export const Commet = Symbol("Commet")
export const Station = Symbol("Station")
export const Vessel = Symbol("Vessel")
export const Satellite = Symbol("Satellite")
export const Probe = Symbol("Probe")


export var scale = 20e8
var focusBody
const G = 6.67408e-11
const ORBIT_RES = 400
var bodies = []

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
        this.lastScale = -1

        this.children = []
        if (this.parent !== null) {
            this.parent.children.push(this)
        }

        var georad = .5
        if (this.bodyType === Star) georad = 1
        if (this.bodyType === Asteroid || this.bodyType === Commet) georad = .25
        if (this.bodyType === DwarfPlanet) georad = .33
        this.markerGeometry = new THREE.SphereGeometry(georad, 16, 8)
        this.markerMaterial = new THREE.MeshBasicMaterial({color: this.color, wireframe: true})
        this.markerMesh = new THREE.Mesh(this.markerGeometry, this.markerMaterial)
        scene.add(this.markerMesh)   

        this.realGeometry = new THREE.SphereGeometry(1, 32, 16)
        this.realMaterial = new THREE.MeshBasicMaterial({color: this.color, wireframe: true})
        this.realMesh = new THREE.Mesh(this.realGeometry, this.realMaterial)
        scene.add(this.realMesh)    

        this.label = document.createElement("div")
        this.label.style.position = "absolute"
        this.label.style.fontSize = georad*2 + "rem"
        this.label.className = "spaceLabel"
        this.label.innerHTML = this.name
        document.getElementById("initialSpace").appendChild(this.label) 
        
        if (this.parent != null) {
            this.orbitMaterial = new THREE.LineBasicMaterial({color: this.color})
            this.orbitGeometry = new THREE.BufferGeometry()
            const vertices = new Float32Array(ORBIT_RES * 3 + 3); 
	        this.orbitGeometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
            this.orbit = new THREE.Line(this.orbitGeometry, this.orbitMaterial)
            scene.add(this.orbit)

            this.orbitPoints = []
            for (var theta = 0; theta < 2 * Math.PI; theta += 2 * Math.PI / ORBIT_RES) {
                this.orbitPoints.push(this.stateVector(theta))
            }          
        }
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

    trueAnom(time) {
        time = (time - this.timeOfPeriapsis) % this.T
             
        // Determine true anomaly
        let trueAnom
        if (this.e === 0) {
            trueAnom = Math.PI * 2 / this.T * time
        } else {
            // Newton's method
            let meanAnom = time * 2 * Math.PI / this.T
            let eccAnomPast = Number.MAX_VALUE
            let eccAnom = meanAnom;
            while (Math.abs(eccAnom - eccAnomPast) > 0.01) {
                eccAnomPast = eccAnom
                eccAnom = eccAnom - (eccAnom-this.e*Math.sin(eccAnom)-meanAnom) / (1-this.e*Math.cos(eccAnom))
            }
            trueAnom = 2*Math.atan(Math.sqrt(1+this.e)/Math.sqrt(1-this.e)*Math.tan(eccAnom/2))
        }
        return trueAnom
    }

    // Computes the state vector in the inertial frame.
    stateVector(trueAnom) {
        if (this.parent == null) {
            return [0, 0, 0, 0, 0, 0]
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

    transform(pointSV, time)
    {
        var pointSV = sv2r(pointSV)
        var focusSV = sv2r(focusBody.stateVector(focusBody.trueAnom(time)))
        if (pointSV.equals(focusSV)){
            return new THREE.Vector3(0, 0, 0)
        }
        pointSV.multiplyScalar(1/scale)
        return pointSV.clone()
    }

    getOffset(time) {
        var offset
        if (this.parent != null) {
            offset = sv2r(this.parent.stateVector(this.parent.trueAnom(time)))
            offset.add(this.parent.getOffset(time))
        } else {
            offset = new THREE.Vector3(0, 0, 0) 
        }
        return offset
    }

    // Draws a body's orbit
    drawOrbit() {
        if (this.parent == null) {return}
        const vertices = this.orbit.geometry.attributes.position.array
        let time = this.timeOfPeriapsis   
        let point
        let index = 0             
        this.orbitPoints.forEach(sv => {
            point = this.transform(sv, time).toArray()
            vertices[index++] = point[0]
            vertices[index++] = point[1]
            vertices[index++] = point[2]
            time += this.T / ORBIT_RES
        })
        vertices[index++] = vertices[0]
        vertices[index++] = vertices[1]
        vertices[index++] = vertices[2]
        this.orbit.geometry.attributes.position.needsUpdate = true
    }

    // Draw a body.  Called every frame.
    update(time, camera) {
        var buffer = 60;
        var visualRadius = this.radius / scale
        var position = this.transform(this.stateVector(this.trueAnom(time)), time)
        var projection = projectToCamera(position, camera)
        
        // if (false) {    // Object Hidden
        //     this.markerMesh.visible = false;
        //     this.realMesh.visible = false;
        // }

        if (this.a / scale < 2 && this.a !== 0) {
            this.markerMesh.visible = false
            this.realMesh.visible = false
            this.label.style.visibility = "hidden"
            if (typeof this.orbit !== 'undefined') {
                this.orbit.visible = false
            }
        } else {//visualRadius < 0.1) {  // Marker Mesh
            this.markerMesh.visible = true;
            this.realMesh.visible = false;
            if (typeof this.orbit !== 'undefined') {
                this.orbit.visible = true
                if (this.lastScale != scale) 
                {
                    this.drawOrbit()
                    this.lastScale = scale
                }
            }
            this.markerMesh.position.copy(position)   
            if (projection.x > buffer && projection.x < window.innerWidth - buffer &&
                projection.y > buffer && projection.y < window.innerHeight - buffer &&
                this.a / scale > 4 && this.a !== 0)
            {
                this.label.style.visibility = "visible"
                this.label.style.left = projection.x + 10 + "px"
                this.label.style.top = projection.y - 20 + "px" //+ window.scrollY
            } else {
                this.label.style.visibility = "hidden"
            }
        }
        // else {  // Visible in local space
        //     this.markerMesh.visible = false;
        //     this.realMesh.visible = true;
        //     this.realMesh.position.copy(position)
        //     this.realMesh.scale.copy(new THREE.Vector3(visualRadius, visualRadius, visualRadius))
        // }

        this.children.forEach(child => {
            if (child !== null) child.update(time, camera)
        })
    }
}

export function setFocus(newFocus) {
    focusBody = newFocus 
}

export function setScale(newScale) {
    scale = newScale
}

//https://www.cs.uaf.edu/2013/spring/cs493/lecture/01_24_vectors.html
// v1 - v2
function v3sub(v1, v2) {
    v2.multiplyScalar(-1)
    v1.add(v2)
    return v1
}

function projectToCamera(pos, camera) {
    var vector = pos.clone().project(camera)
    vector.x = (vector.x + 1)/2 * window.innerWidth
        vector.y = -(vector.y - 1)/2 * window.innerHeight
        return vector
}

function svEquals(ar1, ar2) {
    for (let i = 0; i < 3; ++i) {
        if (ar1[i] !== ar2[i]) return false
    }
    return true
}

function svAdd(ar1, ar2) {
    for (let i = 0; i < 3; ++i) {
        ar1[i] += ar2[i]
    }
    return ar1
}

function svSub(ar1, ar2) {
    return svAdd(ar1, svScalar(ar2, -1))
}

function svScalar(ar, scalar) {
    ar.forEach(function(el, i, array) {
        array[i] = el * scalar
    })
    return ar
}

function sv2r(sv) {
    return new THREE.Vector3(sv[0], sv[2], sv[1]) 
}

export function date2seconds(str)
{
    const date = new Date(str + " 00:00:00")
    return date.getTime() / 1000
}