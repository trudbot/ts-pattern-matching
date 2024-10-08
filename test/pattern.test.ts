
import {normalizePattern, D, OR, AND, NOT, R} from "../src/pattern";
import { Pattern, PatternInput } from "../src/pattern/types";
import { IS_PATTERN, EXIST } from "../src/symbols";

/**
 * 对normalize函数进行测试
 * 同时也是对PatternInput类型的测试
 */
describe('normalize测试', () => {
    describe('primitive', () => {
        let result;
        test('pattern与类型不匹配(预期ts error, 但运行正常)', () => {
            // @ts-expect-error
            normalizePattern<number>('123');
            // @ts-expect-error
            normalizePattern<string>(123);
            // @ts-expect-error
            normalizePattern<boolean>('true');
            // @ts-expect-error
            normalizePattern<null>('null');
            // @ts-expect-error
            normalizePattern<symbol>('123');
            // @ts-expect-error
            normalizePattern<bigint>('123');
            // @ts-expect-error
            normalizePattern<null>({});
        });
        test('string', () => {
            result = normalizePattern('123');
            expect(result).toEqual({
                [IS_PATTERN]: true,
                type: 'VALUE',
                value: '123'
            });
        });
        test('number', () => {
            result = normalizePattern(123);
            expect(result).toEqual({
                [IS_PATTERN]: true,
                type: 'VALUE',
                value: 123
            });
        });
        test('boolean', () => {
            result = normalizePattern(true);
            expect(result).toEqual({
                [IS_PATTERN]: true,
                type: 'VALUE',
                value: true
            });
        });
        test('null', () => {
            result = normalizePattern<null>(null);
            expect(result).toEqual({
                [IS_PATTERN]: true,
                type: 'VALUE',
                value: null
            });
        });
        test('symbol', () => {
            const s = Symbol('123');
            result = normalizePattern(s);
            expect(result).toEqual({
                [IS_PATTERN]: true,
                type: 'VALUE',
                value: s
            });
        });
        test('bigint', () => {
            const b = BigInt(123);
            result = normalizePattern(b);
            expect(result).toEqual({
                [IS_PATTERN]: true,
                type: 'VALUE',
                value: b
            });
        });
        test('存在性校验', () => {
            result = normalizePattern(EXIST);
            expect(result).toEqual({
                [IS_PATTERN]: true,
                type: 'VALUE',
                value: EXIST
            });
        })
    });

    describe('简单object(object + primitive)', () => {
        let result;
        interface TestCase {
            a: string;
            b: number;
            c: boolean;
        }

        test('空对象', () => {
            result = normalizePattern<TestCase>({});
            expect(result).toEqual({
                [IS_PATTERN]: true,
                type: 'OBJECT',
                value: {}
            });
        });

        test('单个属性', () => {
            result = normalizePattern<TestCase>({a: '123'});
            expect(result).toEqual({
                [IS_PATTERN]: true,
                type: 'OBJECT',
                value: {
                    a: {
                        [IS_PATTERN]: true,
                        type: 'VALUE',
                        value: '123'
                    }
                }
            });
        });

        test('多个属性', () => {
            result = normalizePattern<TestCase>({a: '123', b: 456, c: true});
            expect(result).toEqual({
                [IS_PATTERN]: true,
                type: 'OBJECT',
                value: {
                    a: {
                        [IS_PATTERN]: true,
                        type: 'VALUE',
                        value: '123'
                    },
                    b: {
                        [IS_PATTERN]: true,
                        type: 'VALUE',
                        value: 456
                    },
                    c: {
                        [IS_PATTERN]: true,
                        type: 'VALUE',
                        value: true
                    }
                }
            });
        });

        test('存在性校验', () => {
            result = normalizePattern<TestCase>({a: EXIST});
            expect(result).toEqual({
                [IS_PATTERN]: true,
                type: 'OBJECT',
                value: {
                    a: {
                        [IS_PATTERN]: true,
                        type: 'VALUE',
                        value: EXIST
                    }
                }
            });
        });
    });

    describe('简单array(array + primitive)', () => {
        let result;
        type TestCase = string[];
        test('空数组', () => {
            result = normalizePattern<TestCase>([]);
            expect(result).toEqual({
                [IS_PATTERN]: true,
                type: 'ARRAY',
                value: []
            });
        });

        test('pattern与类型不匹配(预期ts error, 但运行正常)', () => {
            // @ts-expect-error
            normalizePattern<number[]>(['123']);
            // @ts-expect-error
            normalizePattern<string[]>(['123', "456", "true", 123]);
            // @ts-expect-error
            normalizePattern<boolean[]>(null);
            // @ts-expect-error
            normalizePattern<TestCase>({});
            // @ts-expect-error
            normalizePattern<TestCase>(true);
        })

        test('单个元素', () => {
            result = normalizePattern<TestCase>(['123']);
            expect(result).toEqual({
                [IS_PATTERN]: true,
                type: 'ARRAY',
                value: [{
                    [IS_PATTERN]: true,
                    type: 'VALUE',
                    value: '123'
                }]
            });
        });
        test('多个元素', () => {
            result = normalizePattern<TestCase>(['123', "456", "true"]);
            expect(result).toEqual({
                [IS_PATTERN]: true,
                type: 'ARRAY',
                value: [
                    {
                        [IS_PATTERN]: true,
                        type: 'VALUE',
                        value: '123'
                    },
                    {
                        [IS_PATTERN]: true,
                        type: 'VALUE',
                        value: "456"
                    },
                    {
                        [IS_PATTERN]: true,
                        type: 'VALUE',
                        value: "true"
                    }
                ]
            });
        });

        test('存在性校验', () => {
            result = normalizePattern<TestCase>([EXIST, "123", "456"]);
            expect(result).toEqual({
                [IS_PATTERN]: true,
                type: 'ARRAY',
                value: [
                    {
                        [IS_PATTERN]: true,
                        type: 'VALUE',
                        value: EXIST
                    },
                    {
                        [IS_PATTERN]: true,
                        type: 'VALUE',
                        value: "123"
                    },
                    {
                        [IS_PATTERN]: true,
                        type: 'VALUE',
                        value: "456"
                    }
                ]
            });
        });
        test('rest', () => {
            result = normalizePattern<TestCase>(["123", R('rest')]);
            expect(result).toEqual({
                [IS_PATTERN]: true,
                type: 'ARRAY',
                value: [
                    {
                        [IS_PATTERN]: true,
                        type: 'VALUE',
                        value: "123"
                    },
                    {
                        [IS_PATTERN]: true,
                        type: 'RestDecons',
                        value: 'rest'
                    }
                ]
            });

            result = normalizePattern<TestCase>([R('rest')]);
            expect(result).toEqual({
                [IS_PATTERN]: true,
                type: 'ARRAY',
                value: [{
                    [IS_PATTERN]: true,
                    type: 'RestDecons',
                    value: 'rest'
                }]
            });

            // rest只能在最后一个元素
            //@ts-expect-error
            expect(() => normalizePattern<TestCase>([R('rest'), "123"])).toThrow();
        });
    });

    describe('简单truple(truple + primitive)', () => {
        type TestCase1 = [string, number, boolean];
        type TestCase2 = [string, number, boolean, ...(string | number)[]];

        test('pattern与类型不匹配(预期ts error, 但运行正常)', () => {
            // @ts-expect-error
            normalizePattern<TestCase1>(['123', 456, "true", 123]);
            // @ts-expect-error
            normalizePattern<TestCase1>(['123', 456, "true", 123, "456"]);
            // @ts-expect-error
            normalizePattern<TestCase1>(null);
            // @ts-expect-error
            normalizePattern<TestCase1>({});
            // @ts-expect-error
            normalizePattern<TestCase1>(true);
            // @ts-expect-error
            normalizePattern<TestCase2>(['123', 456, "true", 123]);
            // @ts-expect-error
            normalizePattern<TestCase2>(['123', 456, true, true]);
        });

        test('空元组', () => {
            let result = normalizePattern<TestCase1>([]);
            expect(result).toEqual({
                [IS_PATTERN]: true,
                type: "ARRAY",
                value: []
            })
        })

        test('普通前缀解析', () => {
            let result = normalizePattern<TestCase1>(['123', 456]);
            expect(result).toEqual({
                [IS_PATTERN]: true,
                type: 'ARRAY',
                value: [
                    {
                        [IS_PATTERN]: true,
                        type: 'VALUE',
                        value: '123'
                    },
                    {
                        [IS_PATTERN]: true,
                        type: 'VALUE',
                        value: 456
                    }
                ]
            });

            result = normalizePattern<TestCase1>(['123', 456, true]);
            expect(result).toEqual({
                [IS_PATTERN]: true,
                type: 'ARRAY',
                value: [
                    {
                        [IS_PATTERN]: true,
                        type: 'VALUE',
                        value: '123'
                    },
                    {
                        [IS_PATTERN]: true,
                        type: 'VALUE',
                        value: 456
                    },
                    {
                        [IS_PATTERN]: true,
                        type: 'VALUE',
                        value: true
                    }
                ]
            });
        });

        test('rest', () => {
            let result1 = normalizePattern<TestCase1>(['123', 456, R('rest')]);
            expect(result1).toEqual({
                [IS_PATTERN]: true,
                type: 'ARRAY',
                value: [
                    {
                        [IS_PATTERN]: true,
                        type: 'VALUE',
                        value: '123'
                    },
                    {
                        [IS_PATTERN]: true,
                        type: 'VALUE',
                        value: 456
                    },
                    {
                        [IS_PATTERN]: true,
                        type: 'RestDecons',
                        value: 'rest'
                    }
                ]
            });
            let result2 = normalizePattern<TestCase2>(['123', 456, true, "123", "456", 123, R('rest')]);
            expect(result2).toEqual({
                [IS_PATTERN]: true,
                type: 'ARRAY',
                value: [
                    {
                        [IS_PATTERN]: true,
                        type: 'VALUE',
                        value: '123'
                    },
                    {
                        [IS_PATTERN]: true,
                        type: 'VALUE',
                        value: 456
                    },
                    {
                        [IS_PATTERN]: true,
                        type: 'VALUE',
                        value: true
                    },
                    {
                        [IS_PATTERN]: true,
                        type: 'VALUE',
                        value: '123'
                    },
                    {
                        [IS_PATTERN]: true,
                        type: 'VALUE',
                        value: '456'
                    },
                    {
                        [IS_PATTERN]: true,
                        type: 'VALUE',
                        value: 123
                    },
                    {
                        [IS_PATTERN]: true,
                        type: 'RestDecons',
                        value: 'rest'
                    }
                ]
            });
            let result3 = normalizePattern<TestCase1>([R('rest')]);
            expect(result3).toEqual({
                [IS_PATTERN]: true,
                type: 'ARRAY',
                value: [{
                    [IS_PATTERN]: true,
                    type: 'RestDecons',
                    value: 'rest'
                }]
            });
            let result4 = normalizePattern<TestCase2>([R('rest')]);
            expect(result4).toEqual({
                [IS_PATTERN]: true,
                type: 'ARRAY',
                value: [{
                    [IS_PATTERN]: true,
                    type: 'RestDecons',
                    value: 'rest'
                }]
            });
            // rest只能在最后一个元素
            //@ts-expect-error
            expect(() => normalizePattern<TestCase1>(['123', R('rest'), 123])).toThrow();
        })
    });

    test('自定义匹配器', () => {
        const matcher = (data: number) => data > 0;
        let result = normalizePattern(matcher);
        expect(result).toEqual(matcher);
    })

    describe('object + array', () => {
        let result;
        type TestCase1 = {
            a: string;
            b: string[];
        }
        type TestCase2 = {a: string; b: boolean}[];

        test('pattern与类型不匹配(预期ts error, 但运行正常)', () => {
            // @ts-expect-error
            normalizePattern<TestCase1>({a: true});
            // @ts-expect-error
            normalizePattern<TestCase1>({a: 'a', b: true});
            // @ts-expect-error
            normalizePattern<TestCase1>({b: [1, 2, 3]});
            // @ts-expect-error
            normalizePattern<TestCase2>([true])
            // @ts-expect-error
            normalizePattern<TestCase2>([{a: 'a', b: 'b'}])
            // @ts-expect-error
            normalizePattern<TestCase2>([{a: 'a', b: true, c: 123}])
        });

        test("解析", () => {
            result = normalizePattern<TestCase1>({
                a: 'a',
                b: EXIST
            });
            expect(result).toEqual({
                [IS_PATTERN]: true,
                type: 'OBJECT',
                value: {
                    a: {
                        [IS_PATTERN]: true,
                        type: 'VALUE',
                        value: 'a'
                    },
                    b: {
                        [IS_PATTERN]: true,
                        type: 'VALUE',
                        value: EXIST
                    }
                }
            });

            result = normalizePattern<TestCase1>({
                b: ['a', R('rest')],
            })
            expect(result).toEqual({
                [IS_PATTERN]: true,
                type: 'OBJECT',
                value: {
                    b: {
                        [IS_PATTERN]: true,
                        type: 'ARRAY',
                        value: [
                            {
                                [IS_PATTERN]: true,
                                type: 'VALUE',
                                value: 'a'
                            },
                            {
                                [IS_PATTERN]: true,
                                type: 'RestDecons',
                                value: 'rest'
                            }
                        ]
                    }
                }
            });

            result = normalizePattern<TestCase2>([
                {a: 'a', b: true},
                {a: 'b', b: false},
                R('rest')
            ]);

            expect(result).toEqual({
                [IS_PATTERN]: true,
                type: 'ARRAY',
                value: [
                    {
                        [IS_PATTERN]: true,
                        type: 'OBJECT',
                        value: {
                            a: {
                                [IS_PATTERN]: true,
                                type: 'VALUE',
                                value: 'a'
                            },
                            b: {
                                [IS_PATTERN]: true,
                                type: 'VALUE',
                                value: true
                            }
                        }
                    },
                    {
                        [IS_PATTERN]: true,
                        type: 'OBJECT',
                        value: {
                            a: {
                                [IS_PATTERN]: true,
                                type: 'VALUE',
                                value: 'b'
                            },
                            b: {
                                [IS_PATTERN]: true,
                                type: 'VALUE',
                                value: false
                            }
                        }
                    },
                    {
                        [IS_PATTERN]: true,
                        type: 'RestDecons',
                        value: 'rest'
                    }
                ]
            });
        });
    });

    describe('object + truple', () => {
        type TestCase1 = {
            a: [string, number];
            b: [string, ...number[]]
        }

        type TestCase2 = [
            {a: string},
            {b: number}
        ]

        test('pattern与类型不匹配(预期ts error, 但运行正常)', () => {
            // @ts-expect-error
            normalizePattern<TestCase1>({a: ['a', 'b']});
            // @ts-expect-error
            normalizePattern<TestCase1>({a: ['a', 1], b: ['a', 1, 2, true, R('rest')]});
            // @ts-expect-error
            normalizePattern<TestCase1>({a: ['a', 1], b: ['a', 'b']});
            // @ts-expect-error
            normalizePattern<TestCase2>([{a: 'a'}, {a: 'b'}]);
            // @ts-expect-error
            normalizePattern<TestCase2>([{a: 'a', b: 'b'}]);
            // @ts-expect-error
            normalizePattern<TestCase2>([{a: 'a'}, {b: 'b'}]);
        });
    });

    describe('array + truple', () => {
        type TestCase1 = [string, number, boolean[]];
        type TestCase2 = [string, number][];
        let result;

        test('pattern与类型不匹配(预期ts error, 但运行正常)', () => {
            // @ts-expect-error
            normalizePattern<TestCase1>(['a', 1, ['a', 'b']]);
            // @ts-expect-error
            normalizePattern<TestCase1>(['a', 1, null]);
            // @ts-expect-error
            normalizePattern<TestCase1>(['a', 1, {1: true,2: false}]);
            // @ts-expect-error
            normalizePattern<TestCase2>([['a', 1], [1, 'a']]);
            // @ts-expect-error
            normalizePattern<TestCase2>([['a', 'b']]);
            // @ts-expect-error
            normalizePattern<TestCase2>([1, 2, 3]);
        });

        test("解析", () => {
            result = normalizePattern<TestCase1>(['a', 1, [true, false]]);
            expect(result).toEqual({
                [IS_PATTERN]: true,
                type: 'ARRAY',
                value: [
                    {
                        [IS_PATTERN]: true,
                        type: 'VALUE',
                        value: 'a'
                    },
                    {
                        [IS_PATTERN]: true,
                        type: 'VALUE',
                        value: 1
                    },
                    {
                        [IS_PATTERN]: true,
                        type: 'ARRAY',
                        value: [
                            {
                                [IS_PATTERN]: true,
                                type: 'VALUE',
                                value: true
                            },
                            {
                                [IS_PATTERN]: true,
                                type: 'VALUE',
                                value: false
                            }
                        ]
                    }
                ]
            });

            result = normalizePattern<TestCase2>([['a', 1], ['b', 2]]);
            expect(result).toEqual({
                [IS_PATTERN]: true,
                type: 'ARRAY',
                value: [
                    {
                        [IS_PATTERN]: true,
                        type: 'ARRAY',
                        value: [
                            {
                                [IS_PATTERN]: true,
                                type: 'VALUE',
                                value: 'a'
                            },
                            {
                                [IS_PATTERN]: true,
                                type: 'VALUE',
                                value: 1
                            }
                        ]
                    },
                    {
                        [IS_PATTERN]: true,
                        type: 'ARRAY',
                        value: [
                            {
                                [IS_PATTERN]: true,
                                type: 'VALUE',
                                value: 'b'
                            },
                            {
                                [IS_PATTERN]: true,
                                type: 'VALUE',
                                value: 2
                            }
                        ]
                    }
                ]
            });

            result = normalizePattern<TestCase1>(['a', 1, [true, false, R('rest')]]);
            expect(result).toEqual({
                [IS_PATTERN]: true,
                type: 'ARRAY',
                value: [
                    {
                        [IS_PATTERN]: true,
                        type: 'VALUE',
                        value: 'a'
                    },
                    {
                        [IS_PATTERN]: true,
                        type: 'VALUE',
                        value: 1
                    },
                    {
                        [IS_PATTERN]: true,
                        type: 'ARRAY',
                        value: [
                            {
                                [IS_PATTERN]: true,
                                type: 'VALUE',
                                value: true
                            },
                            {
                                [IS_PATTERN]: true,
                                type: 'VALUE',
                                value: false
                            },
                            {
                                [IS_PATTERN]: true,
                                type: 'RestDecons',
                                value: 'rest'
                            }
                        ]
                    }
                ]
            });

            result = normalizePattern<TestCase2>([['a', R('rest1')], [R('rest')]]);
            expect(result).toEqual({
                [IS_PATTERN]: true,
                type: 'ARRAY',
                value: [
                    {
                        [IS_PATTERN]: true,
                        type: 'ARRAY',
                        value: [
                            {
                                [IS_PATTERN]: true,
                                type: 'VALUE',
                                value: 'a'
                            },
                            {
                                [IS_PATTERN]: true,
                                type: 'RestDecons',
                                value: 'rest1'
                            }
                        ]
                    },
                    {
                        [IS_PATTERN]: true,
                        type: 'ARRAY',
                        value: [{
                            [IS_PATTERN]: true,
                            type: 'RestDecons',
                            value: 'rest'
                        }]
                    }
                ]
            });
        });
    });

    describe('或类型测试', () => {
        type TestCase = [string, number] | {
            a: string;
            b: boolean;
        };

        test('pattern与类型不匹配(预期ts error, 但运行正常)', () => {
            // @ts-expect-error
            normalizePattern<TestCase>({a: 'a', b: 1});
            // @ts-expect-error
            normalizePattern<TestCase>(['a', true]);
            // @ts-expect-error
            normalizePattern<TestCase>({a: 'a', b: true, c: 1});
            // @ts-expect-error
            normalizePattern<TestCase>(null);
        });

        test('解析', () => {
            let result = normalizePattern<TestCase>({a: 'a', b: true});
            expect(result).toEqual({
                [IS_PATTERN]: true,
                type: 'OBJECT',
                value: {
                    a: {
                        [IS_PATTERN]: true,
                        type: 'VALUE',
                        value: 'a'
                    },
                    b: {
                        [IS_PATTERN]: true,
                        type: 'VALUE',
                        value: true
                    }
                }
            });

            result = normalizePattern<TestCase>(['a', 1]);
            expect(result).toEqual({
                [IS_PATTERN]: true,
                type: 'ARRAY',
                value: [
                    {
                        [IS_PATTERN]: true,
                        type: 'VALUE',
                        value: 'a'
                    },
                    {
                        [IS_PATTERN]: true,
                        type: 'VALUE',
                        value: 1
                    }
                ]
            });
        });
    });

    describe('invalid pattern', () => {
        test('非法pattern', () => {
            // @ts-expect-error
            expect(() => normalizePattern(undefined)).toThrow();
        });
    });
});


