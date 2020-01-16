import {strict as assert} from "assert";

import {Group} from "canary-test";

const canary = Group("@pinemach/obj-permute");

import getObjectPermutations from "../src/index";

canary.test("permutations of empty state object", function() {
    const empty = () => getObjectPermutations({});
    assert(empty().next().done);
    assert.equal(empty().array().length, 0);
});

canary.test("permutations of singular state object", function() {
    const single = getObjectPermutations({
        x: [0],
        y: [1],
        z: ["!?"],
    }).array();
    assert.deepEqual(single, [{x: 0, y: 1, z: "!?"}]);
});

canary.test("state object with two permutations", function() {
    const results = getObjectPermutations({
        x: ["hello"],
        y: ["there", "world"],
    }).array();
    assert.equal(results.length, 2);
    assert(results.some(result => result.x === "hello" && result.y === "there"));
    assert(results.some(result => result.x === "hello" && result.y === "world"));
});

canary.test("state object with many permutations", function() {
    const results = getObjectPermutations({
        inf: [Infinity],
        bool: [true, false],
        int: [0, 1, 2, 3],
        char: ["a", "b", "c"],
    }).array();
    assert.equal(results.length, 24);
    const find = (inf: number, bool: boolean, int: number, char: string) => (
        results.find(result => (
            result.inf === inf &&
            result.bool === bool &&
            result.int === int &&
            result.char === char
        ))
    );
    const check = (inf: number, bool: boolean, int: number, char: string) => (
        assert.deepEqual(
            find(inf, bool, int, char),
            {inf: inf, bool: bool, int: int, char: char}
        )
    );
    check(Infinity, true, 0, "a");
    check(Infinity, true, 0, "b");
    check(Infinity, true, 0, "c");
    check(Infinity, true, 1, "a");
    check(Infinity, true, 1, "b");
    check(Infinity, true, 1, "c");
    check(Infinity, true, 2, "a");
    check(Infinity, true, 2, "b");
    check(Infinity, true, 2, "c");
    check(Infinity, true, 3, "a");
    check(Infinity, true, 3, "b");
    check(Infinity, true, 3, "c");
    check(Infinity, false, 0, "a");
    check(Infinity, false, 0, "b");
    check(Infinity, false, 0, "c");
    check(Infinity, false, 1, "a");
    check(Infinity, false, 1, "b");
    check(Infinity, false, 1, "c");
    check(Infinity, false, 2, "a");
    check(Infinity, false, 2, "b");
    check(Infinity, false, 2, "c");
    check(Infinity, false, 3, "a");
    check(Infinity, false, 3, "b");
    check(Infinity, false, 3, "c");
});

canary.test("permutations of state object with an empty array", function() {
    const results = getObjectPermutations({
        bool: [false, true],
        empty: [],
    }).array();
    assert.deepEqual(results, [
        {bool: false},
        {bool: true},
    ]);
});

canary.test("permutations of state object with non-array members", function() {
    const results = getObjectPermutations({
        num: [-0.5, +0.0, +0.5],
        invalid: "this is not an array",
        nil: null,
        undef: undefined,
        obj: {a: 0},
    }).array();
    assert.deepEqual(results, [
        {num: -0.5},
        {num: +0.0},
        {num: +0.5},
    ]);
});

canary.test("permutations of non-object inputs", function() {
    assert(getObjectPermutations(<any> null).next().done);
    assert(getObjectPermutations(<any> undefined).next().done);
    assert(getObjectPermutations(<any> 1).next().done);
    assert(getObjectPermutations(<any> "oops").next().done);
});

canary.test("readme code example", function() {
    // Get an iterator for every combination of attribute values
    const permutations = getObjectPermutations({
        x: [0, 1],
        y: [2, 3],
    });
    // Get an array from that iterator
    const permutationsArray = permutations.array();
    // Verify that each expected item is present
    assert(permutationsArray.length === 4);
    assert(permutationsArray.find(
        result => result.x === 0 && result.y === 2
    ));
    assert(permutationsArray.find(
        result => result.x === 1 && result.y === 2
    ));
    assert(permutationsArray.find(
        result => result.x === 0 && result.y === 3
    ));
    assert(permutationsArray.find(
        result => result.x === 1 && result.y === 3
    ));
});

canary.doReport();
