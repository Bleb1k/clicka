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

document.fonts.add(new FontFace("test", "url(assets/F77MinecraftRegular.woff)"))
document.fonts.ready.then(() => {
	console.log("font loaded")
})

const render = new Renderer({
	context: document.getElementById("canvas").getContext("2d"),
	initialSize: {
		pivot: { x: 0, y: 0 },
		size: { x: window.innerWidth, y: window.innerHeight },
	},
})

render.textStyle({ font: "test", size: 12, color: Color.BLACK })

render.loop(info => {
	render.background()

	for (const platform of state.platforms) {
		render.square({ ...platform })
	}

	render.text({ text: `FPS: ${(1 / info.dt).toFixed(0)}`, pivot: { x: 10, y: 10 } })
})

// this becomes cluttered fast, no structure, no goal... I need to go sleep...