describe("功能性pattern测试", () => {
    const examplePatterns: {input: PatternInput<number[]>, expect: Pattern<number[]>}[] = [
        {
            input: [1, 2],
            expect: {
                [IS_PATTERN]: true,
                type: 'ARRAY',
                value: [
                    {
                        [IS_PATTERN]: true,
                        type: 'VALUE',
                        value: 1
                    },
                    {
                        [IS_PATTERN]: true,
                        type: 'VALUE',
                        value: 2
                    }
                ]
            }
        }, 
        {
            input: [1, R('rest')],
            expect: {
                [IS_PATTERN]: true,
                type: 'ARRAY',
                value: [
                    {
                        [IS_PATTERN]: true,
                        type: 'VALUE',
                        value: 1
                    },
                    {
                        [IS_PATTERN]: true,
                        type: 'RestDecons',
                        value: 'rest'
                    }
                ]
            }
        }
    ]
    test("解构", () => {
        expect(D('abc')).toEqual({
            [IS_PATTERN]: true,
            type: 'Decons',
            value: 'abc'
        })
        const syb = Symbol('abc');
        expect(D(syb)).toEqual({
            [IS_PATTERN]: true,
            type: 'Decons',
            value: syb
        });
        expect(D(123)).toEqual({
            [IS_PATTERN]: true,
            type: 'Decons',
            value: 123
        });
    });

    test("逻辑或", () => {
        expect(OR(...examplePatterns.map(it => it.input))).toEqual({
            [IS_PATTERN]: true,
            type: 'OR',
            value: examplePatterns.map(item => item.expect)
        });
        expect(OR<number[]>(...examplePatterns.map(it => it.expect))).toEqual({
            [IS_PATTERN]: true,
            type: 'OR',
            value: examplePatterns.map(item => item.expect)
        });
    });

    test("逻辑与", () => {
        expect(AND(...examplePatterns.map(it => it.input))).toEqual({
            [IS_PATTERN]: true,
            type: 'AND',
            value: examplePatterns.map(item => item.expect)
        });
        expect(AND<number[]>(...examplePatterns.map(it => it.expect))).toEqual({
            [IS_PATTERN]: true,
            type: 'AND',
            value: examplePatterns.map(item => item.expect)
        });
    })

    test("逻辑非", () => {
        expect(NOT(examplePatterns[0].input)).toEqual({
            [IS_PATTERN]: true,
            type: 'NOT',
            value: examplePatterns[0].expect
        });
        expect(NOT(examplePatterns[1].input)).toEqual({
            [IS_PATTERN]: true,
            type: 'NOT',
            value: examplePatterns[1].expect
        });
    });

    test("array rest解构", () => {
        expect(R('rest')).toEqual({
            [IS_PATTERN]: true,
            type: 'RestDecons',
            value: 'rest'
        });
        expect(R(123)).toEqual({
            [IS_PATTERN]: true,
            type: 'RestDecons',
            value: 123
        });
        const syb = Symbol('rest');
        expect(R(syb)).toEqual({
            [IS_PATTERN]: true,
            type: 'RestDecons',
            value: syb
        });
    })
})