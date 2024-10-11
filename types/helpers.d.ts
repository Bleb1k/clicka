type EnumType<T> = { readonly [P in keyof T]: T[P] } & { readonly [T in keyof P]: P[T] }
// declare function _enum<T>(...arr: T[] | { [key in keyof T]: number }[]): EnumType<T>

type StringLiteral<T extends string> = readonly T

type Enum<T> = T extends readonly string[] ? { [key in T[number]]: number } : T[number]

interface Vec2 {
	x: number
	y: number
}

type AsyncFunction<T> = () => Promise<T>
