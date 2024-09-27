import { _enum, iota } from "./helpers.js"
import Renderer, { Color } from "./renderer.js"

export const fpsBuffer = new Uint8Array(512).fill(0)
let fpsIndex = 0

/** @param {Renderer} render */
export function renderFpsBuffer(render) {
	const { width, height } = render.info
	/** @type {Vec2} */
	const size = { x: 512, y: 256 }

	render.smoothing = false

	render.rectangle({
		center: { x: size.x * 0.5, y: height + size.y * 0.5 },
		color: Color.LIGHT_STEEL_BLUE,
		size,
	})

	render.path({
		points: fpsBuffer.map((v, i) => [
			{ x: i, y: height },
			{ x: i, y: height - v },
		]),
		color: Color.INDIAN_RED,
		width: 2,
	})

	render.smoothing = true
}

export const smoothFPS = (() => {
	return info => {
		if (fpsIndex === 512) fpsIndex = 0
		fpsBuffer[fpsIndex++] = 1 / info.dt
		return (fpsBuffer.reduce((a, b) => a + b, 0) / 512).toFixed(1)
	}
})()

export const LOG_LEVELS = _enum({
	NONE: iota(),
	INFO: iota(),
	DEBUG: iota(),
	WARN: iota(),
	ERROR: iota(),
	CRITICAL: iota(),
})

export const LOG_LEVEL = LOG_LEVELS.INFO

/**
 * @param {Object} param0
 * @param {any} param0.value
 * @param {typeof LOG_LEVELS[keyof typeof LOG_LEVELS]} param0.logLevel
 * @returns
 */
export function defaultValue({ value, logLevel }) {
	return LOG_LEVEL === logLevel ? value : undefined
}
