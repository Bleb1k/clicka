import Renderer, { Color } from "./renderer.js"

const state = {
	/** @type {(Square|Line)[]} */
	platforms: [
		{
			center: { x: 500, y: 500 },
			size: { x: 200, y: 10 },
			fillColor: Color.DARK_GOLDEN_ROD,
		},
		{
			center: { x: 670, y: 430 },
			size: { x: 200, y: 10 },
			rotation: -Math.atan(1),
			fillColor: Color.DARK_GOLDEN_ROD,
		},
	],
}

const render = new Renderer({
	context: document.getElementById("canvas").getContext("2d"),
	initialSize: {
		pivot: { x: 0, y: 0 },
		size: { x: window.innerWidth, y: window.innerHeight },
	},
})

render.loop(info => {
	render.background({ color: Color.RAYWHITE })
	for (const platform of state.platforms) {
		render.square({ ...platform })
	}
})
