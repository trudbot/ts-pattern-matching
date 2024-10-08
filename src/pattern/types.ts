import { IsTuple, keyType, NoLiteral, Prefix, PrefixWithTail, Primitive } from "../common.type";
import { CUSTOMMATCHER, EXIST, IS_PATTERN, TYPE_PATTERN } from "../symbols";

interface PatternBase {
    [IS_PATTERN]: boolean;
}

// 值校验
interface ValuePattern<T> extends PatternBase {
    type: "VALUE";
    value: TYPE_PATTERN | EXIST | (T extends Primitive ? T : never);
}

interface AndPattern<T> extends PatternBase {
    type: "AND";
    value: Pattern<T>[];
}

interface OrPattern<T> extends PatternBase {
    type: "OR";
    value: Pattern<T>[];
}

interface NotPattern<T> extends PatternBase {
    type: "NOT";
    value: Pattern<T>;
}

interface ObjectPattern<T> extends PatternBase {
    type: "OBJECT",
    value: PatternWrapper<T>;
}

interface ArrayPattern<T extends Array<any>> extends PatternBase {
    type: "ARRAY",
    value:
    // 元组或数组, 无ARRAY_REST
    PatternWrapper<Prefix<T>> |
    // 元组, 有ARRAY_REST
    (IsTuple<T> extends true ? 
        PatternWrapper<PrefixWithTail<T, ArrayRestDeconsPattern>> :
        // 数组, 有ARRAY_REST
        [...PatternWrapper<Prefix<T>>, ArrayRestDeconsPattern]
    )
}

interface DeconsPattern extends PatternBase {
    type: "Decons",
    value: keyType
}

interface ArrayRestDeconsPattern extends PatternBase {
    type: "RestDecons",
    value: keyType
}

// 自定义校验器
export type CustomMatcher<T> = 
    T extends Primitive ? (v: NoLiteral<T>) => boolean :
    (v: T) => boolean;
export type CustomMatcherObject<T> = {
    [CUSTOMMATCHER]: CustomMatcher<T>
}

export {ValuePattern, AndPattern, OrPattern, NotPattern, ObjectPattern, ArrayPattern, DeconsPattern, ArrayRestDeconsPattern};
// export type ArrayPattern<T extends Array<any>> = 
export type LogicalPattern<T> = AndPattern<T> | OrPattern<T> | NotPattern<T>;
export type Pattern<T> = 
    ValuePattern<T> |
    LogicalPattern<T> | 
    CustomMatcher<T> |
    (T extends Array<any> ? ArrayPattern<T> : never) |
    (T extends object ? ObjectPattern<T> : never) |
    DeconsPattern;
export type PatternWrapper<T> = {
    [K in keyof T]?: Pattern<T[K]>
}

export type ObjectPatternInput<T extends object> = PatternInputWrapper<T> | CustomMatcherObject<T>;

export type ArrayPatternInput<T extends Array<any>> = 
    // 元组或数组, 无ARRAY_REST
    PatternInputWrapper<Prefix<T>> |
    IsTuple<T> extends true ?
        // 元组, 有ARRAY_REST
        PatternInputWrapper<PrefixWithTail<T, ArrayRestDeconsPattern>> : 
        // 数组, 有ARRAY_REST
        [...PatternInputWrapper<Prefix<T>>, ArrayRestDeconsPattern]

export type PatternInput<T> = 
    Pattern<T> |
    ValuePattern<T>["value"] |
    (T extends Array<any> ? ArrayPatternInput<T> : never) |
    (T extends object ? ObjectPatternInput<T> : never)
export type PatternInputWrapper<T> = {
    [K in keyof T]?: PatternInput<T[K]>
}
