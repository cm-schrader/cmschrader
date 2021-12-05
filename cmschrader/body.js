import * as THREE from 'three'

export default class Body {
    constructor(scene, radius, position) {
        this.radius = radius
        this.position = position

        this.geometry = new THREE.SphereGeometry(radius, 16, 8)
        this.material = new THREE.MeshBasicMaterial({color: 0x1122ff, wireframe: true})
        this.mesh = new THREE.Mesh(this.geometry, this.material)
        this.mesh.position.copy(position);
        scene.add(this.mesh)
    }
}