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
	dt: number
}

type ColorStyle = string | CanvasGradient | CanvasPattern

interface TextStyle {
	color?: ColorStyle
	size?: number
	font?: string
}

interface Rectangle {
	type: "rectangle"
	center: Vec2
	size: Vec2
	rotation?: number
	fillColor?: ColorStyle
	borderColor?: ColorStyle
	borderSize?: number
}

interface Square {
	type: "square"
	center: Vec2
	size: number
	rotation?: number
	fillColor?: ColorStyle
	borderColor?: ColorStyle
	borderSize?: number
}

interface Line {
	type: "line"
	start: Vec2
	end: Vec2
	color: ColorStyle
	width?: number
}

interface Segment {
	from: Vec2
	to: Vec2
}

interface Path {
	type: "path"
	points: Vec2[] | Segment[]
	color: ColorStyle
	width?: number
}

type Shape = Line | Path | Rectangle | Square
