import { renderFpsBuffer, smoothFPS } from "./debug.js"
import { $ } from "./helpers.js"
import Renderer, { Color } from "./renderer.js"

const state = {
	/** @type {Shape[]} */
	renderObjects: [
		{
			type: "rectangle",
			center: { x: 500, y: 500 },
			size: { x: 200, y: 10 },
			fillColor: Color.DARK_GOLDEN_ROD,
		},
		{
			type: "rectangle",
			center: { x: 670, y: 430 },
			size: { x: 200, y: 10 },
			rotation: -Math.atan(1),
			fillColor: Color.DARK_GOLDEN_ROD,
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
	],
	scenes: {
		test: info => {
			render.background()

			for (const platform of state.renderObjects)
				switch (platform.type) {
					case "rectangle":
						render.rectangle(platform)
						break
					case "square":
						render.square(platform)
						break
					case "path":
						render.path(platform)
						break
				}

			render.text({ text: `FPS: ${smoothFPS(info)}`, pivot: { x: 10, y: 10 } })
			renderFpsBuffer(render)
		},
	},
}

document.fonts.add(new FontFace("test", "url(assets/F77MinecraftRegular.woff)"))
document.fonts.ready.then(() => {
	console.log("font loaded")
	// implement loading stages, and handle fons there
})

const render = new Renderer({
	context: document.getElementById("canvas").getContext("2d"),
	initialSize: {
		pivot: { x: 0, y: 0 },
		size: { x: window.innerWidth, y: window.innerHeight },
	},
})

render.textStyle({ font: "test", size: 12, color: Color.BLACK })

$("#start").onclick = () => render.loop(state.scenes.test)

$("#close").onclick = () => render.stopLoop()

