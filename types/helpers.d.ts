type EnumType<T> = { readonly [P in keyof T]: T[P] } & { readonly [T in keyof P]: P[T] }
// declare function _enum<T>(...arr: T[] | { [key in keyof T]: number }[]): EnumType<T>

type StringLiteral<T extends string> = readonly T

type Enum<T> = T extends readonly string[] ? { [key in T[number]]: number } : T[number]

let a = ["foo", "bar", "baz"] as const // js dont have 'as const'
type A = Enum<typeof a>

let b = [{ foo: 0, bar: 1, baz: 2 }] // what the ...arr parameter is
type B = Enum<typeof b>
