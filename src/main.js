import Renderer, { Color } from "./renderer.js"

const render = new Renderer({
	context: document.getElementById("canvas").getContext("2d"),
})
render.resize({
	pivot: { x: 0, y: 0 },
	size: { x: window.innerWidth, y: window.innerHeight },
})

render.background({ color: Color.BISQUE })
render.square({
	center: { x: 0, y: 0 },
	size: { x: 200, y: 100 },
	fillColor: Color.rgb(255, 0, 0),
})
