import { Primitive } from "../common.type";

export type Matcher<T> = (v: T, subject: any) => boolean;

export const primitiveMatcher = (v: any, subject: any) => {
    return v === subject;
};

export const isPrimitive = (v: any): v is Primitive => {
    return typeof v === "string" || typeof v === "number" || typeof v === "boolean" || v === null || typeof v === "symbol" || typeof v === "bigint";
};
