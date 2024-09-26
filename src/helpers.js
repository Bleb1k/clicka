/// <reference types="../types/helpers.d.ts" />

export const iota = (() => {
	let count = 0
	return () => count++
})() // like in go

export function isDefined(val) {
	return val !== undefined && val !== null
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
	console.log(Object.entries(arr))
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
