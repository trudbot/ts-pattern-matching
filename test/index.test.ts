import {match} from '../src/index'
describe('match 测试', () => {
    let result;
    test('number', () => {
        result = match(123)
            .when(29, () => '123')
            .when(123, () => '123')
            .otherwise(() => 'otherwise')
            .run();
        expect(result).toBe('123');

        result = match(123)
            .when(29, () => '123')
            .when(113, () => '123')
            .otherwise(() => 'otherwise')
            .run();
        expect(result).toBe('otherwise');
    });

    test('边界情况(不传/乱传参数)', () => {
        result = () => match(123)
            // @ts-expect-error
            .when()
            .when(113, () => '123')
            .run();
        expect(result).toThrow();

        result = () => match(123)
            // @ts-expect-error
            .when(113, undefined)
            .run();

        expect(result).toThrow();

        result = () => match(123)
            .when(113, () => '123')
            // @ts-expect-error
            .otherwise()
            .run();
        expect(result).toThrow();

        result = () => match(123)
            // @ts-expect-error
            .when(undefined, () => '123')
            .run();
        expect(result).toThrow();

        result = match(null)
            .when(null, () => '123')
            .run();
        expect(result).toBe('123');
    })
})