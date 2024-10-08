import { expectTypeOf } from "expect-type";
import { Prefix, PrefixWithTail, IsTuple } from "../src/common.type";

test("Prefix", () => {
    expectTypeOf<[] | [string] | [string, number]>().toMatchTypeOf<Prefix<[string, number]>>();
    expectTypeOf<[]>().toMatchTypeOf<Prefix<[]>>();

    // @ts-expect-error
    expectTypeOf<[string, number]>().toMatchTypeOf<Prefix<[string]>>();
});

test("PrefixWithTail", () => {
    expectTypeOf<[boolean] | [string, boolean]>().toMatchTypeOf<PrefixWithTail<[string, number], boolean>>();

    expectTypeOf<[boolean]>().toMatchTypeOf<PrefixWithTail<[number], boolean>>();

    expectTypeOf<[string, boolean]>().toMatchTypeOf<PrefixWithTail<[string, boolean], boolean>>();
});

test("IsTuple", () => {
    expectTypeOf<IsTuple<[number, string]>>().toMatchTypeOf<true>();
    expectTypeOf<IsTuple<[]>>().toEqualTypeOf<true>();
    expectTypeOf<IsTuple<string[]>>().toEqualTypeOf<false>();
    expectTypeOf<IsTuple<string[] | [number]>>().toEqualTypeOf<boolean>();
});