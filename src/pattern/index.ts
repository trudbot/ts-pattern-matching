import { isPrimitive } from '../matcher/primitive-matcher';
import { IS_PATTERN, isTypePattern, EXIST, CUSTOMMATCHER } from '../symbols';
import { AndPattern, ArrayRestDeconsPattern, CustomMatcher, CustomMatcherObject, DeconsPattern, LogicalPattern, NotPattern, ObjectPatternInput, OrPattern, Pattern, PatternInput, PatternInputWrapper, PatternWrapper } from './types';

export function isPattern(value: any): value is Pattern<any> {
    return (typeof value === 'object' && value?.[IS_PATTERN]) || typeof value === 'function';
}

export function isLogicalPattern(value: any): value is LogicalPattern<any> {
    return isPattern(value) && (typeof value !== 'function') && (value.type === "AND" || value.type === "OR" || value.type === "NOT");
}

function isObjectPatternInput(value: any): value is ObjectPatternInput<any> {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function isArrayRestPattern(value: any): value is ArrayRestDeconsPattern {
    return value !== null && typeof value === 'object' && value.type === "RestDecons";
}

/**
 * 将pattern从输入格式转换为标准格式
 * @param pattern 输入的pattern
 * @returns 标准格式的pattern
 */
export function normalizePattern<T>(pattern: PatternInput<T>): Pattern<T> {
    if (isPattern(pattern)) {
        return pattern;
    } else if (isPrimitive(pattern) || isTypePattern(pattern) || pattern === EXIST) {
        return {
            [IS_PATTERN]: true,
            type: "VALUE",
            value: pattern
        } as Pattern<T>;
    } else if (Array.isArray(pattern)) {
        // 校验ARRAY_REST只能在数组的最后一个元素
        pattern.forEach(((p, i) => {
            if (isArrayRestPattern(p) && i !== pattern.length - 1) {
                throw new Error('ARRAY_REST can only be the last element of an array pattern');
            }
        }));

        const normalizePatterns =  pattern.map(p => {
            return isArrayRestPattern(p) ? p : normalizePattern(p as PatternInput<any>);
        });

        return {
            [IS_PATTERN]: true,
            type: "ARRAY",
            value: normalizePatterns
        } as Pattern<T>;
    } else if (isObjectPatternInput(pattern)) {
        
        if (pattern && (pattern as CustomMatcherObject<T>)[CUSTOMMATCHER]) {
            return ((v: T) => {
                return (pattern as CustomMatcherObject<T>)[CUSTOMMATCHER](v as any);
            }) as CustomMatcher<T>;
        }

        const keys = Object.keys(pattern as PatternInputWrapper<T>) as (keyof T)[];
        const value = keys.reduce((acc, key) => {
            const pat = (pattern as PatternInputWrapper<T>)[key] as PatternInput<T[keyof T]>;
            if (pat !== undefined) {
                acc[key] = normalizePattern(pat);
            }
            return acc;
        }, {} as PatternWrapper<T>);
        return {
            [IS_PATTERN]: true,
            type: "OBJECT",
            value
        } as Pattern<T>;
    } else {
        throw new Error('Invalid pattern');
    }
}

/**
 * 或逻辑
 * @param patterns 形成或逻辑的pattern
 */
export function OR<T>(...patterns: PatternInput<T>[]): OrPattern<T> {
    return {
        [IS_PATTERN]: true,
        type: "OR",
        value: patterns.map(pi => normalizePattern(pi))
    };
}

/**
 * 非逻辑
 * @param pattern 取反的pattern
 * @returns 
 */
export function NOT<T>(pattern: PatternInput<T>): NotPattern<T> {
    return {
        [IS_PATTERN]: true,
        type: "NOT",
        value: normalizePattern(pattern)
    };
}

/**
 * 与逻辑
 * @param patterns 形成与逻辑的pattern
 */
export function AND<T>(...patterns: PatternInput<T>[]): AndPattern<T> {
    return {
        [IS_PATTERN]: true,
        type: "AND",
        value: patterns.map(pi => normalizePattern(pi))
    };
}

/**
 * 
 * @param key 解构后的引用名称
 * @returns DeconsPattern
 */
export function D(key: DeconsPattern['value']): DeconsPattern {
    return {
        [IS_PATTERN]: true,
        type: "Decons",
        value: key
    };
}

/**
 * 
 * @param key 数组rest解构后的引用名称
 * @returns ArrayRestDeconsPattern
 */
export function R(key: ArrayRestDeconsPattern['value']): ArrayRestDeconsPattern {
    return {
        [IS_PATTERN]: true,
        type: "RestDecons",
        value: key
    };
}
