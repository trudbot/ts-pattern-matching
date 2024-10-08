import { keyType, NoLiteral, Primitive } from "../common.type";
import { isArrayRestPattern, isLogicalPattern, normalizePattern } from "../pattern";
import { ArrayPattern, ArrayRestDeconsPattern, LogicalPattern, ObjectPattern, Pattern, PatternInput, PatternWrapper, ValuePattern } from "../pattern/types";
import { EXIST, isTypePattern } from "../symbols";
import { isPrimitive, primitiveMatcher } from "./primitive-matcher";
import {TypeMatcher} from "./type-matcher";

type DeconsReturn = Record<string | number | symbol, any>;

/**
 * 对一个值进行模式匹配
 * @param val 输入值
 * @param pat 输入的pattern
 */
export function is<T extends Primitive, K extends PatternInput<T>>(val: T, pat: K): { matchResult: boolean, decons: DeconsReturn };
export function is<T extends Array<any>, K extends PatternInput<T>>(val: T, pat: K): { matchResult: boolean, decons: DeconsReturn };
export function is<T extends object, K extends PatternInput<T>>(val: T, pat: K): { matchResult: boolean, decons: DeconsReturn };
export function is<T, K extends PatternInput<T>>(val: T, patIn: K) {
    const decons: DeconsReturn = {};
    const pat = normalizePattern<T>(patIn);

    function innerIs<T>(val: T, pat: Pattern<T>): boolean {
        if (isLogicalPattern(pat)) {
            return handleLogicalPattern(val, pat);
        } else if (typeof pat === "function") {
            // custom matcher
            return pat(val as NoLiteral<T> & T);
        } else if (pat.type === "VALUE") {
            return handleValuePattern(val, pat);
        } else if (pat.type === "Decons") {
            handleDecons(val, pat.value);
            return true;
        } else if (pat.type === "OBJECT") {
            return handleObjectPattern(val, pat);
        } else if (pat.type === "ARRAY") {
            return handleArrayPattern(val, pat);
        }
        throw new Error("Unknown pattern");
    }

    function handleLogicalPattern<T>(val: T, pat: LogicalPattern<T>) {
        if (pat.type === "AND") {
            return pat.value.every(p => innerIs(val, p));
        } else if (pat.type === "OR") {
            return pat.value.some(p => innerIs(val, p));
        } else {
            return !innerIs(val, pat.value);
        }
    }

    function handleValuePattern<T>(val: T, pat: ValuePattern<T>) {
        const value = pat.value;
        if (value === EXIST) {
            return val !== undefined;
        } else if (isTypePattern(value)) {
            return TypeMatcher[value](val);
        } else if (isPrimitive(value)) {
            return primitiveMatcher(val, value);
        } else {
            throw new Error("Invalid value pattern");
        }
    }

    function handleObjectPattern<T>(val: T, pat: ObjectPattern<T>) {
        if (val === null || Array.isArray(val) || typeof val !== "object") {
            return false;
        } else {
            const keys = Object.keys(pat.value) as (keyof T & keyof PatternWrapper<T>)[];
            return keys.every(key => {
                const value = val[key];
                const pattern = pat.value[key] as Pattern<T[keyof T]>;
                return innerIs<T[keyof T]>(value, pattern);
            });
        }
    }

    function handleArrayPattern<T extends Array<any>>(val: T, pat: ArrayPattern<T>) {
        if (!Array.isArray(val)) {
            return false;
        }

        const patterns = pat.value;
        if (patterns.length === 0) {
            return val.length === 0;
        }

        const hasArrayRest = patterns.length > 0 && isArrayRestPattern(patterns.at(-1));
        // 过滤掉array_rest后的patterns
        const filteredPatterns = hasArrayRest ? patterns.slice(0, -1) : patterns;
        if (filteredPatterns.length > val.length) {
            return false;
        }
        const result = filteredPatterns.every((pattern, i) => {
            return innerIs<T[keyof T]>(val[i], pattern as Pattern<T[keyof T]>);
        });

        if (hasArrayRest) {
            const rest = val.slice(filteredPatterns.length);
            const restDecons = patterns.at(-1) as ArrayRestDeconsPattern;
            handleDecons(rest, restDecons.value);
        }

        return result;
    }

    function handleDecons(v: any, key: keyType) {
        if (decons[key] !== undefined) {
            throw new Error(`Duplicate decons key: ${String(key)}`);
        }
        decons[key] = v;
    }

    return {
        matchResult: innerIs<T>(val, pat),
        decons,
    };
}
