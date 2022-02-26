import * as Render from '../renderer.js'
import * as Astro from '../astro.js'

const renderSystem = Render.Scene()
const scene = renderSystem.scene
const Re = 6378100 // Radius of the Earth
const Me = 5.972e+24 // Mass of the Earth
const Au = 1.496e+11

// Bodies
// TODO Make function to compute mass based off of radius
// TODO Change radii to better match planets
// TODO Make planet links go to planetary systems
const Wolf = new Astro.Body(scene, "Wolf 359", null, Astro.Star, .16*696000e+3, .9*1.9891e+30, 0, 0, 0, 0, 0, 0, 0xeb4034, null, true)
const Earth = new Astro.Body(scene, "Earth (for Comparison, null, true)", Wolf, Astro.Planet, Re, Me, Au, 1.578690, 0.0167086, 10, 174.873, 288.1, 0x141e1b, null, true)

const Thoth = new Astro.Body(scene, "Thoth", Wolf, Astro.Planet, Re*1.2, Me*2, Au*.055, 1.578690, 0.0067086, 10, 204.873, 88.1, 0x264de4, null, true)
// The capital of Wolf

const Horus = new Astro.Body(scene, "Horus", Wolf, Astro.Planet, 3.0964*Re, 43.9072*Me, .085*Au, -1, 0.06, 2000, 110, 120.1, 0xcccccc, null, true)
// Horus is a Class IV gas giant rich in carbon monoxide and iron vapour which casues its gray color.
// The moons of Horus are named for the four sons of Horus
// Duamutef
// Hapy
// Imset
// Qebehsenuef

const Ishtar = new Astro.Body(scene, "Ishtar", Wolf, Astro.Planet, Re*1.2, Me*2, Au*.135, 1.578690, 0.0067086, 10, 204.873, 88.1, 0x8f0e04, null, true)
// Ishtar is similar to Venus with it's heavy atmosphere.  

const Osiris = new Astro.Body(scene, "Osiris", Wolf, Astro.Planet, 3.0964*Re, 43.9072*Me, 1.8450*Au, 6.5, 0.1067086, 25000000, 320.873, 20.1, 0x349e6b, "osiris/", true)
// The moons of Osiris are named for the Assessors of Maat (the 42 Judges) https://en.wikipedia.org/wiki/Assessors_of_Maat
// Strider
// Embracer
// Breaker
// Commander
// Accuser
// Owner
// Disturber
// Demolisher
// Eater

const AmunRa = new Astro.Body(scene, "Amun-Ra", Wolf, Astro.Planet, .6*2*Re, .3*2*Me, .8*Au, -1, 0.1067086, 2500, 4.873, .1, 0xd8db27, null, true)
const Anubis = new Astro.Body(scene, "Anubis", Wolf, Astro.Planet, .2*Re, .05*Me, 5*Au, -16, 0.5067086, 2220, 300.873, 1500.1, 0x555555, null, true)
Render.System(Wolf, renderSystem, "The Wolf 359 System", 25e7, .1*86400/1000, 1e3, 100) 