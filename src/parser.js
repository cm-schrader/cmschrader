import * as Astro from './astro.js'

const units = {
    // Distance
    "m": 1,
    "km": 1000,
    "Mm": 1000000,
    "Gm": 1000000000,
    "re": 6378137,      // Earth Radii
    "au": 1.496598e+11,

    // Mass
    "kg": 1,
    "me": 5.9722e+24    // Earth Mass
}

function convert(quantity) {
    return quantity.value * units[quantity.units]
}

function parse_body(scene, name, data, parent) {
    const body = new Astro.Body(
        scene,
        name,
        parent, 
        data[name].type,
        convert(data[name].radius),
        convert(data[name].mass),
        convert(data[name].semiMajor),
        data[name].inclination,
        data[name].eccentricity,
        data[name].timeOfPeriapsis,
        data[name].raan,
        data[name].argumentOfPeriapsis,
        data[name].color,
        data[name].link,
        false,
    )
    for (const child in data[name].children) {
        var childData = data[name].children[child]
        if (typeof childData == "string" || childData instanceof String) {
            console.log("LOAD NOT IMPLIMENTED: " + childData)
        } else {
            parse_body(scene, child, data[name].children, body)
        }
    }
    return body
}

export async function load_system(scene, path) {
    var body = fetch(path)
        .then((res) => {
            return res.json()
        })
        .then((data) => {
            const body = parse_body(scene, Object.keys(data)[0], data, null)
            return body
        })
    body = await body
    return body
}