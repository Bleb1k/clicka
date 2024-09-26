/// <reference types="../types/renderer.d.ts" />

import { isDefined } from "./helpers.js"

export default class Renderer {
	/** @type {HTMLElement} */
	static #globalTarget = document.body
	/** @type {HTMLElement} */
	#target
	/** @type {CanvasRenderingContext2D} */
	static #globalContext = document.createElement("canvas").getContext("2d")
	/** @type {CanvasRenderingContext2D} */
	#ctx

	/** @param {RendererOptions} options */
	constructor(options = {}) {
		this.#target = options.target || Renderer.#globalTarget
		this.#ctx = options.context || Renderer.#globalContext

		this.#target.appendChild(this.#ctx.canvas)
	}

	// ---------- RENDERING FUNCTIONS ---------- //

	/**
	 * Draws a square
	 * @arg {Square} options
	 */
	square(options = {}) {
		if (!options.fillColor && !options.borderColor) return

		this.#ctx.translate(options.center.x, options.center.y)

		if (isDefined(options.rotation)) this.#ctx.rotate(options.rotation)
		if (isDefined(options.fillColor)) {
			this.#ctx.fillStyle = options.fillColor
			this.#ctx.fillRect(
				options.size.x * -0.5,
				options.size.y * -0.5,
				options.size.x,
				options.size.y
			)
		}
		if (isDefined(options.borderColor)) {
			this.#ctx.strokeStyle = options.borderColor
			this.#ctx.strokeRect(
				options.size.x * -0.5,
				options.size.y * -0.5,
				options.size.x,
				options.size.y
			)
		}

		this.#ctx.setTransform(1, 0, 0, 1, 0, 0)
	}

	/**
	 *
	 * @param {Object} options
	 * @param {ColorStyle} options.color
	 */
	background(options = { color: Color.RAYWHITE }) {
		this.#ctx.fillStyle = options.color
		this.#ctx.fillRect(0, 0, this.#ctx.canvas.width, this.#ctx.canvas.height)
	}

	// ---------- MISC FUNCTIONS ---------- //

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

	/** @returns {RendererInfo} */
	get info() {
		return {
			width: this.#ctx.canvas.width,
			height: this.#ctx.canvas.height,
		}
	}
}

/**
 * Please use cautiously, string manipulation in js is expensive\
 * Prefer using CONSTANT or predefined colors if possible\
 * Or create your own css color string manually
 */
export class Color {
	/** @arg {number} num @returns {ColorStyle} */
	static hex(num) {
		return "#" + num.toString(16).padStart(3, "f")
	}
	/** numbers in range: 0-255 @arg {number} r @arg {number} g @arg {number} b @returns {ColorStyle} */
	static rgb(r, g, b) {
		return `rgb(${r},${g},${b})`
	}
	/** numbers in range: 0-255 @arg {number} r @arg {number} g @arg {number} b @returns {ColorStyle} */
	static rgba(r, g, b, a) {
		return `rgba(${r},${g},${b},${a})`
	}
	/**
	 * @param {number} h Hue in degrees
	 * @param {number} s Saturation in percent
	 * @param {number} l Lightness in percent
	 * @returns {ColorStyle}
	 */
	static shl(h, s, l) {
		return `hsl(${h},${s}%,${l}%)`
	}
	/**
	 * @param {number} h Hue in degrees
	 * @param {number} s Saturation in percent
	 * @param {number} l Lightness in percent
	 * @param {number} a Alpha in percent
	 * @returns {ColorStyle}
	 */
	static shla(h, s, l, a) {
		return `hsla(${h},${s}%,${l}%,${a})`
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
