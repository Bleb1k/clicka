interface RendererOptions {
	target: HTMLElement
	context: CanvasRenderingContext2D
}

interface RendererInfo {
	width: number
	height: number
}

interface Vec2 {
	x: number
	y: number
}
type ColorStyle = string | CanvasGradient | CanvasPattern

interface Square {
	center: Vec2
	size: Vec2
	rotation?: Vec2
	fillColor?: ColorStyle
	borderColor?: ColorStyle
}

