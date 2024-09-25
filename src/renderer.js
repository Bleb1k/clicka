/// <reference types="../types/renderer.d.ts" />

export default class Renderer {
	/** @type {HTMLElement} */
	static #globalTarget = document.body
	/** @type {HTMLElement} */
	#target
	/** @type {CanvasRenderingContext2D} */
	static #globalContext = document.createElement("canvas").getContext("2d")
	/** @type {CanvasRenderingContext2D} */
	#context
	/** @arg {RendererOptions} options */

	constructor(options = {}) {
		this.#target = options.target || Renderer.#globalTarget
		this.#context = options.context || Renderer.#globalContext

		this.#target.appendChild(this.#context.canvas)
	}

	/** @arg {Square} arg */
	square(arg = { color: Color.ERROR }) {
		this.#context.fillStyle = arg.color
		this.#context.fillRect(arg.pos.x, arg.pos.y, arg.size.x, arg.size.y)
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

	static ERROR = "#80f"
	static RAYWHITE = "#fafafa"
	static ALICE_BLUE = "aliceblue"
	static ANTIQUE_WHITE = "antiquewhite"
	static AQUA = "aqua"
	static AQUAMARINE = "aquamarine"
	static AZURE = "azure"
	static BEIGE = "beige"
	static BISQUE = "bisque"
	static BLACK = "black"
	static BLANCHED_ALMOND = "blanchedalmond"
	static BLUE = "blue"
	static BLUE_VIOLET = "blueviolet"
	static BROWN = "brown"
	static BURLY_WOOD = "burlywood"
	static CADET_BLUE = "cadetblue"
	static CHARTREUSE = "chartreuse"
	static CHOCOLATE = "chocolate"
	static CORAL = "coral"
	static CORNFLOWER_BLUE = "cornflowerblue"
	static CORNSILK = "cornsilk"
	static CRIMSON = "crimson"
	static CYAN = "cyan"
	static DARK_BLUE = "darkblue"
	static DARK_CYAN = "darkcyan"
	static DARK_GOLDEN_ROD = "darkgoldenrod"
	static DARK_GRAY = "darkgray"
	static DARK_GREY = "darkgrey"
	static DARK_GREEN = "darkgreen"
	static DARK_KHAKI = "darkkhaki"
	static DARK_MAGENTA = "darkmagenta"
	static DARK_OLIVE_GREEN = "darkolivegreen"
	static DARK_ORANGE = "darkorange"
	static DARK_ORCHID = "darkorchid"
	static DARK_RED = "darkred"
	static DARK_SALMON = "darksalmon"
	static DARK_SEA_GREEN = "darkseagreen"
	static DARK_SLATE_BLUE = "darkslateblue"
	static DARK_SLATE_GRAY = "darkslategray"
	static DARK_SLATE_GREY = "darkslategrey"
	static DARK_TURQUOISE = "darkturquoise"
	static DARK_VIOLET = "darkviolet"
	static DEEP_PINK = "deeppink"
	static DEEP_SKY_BLUE = "deepskyblue"
	static DIM_GRAY = "dimgray"
	static DIM_GREY = "dimgray"
	static DODGER_BLUE = "dodgerblue"
	static FIRE_BRICK = "firebrick"
	static FLORAL_WHITE = "floralwhite"
	static FOREST_GREEN = "forestgreen"
	static FUCHSIA = "fuchsia"
	static GAINSBORO = "gainsboro"
	static GHOST_WHITE = "ghostwhite"
	static GOLD = "gold"
	static GOLDEN_ROD = "goldenrod"
	static GRAY = "gray"
	static GREY = "grey"
	static GREEN = "green"
	static GREEN_YELLOW = "greenyellow"
	static HONEY_DEW = "honeydew"
	static HOT_PINK = "hotpink"
	static INDIAN_RED = "indianred"
	static INDIGO = "indigo"
	static IVORY = "ivory"
	static KHAKI = "khaki"
	static LAVENDER = "lavender"
	static LAVENDER_BLUSH = "lavenderblush"
	static LAWN_GREEN = "lawngreen"
	static LEMON_CHIFFON = "lemonchiffon"
	static LIGHT_BLUE = "lightblue"
	static LIGHT_CORAL = "lightcoral"
	static LIGHT_CYAN = "lightcyan"
	static LIGHT_GOLDEN_ROD_YELLOW = "lightgoldenrodyellow"
	static LIGHT_GRAY = "lightgray"
	static LIGHT_GREY = "lightgrey"
	static LIGHT_GREEN = "lightgreen"
	static LIGHT_PINK = "lightpink"
	static LIGHT_SALMON = "lightsalmon"
	static LIGHT_SEA_GREEN = "lightseagreen"
	static LIGHT_SKY_BLUE = "lightskyblue"
	static LIGHT_SLATE_GRAY = "lightslategray"
	static LIGHT_SLATE_GREY = "lightslategrey"
	static LIGHT_STEEL_BLUE = "lightsteelblue"
	static LIGHT_YELLOW = "lightyellow"
	static LIME = "lime"
	static LIME_GREEN = "limegreen"
	static LINEN = "linen"
	static MAGENTA = "magenta"
	static MAROON = "maroon"
	static MEDIUM_AQUA_MARINE = "mediumaquamarine"
	static MEDIUM_BLUE = "mediumblue"
	static MEDIUM_ORCHID = "mediumorchid"
	static MEDIUM_PURPLE = "mediumpurple"
	static MEDIUM_SEA_GREEN = "mediumseagreen"
	static MEDIUM_SLATE_BLUE = "mediumslateblue"
	static MEDIUM_SPRING_GREEN = "mediumspringgreen"
	static MEDIUM_TURQUOISE = "mediumturquoise"
	static MEDIUM_VIOLET_RED = "mediumvioletred"
	static MIDNIGHT_BLUE = "midnightblue"
	static MINT_CREAM = "mintcream"
	static MISTY_ROSE = "mistyrose"
	static MOCCASIN = "moccasin"
	static NAVY = "navy"
	static OLD_LACE = "oldlace"
	static OLIVE = "olive"
	static OLIVE_DRAB = "olivedrab"
	static ORANGE = "orange"
	static ORANGE_RED = "orangered"
	static ORCHID = "orchid"
	static PALE_GOLDEN_ROD = "palegoldenrod"
	static PALE_GREEN = "palegreen"
	static PALE_TURQUOISE = "paleturquoise"
	static PALE_VIOLET_RED = "palevioletred"
	static PAPAYA_WHIP = "papayawhip"
	static PEACH_PUFF = "peachpuff"
	static PERU = "peru"
	static PINK = "pink"
	static PLUM = "plum"
	static POWDER_BLUE = "powderblue"
	static PURPLE = "purple"
	static REBECCA_PURPLE = "rebeccapurple"
	static RED = "red"
	static ROSY_BROWN = "rosybrown"
	static ROYAL_BLUE = "royalblue"
	static SADDLE_BROWN = "saddlebrown"
	static SALMON = "salmon"
	static SANDY_BROWN = "sandybrown"
	static SEA_GREEN = "seagreen"
	static SEA_SHELL = "seashell"
	static SIENNA = "sienna"
	static SILVER = "silver"
	static SKY_BLUE = "skyblue"
	static SLATE_BLUE = "slateblue"
	static SLATE_GRAY = "slategray"
	static SLATE_GREY = "slategrey"
	static SNOW = "snow"
	static SPRING_GREEN = "springgreen"
	static STEEL_BLUE = "steelblue"
	static TAN = "tan"
	static TEAL = "teal"
	static THISTLE = "thistle"
	static TOMATO = "tomato"
	static TURQUOISE = "turquoise"
	static VIOLET = "violet"
	static WHEAT = "wheat"
	static WHITE = "white"
	static WHITE_SMOKE = "whitesmoke"
	static YELLOW = "yellow"
	static YELLOW_GREEN = "yellowgreen"
}
