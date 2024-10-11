import { _enum, iota, isDefined } from "./helpers.js"
import Renderer, { Color } from "./renderer.js"

export const LOG_LEVELS = _enum({
	CRITICAL: iota(),
	ERROR: iota(),
	WARN: iota(),
	DEBUG: iota(),
	INFO: iota(),
	NONE: iota(),
})

export const LOG_LEVEL = LOG_LEVELS.DEBUG // - OR WORSE

let fpsIndex = 0
export const fpsBuffer = new Uint8Array(512)

function measureFps(buf = [], fps = 0) {
	if (isDefined(fps) && (fps = localStorage.getItem("screenFPS"))) return fps
	if (buf.length >= 32) {
		buf.shift()
		fpsBuffer.fill(buf.reduce((a, b) => a + b, 0) / buf.length)
		return
	}
	const time = Date.now() / 1000
	requestAnimationFrame(() => (buf.push(1 / (Date.now() / 1000 - time)), measureFps(buf, fps)))
}
measureFps()

/** @param {Renderer} render */
export function renderFpsBuffer(render) {
	const { height } = render.info
	/** @type {Vec2} */
	const size = { x: 512, y: 256 }

	render.defaultCamera()

	render.smoothing = false

	render.rectangle({
		center: { x: size.x * 0.5, y: height + size.y * 0.5 },
		color: Color.LIGHT_STEEL_BLUE,
		size,
	})

	render.path({
		points: Array.from(fpsBuffer).map((v, i) => ({
			from: { x: i, y: height },
			to: { x: i, y: height - v },
		})),
		color: Color.INDIAN_RED,
		width: 1,
	})
	render.line({
		start: { x: fpsIndex, y: height },
		end: { x: fpsIndex, y: height - fpsBuffer[fpsIndex - 1] },
		color: Color.STEEL_BLUE,
		width: 1,
	})

	render.smoothing = true

	render.resetCamera()
}

export const smoothFPS = (() => {
	return info => {
		if (fpsIndex === 512) fpsIndex = 0
		fpsBuffer[fpsIndex++] = 1 / info.dt
		return (fpsBuffer.reduce((a, b) => a + b, 0) / 512).toFixed(1)
	}
})()

/**
 * @param {Object} param0
 * @param {any} param0.value
 * @param {typeof LOG_LEVELS[keyof typeof LOG_LEVELS]} param0.logLevel
 * @returns
 */
export function defaultValue({ value, logLevel }) {
	return LOG_LEVEL === logLevel ? value : undefined
}

export const info = LOG_LEVEL <= LOG_LEVELS.INFO ? console.info : (..._) => {}
export const debug = LOG_LEVEL <= LOG_LEVELS.DEBUG ? console.debug : (..._) => {}
export const warning = LOG_LEVEL <= LOG_LEVELS.WARN ? console.warn : (..._) => {}
export const error = LOG_LEVEL <= LOG_LEVELS.ERROR ? console.error : (..._) => {}
export const critical =
	LOG_LEVEL <= LOG_LEVELS.CRITICAL
		? (...args) => console.error("CRITICAL ERROR:", ...args)
		: (..._) => {}
