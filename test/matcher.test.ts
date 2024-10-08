import { AND, D, NOT, OR, R } from "../src/pattern";
import {is} from "../src/matcher";
import { CUSTOMMATCHER, EXIST, IS_PATTERN, TYPE, TYPE_PATTERN } from "../src/symbols";

function expectMatchResult(res: ReturnType<typeof is>) {
    return expect(res.matchResult);
}

function expectMatchDecons(res: ReturnType<typeof is>) {
    return expect(res.decons);
}

describe("[is] 测试", () => {

    describe("primitive", () => {

        describe("字面量", () => {
            // 对于字面量来说, 显然不一样的类型会在编译时类型报错， 这避免了无效的测试(编译时便已经知道测试结果)
            // 但如果不使用ts时, is函数仍然需要能正常返回match结果
            test("string", () => {
                expectMatchResult(is("hello", 'hello')).toBeTruthy();
    
                expectMatchResult(
                    // @ts-expect-error
                    is("hello", 'world')
                ).toBeFalsy();
    
                expectMatchResult(
                    // @ts-expect-error
                    is("hello", OR('hello', 'world'))
                ).toBeTruthy();
    
                expectMatchResult(
                    // @ts-expect-error
                    is("hello", AND('hello', 'world'))
                ).toBeFalsy();

                expectMatchResult(
                    is("hello", NOT('hello'))
                ).toBeFalsy();

                expectMatchResult(
                    // @ts-expect-error
                    is("hello", (null))
                ).toBeFalsy();

                expectMatchResult(
                    // @ts-expect-error
                    is("hello", {})
                ).toBeFalsy();

                expectMatchDecons(
                    is("hello", D('str'))
                ).toEqual({ str: 'hello' });

                expectMatchResult(
                    // @ts-expect-error
                    is('123', 123)
                ).toBeFalsy();

                expectMatchResult(
                    // @ts-expect-error
                    is('', [])
                ).toBeFalsy();
            });

            test('number', () => {
                expectMatchResult(is(123, 123)).toBeTruthy();

                expectMatchResult(
                    // @ts-expect-error
                    is(123, 456)
                ).toBeFalsy();

                expectMatchResult(
                    // @ts-expect-error
                    is(123, OR(123, 456))
                ).toBeTruthy();

                expectMatchResult(
                    // @ts-expect-error
                    is(123, AND(123, 456))
                ).toBeFalsy();

                expectMatchResult(
                    is(123, NOT(123))
                ).toBeFalsy();

                expectMatchResult(
                    // @ts-expect-error
                    is(123, null)
                ).toBeFalsy();

                expectMatchResult(
                    // @ts-expect-error
                    is(123, {})
                ).toBeFalsy();

                expectMatchDecons(
                    is(123, D('num'))
                ).toEqual({ num: 123 });

                expectMatchResult(
                    // @ts-expect-error
                    is(123, '123')
                ).toBeFalsy();

                expectMatchResult(
                    // @ts-expect-error
                    is(0, false)
                ).toBeFalsy();

                expectMatchResult(
                    // @ts-expect-error
                    is(1, true)
                ).toBeFalsy();
            });

            test('boolean', () => {
                expectMatchResult(is(true, true)).toBeTruthy();

                expectMatchResult(
                    // @ts-expect-error
                    is(true, false)
                ).toBeFalsy();

                expectMatchResult(
                    // @ts-expect-error
                    is(true, OR(true, false))
                ).toBeTruthy();

                expectMatchResult(
                    // @ts-expect-error
                    is(true, AND(true, false))
                ).toBeFalsy();

                expectMatchResult(
                    is(true, NOT(true))
                ).toBeFalsy();

                expectMatchResult(
                    // @ts-expect-error
                    is(true, null)
                ).toBeFalsy();

                expectMatchResult(
                    // @ts-expect-error
                    is(true, {})
                ).toBeFalsy();

                expectMatchDecons(
                    is(true, D('bool'))
                ).toEqual({ bool: true });

                expectMatchResult(
                    // @ts-expect-error
                    is(true, (1))
                ).toBeFalsy();

                expectMatchResult(
                    // @ts-expect-error
                    is(false, (0))
                ).toBeFalsy();

                expectMatchResult(
                    // @ts-expect-error
                    is(true, ('true'))
                ).toBeFalsy();
            });

            test('null', () => {
                expectMatchResult(is(null, (null))).toBeTruthy();

                expectMatchResult(
                    // @ts-expect-error
                    is(null, ('null'))
                ).toBeFalsy();

                expectMatchResult(
                    // @ts-expect-error
                    is(null, OR(null, 123))
                ).toBeTruthy();

                expectMatchResult(
                    // @ts-expect-error
                    is(null, AND(null, 'null'))
                ).toBeFalsy();

                expectMatchResult(
                    is(null, NOT(null))
                ).toBeFalsy();

                expectMatchResult(
                    // @ts-expect-error
                    is(null, ({}))
                ).toBeFalsy();

                expectMatchDecons(
                    is(null, D('null'))
                ).toEqual({ null: null });

                expectMatchResult(
                    // @ts-expect-error
                    is(null, ('null'))
                ).toBeFalsy();

                expectMatchResult(
                    // @ts-expect-error
                    is(null, (0))
                ).toBeFalsy();
            });

            test('symbol', () => {
                const sym1 = Symbol('sym1');
                const sym2 = Symbol('sym2');

                expectMatchResult(is(sym1, (sym1))).toBeTruthy();

                expectMatchResult(
                    // @ts-expect-error
                    is(sym1, (sym2))
                ).toBeFalsy();

                expectMatchResult(
                    // @ts-expect-error
                    is(sym1, OR(sym1, sym2))
                ).toBeTruthy();

                expectMatchResult(
                    // @ts-expect-error
                    is(sym1, AND(sym1, sym2))
                ).toBeFalsy();

                expectMatchResult(
                    is(sym1, NOT(sym1))
                ).toBeFalsy();

                expectMatchResult(
                    // @ts-expect-error
                    is(sym1, ('symbol'))
                ).toBeFalsy();
            });

            test('bigint', () => {
                const big1 = 123n;
                const big2 = 456n;

                expectMatchResult(is(big1, (big1))).toBeTruthy();

                expectMatchResult(
                    // @ts-expect-error
                    is(big1, (big2))
                ).toBeFalsy();

                expectMatchResult(
                    // @ts-expect-error
                    is(big1, OR(big1, big2))
                ).toBeTruthy();

                expectMatchResult(
                    // @ts-expect-error
                    is(big1, AND(big1, big2))
                ).toBeFalsy();

                expectMatchResult(
                    is(big1, NOT(big1))
                ).toBeFalsy();

                expectMatchResult(
                    // @ts-expect-error
                    is(big1, (123))
                ).toBeFalsy();

                expectMatchResult(
                    // @ts-expect-error
                    is(big1, ('123'))
                ).toBeFalsy();

                expectMatchResult(
                    // @ts-expect-error
                    is(big1, ({}))
                ).toBeFalsy();
            });
        });

        test('string', () => {
            const str: string = 'hello';

            expectMatchResult(is(str, ('123'))).toBeFalsy();
            expectMatchResult(is(str, ('hello'))).toBeTruthy();
            expectMatchResult(
                // @ts-expect-error
                is(str, ([R('rest')]))
            ).toBeFalsy();
            expectMatchResult(
                // @ts-expect-error
                is(str, ({a: D('a')}))
            ).toBeFalsy();

            expectMatchDecons(
                is(str, D('abc'))
            ).toEqual({ abc: 'hello' });
        });

        test('number', () => {
            const num: number = 123;

            expectMatchResult(is(num, (456))).toBeFalsy();
            expectMatchResult(is(num, (123))).toBeTruthy();
            expectMatchResult(
                // @ts-expect-error
                is(num, ([R('rest')]))
            ).toBeFalsy();
            expectMatchResult(
                // @ts-expect-error
                is(num, ({a: D('a')}))
            ).toBeFalsy();

            expectMatchDecons(
                is(num, D('num'))
            ).toEqual({ num: 123 });
        });

        test('boolean', () => {
            const bool: boolean = (() => true)();

            expectMatchResult(is(bool, (false))).toBeFalsy();
            expectMatchResult(is(bool, (true))).toBeTruthy();
            expectMatchResult(
                // @ts-expect-error
                is(bool, ([R('rest')]))
            ).toBeFalsy();
            expectMatchResult(
                // @ts-expect-error
                is(bool, ({a: D('a')}))
            ).toBeFalsy();

            expectMatchDecons(
                is(bool, D('bool'))
            ).toEqual({ bool: true });
        });

        test('null', () => {
            const n: null = null;
            // @ts-expect-error
            expectMatchResult(is(n, ('null'))).toBeFalsy();
            expectMatchResult(is(n, (null))).toBeTruthy();
            expectMatchResult(
                // @ts-expect-error
                is(n, ([R('rest')]))
            ).toBeFalsy();
            expectMatchResult(
                // @ts-expect-error
                is(n, ({a: D('a')}))
            ).toBeFalsy();

            expectMatchDecons(
                is(n, D('null'))
            ).toEqual({ null: null });
        });

        test('symbol', () => {
            const sym = Symbol('sym');
            // @ts-expect-error
            expectMatchResult(is(sym, (Symbol('sym')))).toBeFalsy();

            expectMatchResult(is(sym, (sym))).toBeTruthy();
            expectMatchResult(
                // @ts-expect-error
                is(sym, ([R('rest')]))
            ).toBeFalsy();
            expectMatchResult(
                // @ts-expect-error
                is(sym, ({a: D('a')}))
            ).toBeFalsy();

            expectMatchDecons(
                is(sym, D('sym'))
            ).toEqual({ sym });
        });
    });

    describe('object', () => {
        type TestCase1 = {
            a?: string;
            b?: number;
            c?: boolean;
        };

        type TestCase2 = {
            a?: {
                b?: string;
            }
            c?: string[];
        };

        const obj1: TestCase1 = {
            a: '123',
            c: true
        };

        const obj2: TestCase2 = {
            c: ['123']
        };

        test('字段exist测试', () => {

            expectMatchResult(is(obj1, ({}))).toBeTruthy();
            expectMatchResult(is(obj1, {
                a: EXIST
            })
            ).toBeTruthy();

            expectMatchResult(is(obj1, {
                a: EXIST,
                b: EXIST
            })).toBeFalsy();

            // @ts-expect-error
            expectMatchResult(is(obj1, {
                d: EXIST
            })).toBeFalsy();

            expectMatchResult(is(obj2, {a: {}})).toBeFalsy();

            expectMatchResult(is(obj2, {a: {b: EXIST}})).toBeFalsy();

            expectMatchResult(is(obj2, {c: EXIST})).toBeTruthy();

            expectMatchResult(is(obj2, {c: [EXIST]})).toBeTruthy();
        });

        test('字段值测试', () => {
            expectMatchResult(is(obj1, {
                a: '123'
            })).toBeTruthy();
            expectMatchResult(is(obj1, {
                a: '123',
                c: false
            })).toBeFalsy();

            expectMatchResult(is(obj2, {
                c: ['123']
            })).toBeTruthy();

            expectMatchResult(is(obj2, {
                c: ['123', '456']
            })).toBeFalsy();

            expectMatchResult(is(obj2, {
                a: {
                    b: '123'
                }
            })).toBeFalsy();

            // @ts-expect-error
            expectMatchResult(is(obj2, {
                a: [1]
            })).toBeFalsy();
        });

        test('解构测试', () => {
            expectMatchDecons(
                is(obj1, {
                    a: D('a')
                })
            ).toEqual({ a: '123' });

            expectMatchDecons(
                is(obj1, {
                    a: D('a'),
                    b: D('b')
                })
            ).toEqual({ a: '123' });

            expectMatchDecons(
                is(obj1, {
                    a: D('a'),
                    b: D('b'),
                    c: D('c')
                })
            ).toEqual({ a: '123', c: true });

            expectMatchDecons(
                is(obj2, {
                    a: {
                        b: D('b')
                    }
                })
            ).toEqual({});

            expectMatchDecons(
                is(obj2, {
                    c: D('c')
                })
            ).toEqual({ c: ['123'] });

            // 重复的解构名称
            expect(() => is(obj1, {a: D('a'), b: D('a')})).toThrow();
        });
    });

    describe('array / tuple', () => {
        type TestCase1 = [string, number, boolean];
        type TestCase2 = (string | boolean)[];

        const case1: TestCase1 = ['123', 123, true];

        test('空数组 匹配测试', () => {
            expectMatchResult(is([], [])).toBeTruthy();
            expectMatchResult(is([], [R('rest')])).toBeTruthy();
            expectMatchResult(is([], [D('a')])).toBeFalsy();
        });

        test('元素值匹配 测试', () => {
            expectMatchResult(is(case1, ['123', 123, true])).toBeTruthy();
            expectMatchResult(is(case1, ['123', 123, false])).toBeFalsy();
            expectMatchResult(is(case1, ['123', 123])).toBeTruthy();
            // @ts-expect-error
            expectMatchResult(is(case1, {
                0: "123",
                1: 123,
                2: true,
                length: 3
            })).toBeFalsy();

            // @ts-expect-error
            expectMatchResult(is(case1, [D('a'), D('b'), D('c'), D('d')])).toBeFalsy();

            expectMatchResult(is(case1, [D('a'), 123, D('c'), R('rest')])).toBeTruthy();
        })

        test('元素解构测试', () => {
            expectMatchDecons(
                is(case1, [D('a'), D('b'), D('c')])
            ).toEqual({ a: '123', b: 123, c: true });

            expectMatchDecons(
                is(case1, [D('a'), D('b')])
            ).toEqual({ a: '123', b: 123 });

            expectMatchDecons(
                is(case1, [D('a'), D('b'), D('c'), R('rest')])
            ).toEqual({ a: '123', b: 123, c: true, rest: [] });

            expectMatchDecons(
                is(case1, [D('a'), D('b'), R('rest')])
            ).toEqual({ a: '123', b: 123, rest: [true] });

            expectMatchDecons(
                is(case1, [D('a'), R('rest')])
            ).toEqual({ a: '123', rest: [123, true] });

            expectMatchDecons(
                is(case1, [R('rest')])
            ).toEqual({rest: ['123', 123, true]});
        });
    });

    test('type 测试', () => {
        const cases = {
            [TYPE.string]: '123',
            [TYPE.number]: 123,
            [TYPE.boolean]: true,
            [TYPE.null]: null,
            [TYPE.array]: [],
            [TYPE.object]: {},
            [TYPE.function]: () => {},
            [TYPE.undefined]: undefined,
            [TYPE.symbol]: Symbol('sym'),
            [TYPE.bigint]: 123n
        }

        const types = Object.values(TYPE) as TYPE_PATTERN[];

        types.forEach(t1 => {
            types.forEach(t2 => {
                const result = is(cases[t1] as any, t2).matchResult;
                expect(result).toEqual(t1 === t2);
            });
        });
    });

    test('自定义匹配器', () => {
        const matcher = (val: string) => val === '123';

        expectMatchResult(is('123', matcher)).toBeTruthy();
        expectMatchResult(is('456', matcher)).toBeFalsy();

        class CustomMatcherClass {
            a: number;
            b: number;
            constructor(a: number, b: number) {
                this.a = a;
                this.b = b;
            }

            getSum() {
                return this.a + this.b;
            }

            [CUSTOMMATCHER](val: CustomMatcherClass) {
                return this.getSum() === val.getSum();
            }
        }

        const a = new CustomMatcherClass(2, 3);
        const b = new CustomMatcherClass(3, 2);
        const c = new CustomMatcherClass(2, 2);

        expectMatchResult(is(a, b)).toBeTruthy();
        expectMatchResult(is(a, c)).toBeFalsy();
        expectMatchResult(is(b, c)).toBeFalsy();

    });

    test('invalid pattern', () => {
        // @ts-expect-error
        expect(() => is(123, undefined)).toThrow();
        // @ts-expect-error
        expect(() => is(123, {
            [IS_PATTERN]: true,
            type: "UNKNOWN"
        })).toThrow();
        // @ts-expect-error
        expect(() => is(123, {
            [IS_PATTERN]: true,
            type: "VALUE",
            value: []
        })).toThrow();
    });
});
