import { keyType } from "./common.type";
import { is } from "./matcher";
import { PatternInput } from "./pattern/types";
import { OTHERWISE } from "./symbols";

type _matchReturn<T, R> = (props: {v: T, decons: Record<keyType, any>}) => R;

type _matcher<T, R> = {
    when: <C>(pattern: PatternInput<T>, callback: _matchReturn<T, C>) => _matcher<T, C | R>;
    run: () => R;
    otherwise: <C>(callback: () => C) => Pick<_matcher<T, Exclude<C | R, undefined>>, 'run'>;
}

function _match<T, R>(v: T, pre: () => R)  {
    const _patterns: (PatternInput<T> | OTHERWISE)[] = [];
    const _callbacks: _matchReturn<T, any>[] = [];

    function _matching() {
        if (_patterns.length === 0 || _patterns[0] === undefined) {
            throw new Error("Unexpected error: no pattern found");
        }
        const pat = _patterns[0];
        if (pat === OTHERWISE) {
            return {
                matchResult: true,
                decons: {}
            };
        }
        return is(v as any, pat);
    }

    function _getResult(): R | undefined {
        if (_callbacks.length === 0 || typeof _callbacks[0] !== "function") {
            throw new Error("Unexpected error: no callback found");
        }
        const { matchResult, decons } = _matching();
        if (matchResult) {
            return _callbacks[0]({v, decons});
        }
        return undefined;
    }

    function when<C, W extends PatternInput<T>>(pattern: W, callback: _matchReturn<T, C>): ReturnType<typeof _match<T, C | R>> {
        _patterns.push(pattern);
        _callbacks.push(callback);
        return _match(v, run);
    }

    function run() {
        const res = pre();
        if (res === undefined) {
            return _getResult();
        }
        return res;
    }

    function otherwise<C>(callback: () => C) {
        _callbacks.push(callback);
        _patterns.push(OTHERWISE);
        const matcher = _match(v, run) as ReturnType<typeof _match<T, C | R>>;
        return {
            run: matcher.run as () => Exclude<C | R, undefined>
        };
    }

    return {
        when,
        run,
        otherwise
    };
}

export function match<T>(v: T) {
    return {
       when: (_match(v, () => undefined) as _matcher<T, undefined>).when
    };
}

export { OR, AND, NOT, D, R } from "./pattern";
export { TYPE as T, EXIST as E, CUSTOMMATCHER } from './symbols';
