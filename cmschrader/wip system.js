import * as Render from './renderer.js'
import * as Astro from './astro.js'

const renderSystem = Render.Scene()
const scene = renderSystem.scene

// Bodies
const Wip = new Astro.Body(scene, "Wip", null, Astro.Star, 696000e+3, 1.9891e+30, 0, 0, 0, 0, 0, 0, 0xffffff)
const JavaScript = new Astro.Body(scene, "JavaScript", Wip, Astro.Planet, 2439.7e+3, 3.3011e+23, 57909050e+3, 6.35, 0.205, 120583900222, 48.331, 29.124, 0xefd81d)
const HTML = new Astro.Body(scene, "HTML", Wip, Astro.Planet, 6051.8e+3, 4.8675e+24, 108.209e+9, 3.395, 0.0067, 651480185570, 54, 54, 0xdd4b25)
const CSS = new Astro.Body(scene, "CSS", Wip, Astro.Planet, 6371e+3, 5.9724e+24, 149.6e+9, 1.578690, 0.0167086, 25000000, 174.873, 288.1, 0x264de4)
Render.System(Wip, renderSystem, "The Work in Progress System") 