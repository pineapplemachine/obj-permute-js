# @pinemach/obj-permute

[![Coverage Status][coverage-image]][coverage-url]
[![Build Status][travis-image]][travis-url]
[![NPM version][npm-version-image]][npm-url]
[![MIT License][license-image]][license]

**@pinemach/obj-permute** is a small JavaScript package with a single concern:
truncating datetime inputs to remove all precision past a given time unit.

You can read the full API documentation at 
**[pineapplemachine.github.io/obj-permute-js/](https://pineapplemachine.github.io/obj-permute-js/)**.

[license-image]: http://img.shields.io/badge/license-MIT-blue.svg
[license]: https://github.com/pineapplemachine/obj-permute-js/blob/master/LICENSE

[travis-url]: https://travis-ci.org/pineapplemachine/obj-permute-js
[travis-image]: https://travis-ci.org/pineapplemachine/obj-permute-js.svg?branch=master

[npm-url]: https://www.npmjs.com/package/@pinemach/obj-permute
[npm-version-image]: https://badge.fury.io/js/%40pinemach%2Fobj-permute.svg

[coverage-url]: https://coveralls.io/github/pineapplemachine/obj-permute-js?branch=master
[coverage-image]: https://coveralls.io/repos/github/pineapplemachine/obj-permute-js/badge.svg?branch=master

## Installation

You can install this package with the package manager of your choice. For example,

```
npm install @pinemach/obj-permute
```

You can then import and use the module like so:

``` js
// CommonJS
const getObjectPermutations = require("@pinemach/obj-permute").getObjectPermutations;
```

``` js
// ES6 modules
import getObjectPermutations from "@pinemach/obj-permute";
```

## Usage

This package exports the **getObjectPermutations** function, which
accepts an object whose attributes associate keys with lists of values.

The function returns an iterator which enumerates objects representing
every combination of attribute values within those lists.

For example, the states object input `{x: [0, 1], y: [2, 3]}` corresponds
to the list of permutations containing the objects
`{x: 0, y: 2}`, `{x: 1, y: 2}`, `{x: 0, y: 3}`, and `{x: 1, y: 3}`.

``` js
import getObjectPermutations from "@pinemach/obj-permute";

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
```
