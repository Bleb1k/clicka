type EnumType<T> = { readonly [P in keyof T]: T[P] } & { readonly [T in keyof P]: P[T] }
// declare function _enum<T>(...arr: T[] | { [key in keyof T]: number }[]): EnumType<T>

type StringLiteral<T extends string> = readonly T

type Enum<T> = T extends readonly string[] ? { [key in T[number]]: number } : T[number]

// export function _enum<T>(
// 	...arr: (T extends readonly string[]
// 		? { readonly [P in T[number] as T[P]]: P }
// 		: { readonly [P in keyof T]: T[P] })[]
// ): Enum<T> {
// 	console.log(Object.entries(arr))
// 	return Object.freeze(
// 		Object.fromEntries(
// 			arr.length === 1 && typeof arr[0] === "object"
// 				? Object.entries(arr[0]).flatMap(([a, b]) => [
// 						[a, b],
// 						[b, a],
// 				  ])
// 				: arr
// 						.map(a => [a, enumItem()])
// 						.flatMap(([a, b]) => [
// 							[a, b],
// 							[b, a],
// 						])
// 		)
// 	)
// }

// let a = _enum("foo", "bar", "baz")
// let a = _enum({ foo: 0, bar: 1, baz: 2 })
let a = ["foo", "bar", "baz"] as const // js dont have 'as const'
type A = Enum<typeof a>

let b = [{ foo: 0, bar: 1, baz: 2 }] // what the ...arr parameter is
type B = Enum<typeof b>
