/// <reference types="../types/helpers.d.ts" />

const enumItem = (() => {
	let count = 0
	return () => count++
})()

export function isDefined(val) {
	return val !== undefined && val !== null
}

export function pipe(...fns) {
	return x => fns.reduce((v, f) => f(v), x)
}

/**
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
						.map(a => [a, enumItem()])
						.flatMap(([a, b]) => [
							[a, b],
							[b, a],
						])
		)
	)
}

// const a = _enum({ foo: 0, bar: 1, baz: 2 })
const a = _enum("foo", "bar", "baz")
console.log(a)
