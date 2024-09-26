interface RendererOptions {
	target: HTMLElement
	context: CanvasRenderingContext2D
	initialSize: ResizeOptions
}

/** Resizes the canvas to the given size, and optionally the parent element to the given size */
type ResizeOptions = {
	withTarget: boolean
	pivot: Vec2
	size: Vec2
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
	rotation?: number
	fillColor?: ColorStyle
	borderColor?: ColorStyle
	borderSize?: number
}

interface Line {
	start: Vec2
	end: Vec2
	color?: ColorStyle
	width?: number
}

interface Path {
	points: Vec2[]
	color?: ColorStyle
	width?: number
}
