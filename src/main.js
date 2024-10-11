import Renderer, { Camera, Color } from "./renderer.js"

const state = {
	/** @type {Shape[]} */
	renderObjects: [],
	/** @type {Scenes} */
	scenes: {
		default: ({ width, height, dt }) => {
			state.camera.setScale({ x: width / 10, y: height / 10 })
			state.camera.rotate(dt)
			render.camera = state.camera.toViewMatrix2D()

			render.background({ color: Color.RAYWHITE })

			render.square({
				center: { x: 0, y: 0 },
				size: 2,
				fillColor: Color.GOLD,
				type: "square",
			})
		},
	},
	camera: new Camera().setCenter({ x: 0.5, y: 0.5 }),
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

render.camera = state.camera.toViewMatrix2D()

render.textStyle({ font: "test", size: 12, color: Color.BLACK })

render.loop(state.scenes.default)
