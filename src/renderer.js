/// <reference types="../types/renderer.d.ts" />

import { warning } from "./debug.js"
import { isDefined, isSegment } from "./helpers.js"

export default class Renderer {
	/** @type {HTMLElement} */
	#target
	/** @type {CanvasRenderingContext2D} */
	#ctx

	/** @type {number} */
	#time = 0
	/**
	 * Request ID of the current animation frame.
	 * @type {?number}
	 */
	#animationFrameRequest
	/** @type {ViewMatrix2D} */
	#viewMatrix = new ViewMatrix2D()
	/** @type {?ViewMatrix2D} */
	#lastViewMatrix

	/** @param {RendererOptions} options */
	constructor(options = {}) {
		this.#target = options.target || document.body
		this.#ctx = options.context || document.createElement("canvas").getContext("2d")

		this.#target.appendChild(this.#ctx.canvas)

		if (options.initialSize) this.resize(options.initialSize)
	}

	// ---------- RENDERING FUNCTIONS ---------- //

	/** @arg {Rectangle} options */
	rectangle(options = {}) {
		if (!options.fillColor && !options.borderColor) return

		const { x: sx, y: sy } = this.#viewMatrix.scaleOf
		const rect = {
			...options,
			center: this.#viewMatrix.transformPoint(options.center),
			size: { x: options.size.x * sx, y: options.size.y * sy },
		}
		if (isDefined(options.rotation))
			rect.rotation = this.#viewMatrix.transformAngle(options.rotation)

		this.#ctx.translate(rect.center.x, rect.center.y)

		if (isDefined(rect.rotation)) this.#ctx.rotate(rect.rotation)
		if (isDefined(rect.fillColor)) {
			this.#ctx.fillStyle = rect.fillColor
			this.#ctx.fillRect(rect.size.x * -0.5, rect.size.y * -0.5, rect.size.x, rect.size.y)
		}
		if (isDefined(rect.borderColor)) {
			this.#ctx.strokeStyle = rect.borderColor
			this.#ctx.lineWidth = rect.borderSize || 2.5
			this.#ctx.strokeRect(rect.size.x * -0.5, rect.size.y * -0.5, rect.size.x, rect.size.y)
		}

		this.#ctx.setTransform(1, 0, 0, 1, 0, 0)
	}

	/** @param {Square} options */
	square({ size, ...rest } = {}) {
		this.rectangle({
			...rest,
			size: { x: size, y: size },
		})
	}

	/** @param {Path} options @todo Add camera support */
	path(options = {}) {
		if (!isDefined(options.points)) return

		this.#ctx.strokeStyle = options.color
		this.#ctx.lineWidth = options.width || 2.5

		this.#startPath()
		if (isSegment(options.points[0]))
			for (const line of options.points) {
				this.#pathFrom(line.from)
				this.#pathTo(line.to)
			}
		else {
			const [from, ...rest] = options.points
			this.#pathFrom(from)
			for (const to of rest) this.#pathTo(to)
		}
		this.#ctx.stroke()
	}

