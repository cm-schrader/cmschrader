import * as Render from '../../renderer.js'
import * as Astro from '../../astro.js'

const renderSystem = Render.Scene()
const scene = renderSystem.scene
const Re = 6378100 // Radius of the Earth
const Me = 5.972e+24 // Mass of the Earth
const Au = 1.496e+11

// Bodies
// TODO Planet radius and mass stuff from wolf todos, all masses and radii are wrong
const Osiris = new Astro.Body(scene, "", null, Astro.Planet, 3.0964*Re, 43.9072*Me, 1.8450*Au, 6.5, 0.1067086, 25000000, 320.873, 20.1, 0x349e6b)
// The moons of Osiris are named for the Assessors of Maat (the 42 Judges) https://en.wikipedia.org/wiki/Assessors_of_Maat
const Strider = new Astro.Body(scene, "Strider", Osiris, Astro.Moon, 3126.6e+3, 4.799844e+22, 670900e+3, 2, .009, 500, 4.873, .1, 0xd8db27, null, true)
const Embracer = new Astro.Body(scene, "Embracer", Osiris, Astro.Moon, 2126.6e+3, 1.799844e+22, 320900e+3, -1, .09, 50200, 114.873, .1, 0x58db27, null, true)
const Breaker = new Astro.Body(scene, "Breaker", Osiris, Astro.Moon, 1526.6e+3, 1.799844e+22, 150900e+3, -10, .15, 5029900, 221.873, 66.1, 0xee3b27, null, true)
const Commander = new Astro.Body(scene, "Commander", Osiris, Astro.Moon, 1526.6e+3, 1.799844e+22, 1880900e+3, 60, .005, 6600, 321.873, 366.1, 0x7e3be7, null, true)
// Accuser
// Owner
// Disturber
// Demolisher
// Eater

Render.System(Osiris, renderSystem, "The Osiris System", 5e6, .01*86400/1000, 1e1, 400, true) 