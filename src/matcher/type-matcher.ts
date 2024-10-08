import { TYPE } from "../symbols";

export const TypeMatcher =  {
    [TYPE.string]: (v: any) => typeof v === "string",
    [TYPE.number]: (v: any) => typeof v === "number",
    [TYPE.boolean]: (v: any) => typeof v === "boolean",
    [TYPE.null]: (v: any) => v === null,
    [TYPE.symbol]: (v: any) => typeof v === "symbol",
    [TYPE.bigint]: (v: any) => typeof v === "bigint",
    [TYPE.undefined]: (v: any) => v === undefined,
    [TYPE.array]: (v: any) => Array.isArray(v),
    [TYPE.object]: (v: any) => typeof v === "object" && !Array.isArray(v) && v !== null,
    [TYPE.function]: (v: any) => typeof v === "function",
};
