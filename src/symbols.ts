const prefix = "@ts-pattern-matching";
export const symbolName = (name: string) => `${prefix}/${name}`;
/**
 * 标注类型的symbol, 在pattern中使用表示对类型的匹配
 */
export const STRING = Symbol.for(symbolName('string'));
export const NUMBER = Symbol.for(symbolName('number'));
export const NULL = Symbol.for(symbolName('null'));
export const BOOLEAN = Symbol.for(symbolName('boolean'));
export const ARRAY = Symbol.for(symbolName('array'));
export const OBJECT = Symbol.for(symbolName('object'));
export const FUNCTION = Symbol.for(symbolName('function'));
export const UNDEFINED = Symbol.for(symbolName('undefined'));
export const SYMBOL = Symbol.for(symbolName('symbol'));
export const BIGINT = Symbol.for(symbolName('bigint'));
export type STRING = typeof STRING;
export type NUMBER = typeof NUMBER;
export type BOOLEAN = typeof BOOLEAN;
export type NULL = typeof NULL;
export type ARRAY = typeof ARRAY;
export type OBJECT = typeof OBJECT;
export type FUNCTION = typeof FUNCTION;
export type UNDEFINED = typeof UNDEFINED;
export type SYMBOL = typeof SYMBOL;
export type BIGINT = typeof BIGINT;

/**
 * 类型标注的集合
 */
export type TYPE_PATTERN = STRING | NUMBER | BOOLEAN | NULL | ARRAY | OBJECT | FUNCTION | UNDEFINED | SYMBOL | BIGINT;

export const TYPE =   {
    string: STRING,
    number: NUMBER,
    boolean: BOOLEAN,
    null: NULL,
    array: ARRAY,
    object: OBJECT,
    function: FUNCTION,
    undefined: UNDEFINED,
    symbol: SYMBOL,
    bigint: BIGINT,
} as const;

/**
 * 用于表示存在性的symbol
 */
export const EXIST = Symbol.for(symbolName('exist'));
export type EXIST = typeof EXIST;

/**
 * pattern对象的标志属性
 */
export const IS_PATTERN = Symbol.for(symbolName('pattern'));
export type IS_PATTERN = typeof IS_PATTERN;

// otherwise 默认匹配
export const OTHERWISE = Symbol.for(symbolName('otherwise'));
export type OTHERWISE = typeof OTHERWISE;

/**
 * 
 * @param value 
 * @returns 
 */
export const CUSTOMMATCHER = Symbol.for(symbolName('customMatcher'));
export type CUSTOMMATCHER = typeof CUSTOMMATCHER;
//-----------------以下是一些辅助函数-----------------
export function isTypePattern(value: any): value is TYPE_PATTERN {
    return Object.values(TYPE).includes(value);
}