	/**
	 * Starts a new path.\
	 * Call ctx.stroke() to complete the path.
	 */
	#startPath() {
		this.#ctx.beginPath()
	}
	/** @param Vec2 */
	#pathFrom(vec) {
		const newVec = this.#viewMatrix.transformPoint(vec)
		this.#ctx.moveTo(newVec.x, newVec.y)
	}
	/** @param Vec2 */
	#pathTo(vec) {
		const newVec = this.#viewMatrix.transformPoint(vec)
		this.#ctx.lineTo(newVec.x, newVec.y)
	}

	/** @param {Line} options */
	line(options = {}) {
		this.#ctx.strokeStyle = options.color
		this.#ctx.lineWidth = options.width || 2.5

		this.#ctx.beginPath()
		this.#ctx.moveTo(options.start.x, options.start.y)
		this.#ctx.lineTo(options.end.x, options.end.y)
		this.#ctx.stroke()
	}

	/**
	 * @param {Object} options
	 * @param {ColorStyle} options.color
	 */
	background(options = { color: Color.RAYWHITE }) {
		this.#ctx.fillStyle = options.color
		this.#ctx.fillRect(0, 0, this.#ctx.canvas.width, this.#ctx.canvas.height)
	}

	/**
	 * @param {TextStyle} [options]
	 */
	textStyle(options = {}) {
		this.#ctx.fillStyle = options.color

		if (isDefined(options.size) && isDefined(options.font))
			this.#ctx.font = `${options.size}pt ${options.font}`
		else if (isDefined(options.font))
			this.#ctx.font = this.#ctx.font.replace(/(?<value>[a-zA-Z\-\_]+$)/, options.font)
		else if (isDefined(options.size))
			this.#ctx.font = this.#ctx.font.replace(/(?<value>\d+\.?\d*)/, options.size)
	}

	/**
	 * Sets the text color of the renderer, and prepares the canvas context for the next call to textString.
	 * @TODO Decide if this should implement the camera support
	 * @param {Object} options
	 * @param {string} options.text
	 * @param {Vec2} options.pivot
	 * @param {TextStyle} options.style
	 */
	text(options = {}) {
		this.#ctx.textBaseline = "top"
		this.#ctx.textAlign = "left"

		if (isDefined(options.style)) this.textStyle(options.style)

		this.#ctx.fillText(options.text, options.pivot.x, options.pivot.y)
	}

	// ---------- MISC FUNCTIONS ---------- //

	/**
	 * @param {(info: RendererInfo) => void} [fn]
	 * Calls the given function once per frame, passing the renderer's info to it.\
	 * The function passed should not block the main thread, as it will be called
	 * as often as the browser can render frames.
	 * @returns {() => void} a function that will cancel the animation frame request when called.
	 */
	loop(fn) {
		if (isDefined(this.#animationFrameRequest)) return warning("Already running")
		const innerLoop = () => {
			this.#time = Math.min(-this.#time + (this.#time = Date.now() / 1000), 0.1)
			fn(this.info)
			this.#animationFrameRequest = requestAnimationFrame(innerLoop)
		}
		innerLoop()
	}

	stopLoop() {
		cancelAnimationFrame(this.#animationFrameRequest)
		this.#animationFrameRequest = null
		this.background()
	}

	/**
	 * Resizes the canvas to the given size, and optionally the parent element to the given size
	 * @param {Object} options
	 * @param {boolean} options.withTarget - If true, resizes the parent element as well
	 * @param {Vec2} options.pivot - Position of the top left of the canvas
	 * @param {Vec2} options.size - Size of the canvas
	 */
	resize(options = {}) {
		if (!options.pivot || !options.size) return
		if (options.withTarget) {
			this.#target.style.position = "absolute"
			this.#target.style.left = options.pivot.x
			this.#target.style.top = options.pivot.y
			this.#target.style.width = options.size.x
			this.#target.style.height = options.size.y
		}
		this.#ctx.canvas.style.position = "absolute"
		this.#ctx.canvas.style.left = options.pivot.x
		this.#ctx.canvas.style.top = options.pivot.y
		this.#ctx.canvas.style.width = options.size.x
		this.#ctx.canvas.style.height = options.size.y

		this.#ctx.canvas.width = options.size.x
		this.#ctx.canvas.height = options.size.y
	}

	/** @param {boolean} value */
	set smoothing(value) {
		this.#ctx.imageSmoothingEnabled = value
	}

	/** @returns {RendererInfo} */
	get info() {
		return {
			width: this.#ctx.canvas.width,
			height: this.#ctx.canvas.height,
			dt: this.#time,
		}
	}

	/** @param {ViewMatrix2D} arg */
	set camera(arg) {
		this.#viewMatrix = arg
	}

	/** Resets camera to default. */
	defaultCamera() {
		this.#lastViewMatrix = this.#viewMatrix
		this.#viewMatrix = new ViewMatrix2D()
	}

	/** Sets camera to last used non-default camera. */
	resetCamera() {
		if (!isDefined(this.#lastViewMatrix)) return
		this.#viewMatrix = this.#lastViewMatrix
		this.#lastViewMatrix = null
	}
}

export class Camera {
	/** @type {number} */
	#rotation
	/** @type {Vec2} */
	#scale
	/** @type {Vec2} */
	#center
	/** @type {ViewMatrix2D} */
	#viewMatrix

	constructor() {
		this.#viewMatrix = new ViewMatrix2D()
		this.#rotation = 0
		this.#scale = { x: 1, y: 1 }
		this.#center = { x: 0, y: 0 }
	}

	/** @param {number} value */
	rotation(value) {
		this.#viewMatrix.rotate(value - this.#rotation)
		this.#rotation = value
		return this
	}

	/** @param {Vec2} value */
	scale(value) {
		const prevAspectRatio = this.#scale.x / this.#scale.y
		const newAspectRatio = (prevAspectRatio * value.x) / value.y
		this.#viewMatrix.scale(value.x / (this.#scale.x * newAspectRatio), value.y / this.#scale.y)
		this.#scale = value
		return this
	}

	/** @param {Vec2} value */
	setPos(value) {
		this.#viewMatrix.translate(value.x - this.#center.x, value.y - this.#center.y)
		this.#center = value
		return this
	}

	viewMatrix2D() {
		return this.#viewMatrix
	}
}

class ViewMatrix2D {
	constructor(a = 1, b = 0, c = 0, d = 1, tx = 0, ty = 0) {
		this.a = a
		this.b = b
		this.c = c
		this.d = d
		this.tx = tx
		this.ty = ty
	}

	multiply(other) {
		this.a = this.a * other.a + this.c * other.b
		this.b = this.b * other.a + this.d * other.b
		this.c = this.a * other.c + this.c * other.d
		this.d = this.b * other.c + this.d * other.d
		this.tx = this.a * other.tx + this.c * other.ty + this.tx
		this.ty = this.b * other.tx + this.d * other.ty + this.ty
	}

	translate(tx, ty) {
		this.multiply(new ViewMatrix2D(1, 0, 0, 1, tx, ty))
	}

	scale(sx, sy) {
		this.multiply(new ViewMatrix2D(sx, 0, 0, sy, 0, 0))
	}

	rotate(angle = 0) {
		const cos = Math.cos(angle)
		const sin = Math.sin(angle)
		this.multiply(new ViewMatrix2D(cos, sin, -sin, cos, 0, 0))
	}

	invert() {
		const determinant = this.a * this.d - this.b * this.c
		if (determinant === 0) {
			throw new Error("Matrix is not invertible")
		}
		this.a = this.d / determinant
		this.b = -this.b / determinant
		this.c = -this.c / determinant
		this.d = this.a / determinant
		this.tx = (this.c * this.ty - this.d * this.tx) / determinant
		this.ty = (this.b * this.tx - this.a * this.ty) / determinant
	}

	/** @param {Vec2} @returns {Vec2} */
	transformPoint({ x, y } = { x: 0, y: 0 }) {
		return {
			x: this.a * x + this.c * y + this.tx,
			y: this.b * x + this.d * y + this.ty,
		}
	}

	transformAngle(angle = 0) {
		return this.angle + angle
	}

	get angle() {
		return Math.atan2(this.b, this.a)
	}

	/** @returns {Vec2} */
	get translation() {
		return { x: this.tx, y: this.ty }
	}

	/** @returns {Vec2} */
	get scaleOf() {
		return {
			x: Math.sqrt(this.a * this.a + this.c * this.c),
			y: Math.sqrt(this.b * this.b + this.d * this.d),
		}
	}
}

export class Color {
	/**
	 * @arg {number} num
	 * @returns {ColorStyle}
	 */
	static hex(num) {
		return "#" + num.toString(16).padStart(3, "f")
	}

	/**
	 * @arg {number} r
	 * @arg {number} g
	 * @arg {number} b
	 * @returns {ColorStyle}
	 */
	static rgb(r, g, b) {
		return `rgb(${r},${g},${b})`
	}

	/**
	 * @arg {number} r
	 * @arg {number} g
	 * @arg {number} b
	 * @arg {number} a
	 * @returns {ColorStyle}
	 */
	static rgba(r, g, b, a) {
		return `rgba(${r},${g},${b},${a || 1})`
	}

	/**
	 * @param {number} h
	 * @param {number} s
	 * @param {number} l
	 * @returns {ColorStyle}
	 */
	static shl(h, s, l) {
		return `hsl(${h},${s}%,${l}%)`
	}

	/**
	 * @param {number} h
	 * @param {number} s
	 * @param {number} l
	 * @param {number} a
	 * @returns {ColorStyle}
	 */
	static shla(h, s, l, a) {
		return `hsla(${h},${s}%,${l}%,${a || 1})`
	}

	static ERROR = "#80F"
	static RAYWHITE = "#FAFAFA"
	static ALICE_BLUE = "#F0F8FF"
	static ANTIQUE_WHITE = "#FAEBD7"
	static AQUA = "#00FFFF"
	static AQUAMARINE = "#7FFFD4"
	static AZURE = "#F0FFFF"
	static BEIGE = "#F5F5DC"
	static BISQUE = "#FFE4C4"
	static BLACK = "#000000"
	static BLANCHED_ALMOND = "#FFEBCD"
	static BLUE = "#0000FF"
	static BLUE_VIOLET = "#8A2BE2"
	static BROWN = "#A52A2A"
	static BURLY_WOOD = "#DEB887"
	static CADET_BLUE = "#5F9EA0"
	static CHARTREUSE = "#7FFF00"
	static CHOCOLATE = "#D2691E"
	static CORAL = "#FF7F50"
	static CORNFLOWER_BLUE = "#6495ED"
	static CORNSILK = "#FFF8DC"
	static CRIMSON = "#DC143C"
	static CYAN = "#00FFFF"
	static DARK_BLUE = "#00008B"
	static DARK_CYAN = "#008B8B"
	static DARK_GOLDEN_ROD = "#B8860B"
	static DARK_GRAY = "#A9A9A9"
	static DARK_GREY = "#A9A9A9"
	static DARK_GREEN = "#006400"
	static DARK_KHAKI = "#BDB76B"
	static DARK_MAGENTA = "#8B008B"
	static DARK_OLIVE_GREEN = "#556B2F"
	static DARK_ORANGE = "#FF8C00"
	static DARK_ORCHID = "#9932CC"
	static DARK_RED = "#8B0000"
	static DARK_SALMON = "#E9967A"
	static DARK_SEA_GREEN = "#8FBC8F"
	static DARK_SLATE_BLUE = "#483D8B"
	static DARK_SLATE_GRAY = "#2F4F4F"
	static DARK_SLATE_GREY = "#2F4F4F"
	static DARK_TURQUOISE = "#00CED1"
	static DARK_VIOLET = "#9400D3"
	static DEEP_PINK = "#FF1493"
	static DEEP_SKY_BLUE = "#00BFFF"
	static DIM_GRAY = "#696969"
	static DIM_GREY = "#696969"
	static DODGER_BLUE = "#1E90FF"
	static FIRE_BRICK = "#B22222"
	static FLORAL_WHITE = "#FFFAF0"
	static FOREST_GREEN = "#228B22"
	static FUCHSIA = "#FF00FF"
	static GAINSBORO = "#DCDCDC"
	static GHOST_WHITE = "#F8F8FF"
	static GOLD = "#FFD700"
	static GOLDEN_ROD = "#DAA520"
	static GRAY = "#808080"
	static GREY = "#808080"
	static GREEN = "#008000"
	static GREEN_YELLOW = "#ADFF2F"
	static HONEY_DEW = "#F0FFF0"
	static HOT_PINK = "#FF69B4"
	static INDIAN_RED = "#CD5C5C"
	static INDIGO = "#4B0082"
	static IVORY = "#FFFFF0"
	static KHAKI = "#F0E68C"
	static LAVENDER = "#E6E6FA"
	static LAVENDER_BLUSH = "#FFF0F5"
	static LAWN_GREEN = "#7CFC00"
	static LEMON_CHIFFON = "#FFFACD"
	static LIGHT_BLUE = "#ADD8E6"
	static LIGHT_CORAL = "#F08080"
	static LIGHT_CYAN = "#E0FFFF"
	static LIGHT_GOLDEN_ROD_YELLOW = "#FAFAD2"
	static LIGHT_GRAY = "#D3D3D3"
	static LIGHT_GREY = "#D3D3D3"
	static LIGHT_GREEN = "#90EE90"
	static LIGHT_PINK = "#FFB6C1"
	static LIGHT_SALMON = "#FFA07A"
	static LIGHT_SEA_GREEN = "#20B2AA"
	static LIGHT_SKY_BLUE = "#87CEFA"
	static LIGHT_SLATE_GRAY = "#778899"
	static LIGHT_SLATE_GREY = "#778899"
	static LIGHT_STEEL_BLUE = "#B0C4DE"
	static LIGHT_YELLOW = "#FFFFE0"
	static LIME = "#00FF00"
	static LIME_GREEN = "#32CD32"
	static LINEN = "#FAF0E6"
	static MAGENTA = "#FF00FF"
	static MAROON = "#800000"
	static MEDIUM_AQUA_MARINE = "#66CDAA"
	static MEDIUM_BLUE = "#0000CD"
	static MEDIUM_ORCHID = "#BA55D3"
	static MEDIUM_PURPLE = "#9370DB"
	static MEDIUM_SEA_GREEN = "#3CB371"
	static MEDIUM_SLATE_BLUE = "#7B68EE"
	static MEDIUM_SPRING_GREEN = "#00FA9A"
	static MEDIUM_TURQUOISE = "#48D1CC"
	static MEDIUM_VIOLET_RED = "#C71585"
	static MIDNIGHT_BLUE = "#191970"
	static MINT_CREAM = "#F5FFFA"
	static MISTY_ROSE = "#FFE4E1"
	static MOCCASIN = "#FFE4B5"
	static NAVajo_WHITE = "#FFDEAD"
	static NAVY = "#000080"
	static OLD_LACE = "#FDF5E6"
	static OLIVE = "#808000"
	static OLIVE_DRAB = "#6B8E23"
	static ORANGE = "#FFA500"
	static ORANGE_RED = "#FF4500"
	static ORCHID = "#DA70D6"
	static PALE_GOLDEN_ROD = "#EEE8AA"
	static PALE_GREEN = "#98FB98"
	static PALE_TURQUOISE = "#AFEEEE"
	static PALE_VIOLET_RED = "#DB7093"
	static PAPAYA_WHIP = "#FFEFD5"
	static PEACH_PUFF = "#FFDAB9"
	static PERU = "#CD853F"
	static PINK = "#FFC0CB"
	static PLUM = "#DDA0DD"
	static POWDER_BLUE = "#B0E0E6"
	static PURPLE = "#800080"
	static REBECCA_PURPLE = "#663399"
	static RED = "#FF0000"
	static ROSY_BROWN = "#BC8F8F"
	static ROYAL_BLUE = "#4169E1"
	static SADDLE_BROWN = "#8B4513"
	static SALMON = "#FA8072"
	static SANDY_BROWN = "#F4A460"
	static SEA_GREEN = "#2E8B57"
	static SEA_SHELL = "#FFF5EE"
	static SIENNA = "#A0522D"
	static SILVER = "#C0C0C0"
	static SKY_BLUE = "#87CEEB"
	static SLATE_BLUE = "#6A5ACD"
	static SLATE_GRAY = "#708090"
	static SLATE_GREY = "#708090"
	static SNOW = "#FFFAFA"
	static SPRING_GREEN = "#00FF7F"
	static STEEL_BLUE = "#4682B4"
	static TAN = "#D2B48C"
	static TEAL = "#008080"
	static THISTLE = "#D8BFD8"
	static TOMATO = "#FF6347"
	static TURQUOISE = "#40E0D0"
	static VIOLET = "#EE82EE"
	static WHEAT = "#F5DEB3"
	static WHITE = "#FFFFFF"
	static WHITE_SMOKE = "#F5F5F5"
	static YELLOW = "#FFFF00"
	static YELLOW_GREEN = "#9ACD32"
}
