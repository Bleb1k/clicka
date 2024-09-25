
interface RendererOptions {
	target: HTMLElement;
	context: CanvasRenderingContext2D;
}

interface Vec2 {
	x: number;
	y: number;
}
type ColorStyle = string | CanvasGradient | CanvasPattern;

interface Square {
	pos: Vec2;
	size: Vec2;
	color: ColorStyle;
	border: ColorStyle;
}