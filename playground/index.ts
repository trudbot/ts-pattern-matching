import { match } from "../src";

const a = match("abc")
    .when("abc", () => 1)
    .when("def", () => 2)
    .when("ghi", () => 3)
    .otherwise(() => true)
    .run();
console.log(a); // 1
