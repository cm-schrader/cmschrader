import * as Render from '../renderer.js'
import * as Astro from '../astro.js'

const renderSystem = Render.Scene()
const scene = renderSystem.scene

// Bodies
const Missing = new Astro.Body(scene, "Missing", null, Astro.Star, 696000e+3, 1.9891e+30, 0, 0, 0, 0, 0, 0, 0x000000)
Render.System(Missing, renderSystem, "Interstellar Space", 1, .001, 1e4, 25) 