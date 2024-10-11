import { renderFpsBuffer, smoothFPS } from "./debug.js"
import { $ } from "./helpers.js"
import Renderer, { Camera, Color } from "./renderer.js"

const state = {
	/** @type {Shape[]} */
	renderObjects: [
		{
			type: "rectangle",
			center: { x: 0, y: 0 },
			size: { x: 0.01, y: 0.1 },
			fillColor: Color.DARK_GOLDEN_ROD,
		},
		{
			type: "rectangle",
			center: { x: 0, y: 0 },
			size: { x: 0.1, y: 0.01 },
			rotation: Math.PI * 0.5,
			fillColor: Color.AQUA + "88",
		},
		{
			type: "path",
			points: [
				{ x: 400, y: 400 },
				{ x: 600, y: 400 },
				{ x: 740, y: 260 },
			],
			color: Color.GOLDEN_ROD,
			width: 10,
		},
		{
			type: "path",
			points: [
				{ x: -0.5, y: -0.5 },
				{ x: -0.5, y: 0.5 },
				{ x: 0.5, y: 0.5 },
				{ x: 0.5, y: -0.5 },
			],
			color: Color.BLUE_VIOLET,
			width: 0,
		},
	],
	scenes: {
		test: info => {
			render.background()

			for (const shape of state.renderObjects)
				switch (shape.type) {
					case "rectangle":
						shape.size.x += 0.02 * info.dt
						render.rectangle(shape)
						break
					case "square":
						render.square(shape)
						break
					case "path":
						render.path(shape)
						break
				}

			render.textStyle({ color: Color.BLACK })
			render.text({ text: `FPS: ${smoothFPS(info)}`, pivot: { x: 10, y: 10 } })
			renderFpsBuffer(render)
		},
	},
	camera: new Camera().move({ x: 0.5, y: 0.5 }),
}

document.fonts.add(new FontFace("test", "url(assets/F77MinecraftRegular.woff)"))
document.fonts.ready.then(() => {
	console.log("font loaded")
	// implement loading stages, and add fons loading stage
})

const render = new Renderer({
	context: document.getElementById("canvas").getContext("2d"),
	initialSize: {
		pivot: { x: 0, y: 0 },
		size: { x: window.innerWidth, y: window.innerHeight },
	},
})

state.camera.setScale({ x: render.info.width, y: render.info.height })
render.camera = state.camera.toViewMatrix2D()

render.textStyle({ font: "test", size: 12, color: Color.BLACK })

$("#start").onclick = () => render.loop(state.scenes.test)
$("#close").onclick = () => render.stopLoop()
