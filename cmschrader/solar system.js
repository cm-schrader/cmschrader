import * as Render from './renderer.js'
import * as Astro from './astro.js'

const renderSystem = Render.Scene()
const scene = renderSystem.scene

// Bodies
const Sol = new Astro.Body(scene, "Sol", null, Astro.Star, 696000e+3, 1.9891e+30, 0, 0, 0, 0, 0, 0, 0xffcb3d)
const Mercury = new Astro.Body(scene, "Mercury", Sol, Astro.Planet, 2439.7e+3, 3.3011e+23, 57909050e+3, 6.35, 0.205, 210, 48.331, 29.124, 0x995532, "https://en.wikipedia.org/wiki/Mercury_(planet)")
const Venus = new Astro.Body(scene, "Venus", Sol, Astro.Planet, 6051.8e+3, 4.8675e+24, 108.209e+9, 3.395, 0.0067, 270, 54, 54, 0xffb44a)
const Earth = new Astro.Body(scene, "Earth", Sol, Astro.Planet, 6371e+3, 5.9724e+24, 149.6e+9, 1.578690, 0.0167086, 10, 174.873, 288.1, 0x345eeb)
const Mars = new Astro.Body(scene, "Mars", Sol, Astro.Planet, 3389.5e+3, 6.39e+23, 227.923e+9, 1.851, .0935, 80, 5, 6, 0xd14136)
const Vesta = new Astro.Body(scene, "Vesta", Sol, Astro.Asteroid, 262.7e+3, 2.589e+20, 353.319e+9, 5.58, .08874, 144, 103.85, 151.198, 0x394666, "https://en.wikipedia.org/wiki/4_Vesta")
const Ceres = new Astro.Body(scene, "Ceres", Sol, Astro.DwarfPlanet, 473e+3, 9.3835e+20, 414261e+6, 9.2, 0.079009, 210, 80.305, 73.597, 0x3b6370, "https://en.wikipedia.org/wiki/Ceres_(dwarf_planet)") 
const Pallas = new Astro.Body(scene, "Pallas", Sol, Astro.Asteroid, 272.5e+3, 2.04e+20, 414960772.18583e+3, 34.43, .2299, 180.1, 173.024, 310.202, 0x006656, "https://en.wikipedia.org/wiki/2_Pallas")
const Hygiea = new Astro.Body(scene, "Hygiea", Sol, Astro.Asteroid, 222e+3, 8.32e+19, 469961711e+3, 3.8316, .1125, 200, 283.2, 312.32, 0x484469, "https://en.wikipedia.org/wiki/10_Hygiea")
const Jupiter = new Astro.Body(scene, "Jupiter", Sol, Astro.Planet, 69911e+3, 1.8982e+27, 778567158e+3, .32, 0.04, 77, 100.464, 273.867, 0xeb9642)
const Saturn = new Astro.Body(scene, "Saturn", Sol, Astro.Planet, 58232e+3, 5.6834e+26, 1.433537e+12, 0.93, 0.0565, 190, 113.665, 339.392, 0xFFDEAD)
const Uranus = new Astro.Body(scene, "Uranus", Sol, Astro.Planet, 25362e+3, 8.6810e+25, 2875046678e+3, 0.99, 0.046, 235, 74.006, 96.998, 0xb0c4de)
const Neptune = new Astro.Body(scene, "Neptune", Sol, Astro.Planet, 24622e+3, 1.02413e+26, 4.49841e+12, 0.74, 0, 300, 131.784, 276.336, 0x000099)
const Pluto = new Astro.Body(scene, "Pluto", Sol, Astro.DwarfPlanet, 1188.3e+3, 1.309e+22, 5.906423e+12, 17.16, 0.2488, 163, 110.299, 113.834, 0x5F9EA0)
const Haumea = new Astro.Body(scene, "Haumea", Sol, Astro.DwarfPlanet, 780e+3, 4.006e+21, 7.717e+12, 28.2137, 0.19642, Astro.date2seconds("6/1/2133"), 122.167, 239.041, 0x486650)
const Arrokoth = new Astro.Body(scene, "Arrokoth", Sol, Astro.DwarfPlanet, 22e+3, 3e20, 6.66922267e+12, 2.4551, 0.04172, 542e4, 158.998, 174.418, 0xc27448)
const Makemake = new Astro.Body(scene, "Makemake", Sol, Astro.DwarfPlanet, 722e3, 3.1e21, 6.7962e+12, 28.9835, 0.16126, Astro.date2seconds("11/17/2186"), 79.620, 294.834, 0x9dd9ed) 
const Sedna = new Astro.Body(scene, "Sedna", Sol, Astro.DwarfPlanet, 998e+3, 8.32e+21, 7.57e+13, 11.9307, 0.8496, 170, 144.248, 311.352, 0xffc0cb, "https://en.wikipedia.org/wiki/90377_Sedna")  
const Eris = new Astro.Body(scene, "Eris", Sol, Astro.DwarfPlanet, 1163e+3, 1.6466e+22, 1.015231e+13, 44.040, 0.43607, 200, 35.951, 151.639, 0x3F6E80, "https://en.wikipedia.org/wiki/Eris_(dwarf_planet)")
const Biden = new Astro.Body(scene, "\"Biden\"", Sol, Astro.DwarfPlanet, 597e+3, 1.782e+21, 6.5246064e+13, 24.110, 0.68876, 200, 90.680, 293.62, 0x1E90FF, "https://en.wikipedia.org/wiki/2012_VP113")
const Leleākūhonua = new Astro.Body(scene, "Leleākūhonua", Sol, Astro.DwarfPlanet, 110e+3, 0, 1.6231369e+14, 11.654, 0.93997, Astro.date2seconds("6/11/2078"), 300.780, 117.778, 0xe8c697)
const Orcus = new Astro.Body(scene, "Orcus", Sol, Astro.DwarfPlanet, 910e+3, 6.348e+20, 5.860347e+12, 20.592, 0.22701, 85, 268.799, 72.310, 0x884343, "https://en.wikipedia.org/wiki/90482_Orcus")
const Gonggong = new Astro.Body(scene, "Gonggong", Sol, Astro.DwarfPlanet, 615e+3, 1.75e+21, 10.0958e+12, 30.6273, 0.49943, Astro.date2seconds("2/17/1857"), 336.8573, 207.6675, 0xa272ab, "https://en.wikipedia.org/wiki/225088_Gonggong")
const Ixion = new Astro.Body(scene, "Ixion", Sol, Astro.DwarfPlanet, 711e+3, 2e+12, 5.95429445e+12, 19.6, 0.24579, Astro.date2seconds("9/23/2070"), 71.011, 298.314, 0x929493, "https://en.wikipedia.org/wiki/28978_Ixion")
const Quaoar = new Astro.Body(scene, "Quaoar", Sol, Astro.DwarfPlanet, 555e+3, 1.4e+21, 6.537e+12, 7.9895, 0.04106, Astro.date2seconds("2/11/2075"), 188.927, 147.480, 0x60b570)
const Salacia = new Astro.Body(scene, "Salacia", Sol, Astro.DwarfPlanet, 846e+3 / 2, 4.922e+20, 6.31063658e+12, 23.921, 0.10636, 348104889, 279.880, 312.294, 0xcfc84a, "https://en.wikipedia.org/wiki/120347_Salacia")
const Varda = new Astro.Body(scene, "Varda", Sol, Astro.DwarfPlanet, 740e+3 / 2, 2.45e+20, 6.89795782e+12, 21.511, 0.14315, Astro.date2seconds("11/1/2096"), 184.151, 180.072, 0xad2d2d, "https://en.wikipedia.org/wiki/174567_Varda")
const Halley = new Astro.Body(scene, "Halley's Comet", Sol, Astro.Commet, 5.5e+3, 2.2e+14, 2.66792843e+12, 162.26, 0.96713, 0, 58.42, 111.33, 0x91d7ff)

// TODO Real Time with correct dates of perihelion
// TODO Organize scripts into Scripts folder
Render.System(Sol, renderSystem, "The Solar System") //TODO Make scaling configurable (initial and scroll diff)