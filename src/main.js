import Renderer from "./renderer.js"

const render = new Renderer()

render.square({
	pivot: { x: 200, y: 100 },
	size: { x: 100, y: 100 },
})
