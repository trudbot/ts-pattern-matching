
export type Primitive = string | number | boolean | null | symbol | bigint;
export type ElementType<T> = T extends (infer U)[] ? U : never;

export type MaxLengthArray<T, MaxLength extends number, Arr extends any[] = []> = 
    Arr['length'] extends MaxLength ? Arr : MaxLengthArray<T, MaxLength, [...Arr, T]> | Arr;

/**
 * 获取元组的前缀类型
 * @example Prefix<[string, number, boolean]> => [] | [string] | [string, number] | [string, number, boolean]
 */
export type Prefix<T extends any[]> = T extends [infer First, ...infer Rest]
    ? [First, ...Prefix<Rest>] | []
    : T;

/**
 * 获取元组的前缀类型, 并在最后添加一个Tail类型
 * @example PrefixWithTail<[string, number], boolean> => [boolean] | [string, boolean] | [string, number, boolean]
 */
export type PrefixWithTail<T extends any[], Tail> = T extends [infer First, ...infer Rest]
    ? [First, ...PrefixWithTail<Rest, Tail>] | [Tail] | []
    : T;

export type IsTuple<T> = T extends readonly any[]
    ? number extends T['length']
        ? false
        : true
    : false;

/**
 * 将T中的所有字面量类型转换为对应的非字面量类型
 */
export type NoLiteral<T> = 
    T extends string ? string :
    T extends number ? number :
    T extends boolean ? boolean :
    T extends bigint ? bigint :
    T extends symbol ? symbol :
    T extends null ? null :
    T;

/**
 * object key的类型
 */
export type keyType = string | number | symbol;
