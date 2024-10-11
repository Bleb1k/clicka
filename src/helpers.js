/// <reference types="../types/helpers.d.ts" />

export const iota = (() => {
	let count = 0
	return () => count++
})() // like in go

export const $ = document.querySelector.bind(document)

/** @type {(fn: number) => void} */
export const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))
/** @type {(fn: AsyncFunction<void>) => void} */
export const spawn = fn => new Promise(async resolve => (await fn(), resolve()))

export function isDefined(val) {
	return val !== undefined && val !== null
}

/**
 * @param {Segment | unknown} val
 * @returns {boolean}
 */
export function isSegment(val) {
	return isDefined(val) && val.from !== undefined && val.to !== undefined
}

export function pipe(...fns) {
	return x => fns.reduce((v, f) => f(v), x)
}

/**
 * @example
 * // iota is exported while below has broken autocomplete
 * const a = _enum({ foo: iota(), bar: iota(), baz: iota() })
 * // the same as above, but breaks autocomplete
 * const b = _enum("foo", "bar", "baz")
 * @template T
 * @param {T} arr
 * @returns {Enum<T>}
 */
export function _enum(...arr) {
	return Object.freeze(
		Object.fromEntries(
			arr.length === 1 && typeof arr[0] === "object"
				? Object.entries(arr[0]).flatMap(([a, b]) => [
						[a, b],
						[b, a],
				  ])
				: arr
						.map(a => [a, iota()])
						.flatMap(([a, b]) => [
							[a, b],
							[b, a],
						])
		)
	)
}
