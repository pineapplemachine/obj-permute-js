/**
 * Given an object which would be passed as an input to
 * {@link getObjectPermutations}, resolves to the type of an individual
 * permutation object.
 */
type ObjectPermutation<T> = {
    [K in keyof T]: T[K] extends (infer U)[] ? U : never;
};

/**
 * Accepts an object whose attributes associate keys with lists of values.
 * Returns an iterator which enumerates objects representing every combination
 * of attribute values within those lists.
 *
 * For example, the states object input `{x: [0, 1], y: [2, 3]}` corresponds
 * to the list of permutations containing the objects
 * `{x: 0, y: 2}`, `{x: 1, y: 2}`, `{x: 0, y: 3}`, and `{x: 1, y: 3}`.
 *
 * When any key in a states object refers to an empty array or any value
 * which is not array, that key will be disregarded and will not be included
 * in any way in the outputted permutation objects.
 *
 * Note that the order of enumerated objects is not guaranteed, nor is
 * the ordering of keys of each individual permutation object.
 *
 * @param states A states object associating keys with lists of possible
 * values.
 * @returns an {@link ObjectPermutationsIterator} instance which iterates
 * all those permutations represented by the inputted states object.
 */
export function getObjectPermutations<T extends object>(
    states: T
): ObjectPermutationsIterator<T> {
    return new ObjectPermutationsIterator(states);
}

/**
 * Iterator class for objects returned by {@link getObjectPermutations}.
 */
export class ObjectPermutationsIterator<T extends object> {
    // The input object describing all state permutations.
    readonly states: T;
    // Initialized to store a list of the state object's valid keys.
    readonly keys: (keyof T)[];
    // Initialized to store a list of indices pinpointing the iterator's
    // present location in the full list of permutations.
    readonly indices: number[];
    // Initialized to represent the full length of the iterator.
    // This length value may be inaccurate if the total number of permutations
    // exceeds the value of Number.MAX_SAFE_INTEGER.
    readonly length: number;
    
    // Flag is set to true when the final permutation was consumed by
    // the iteration.
    done: boolean;
    
    /**
     * Accepts an object describing lists of attribute states,
     * normally a value passed as an argument to {@link getObjectPermutations}.
     *
     * @param states A states object associating keys with lists of possible
     * values.
     */
    constructor(states: T) {
        this.states = states;
        this.keys = [];
        this.indices = [];
        this.length = 0;
        if(states && typeof(states) === "object") {
            for(const key in states) {
                if(Array.isArray(states[key]) && (<any> states[key]).length) {
                    this.keys.push(key);
                    this.indices.push(0);
                    this.length += +(<any> states[key]).length;
                }
            }
        }
        this.done = (this.keys.length === 0);
    }
    
    /**
     * Get the next permutation.
     *
     * @returns an IteratorResult whose `value` attribute, when the `done`
     * attribute was not true, is a permutation object.
     */
    next(): IteratorResult<ObjectPermutation<T>> {
        if(this.done) {
            return {done: true, value: <ObjectPermutation<T>> {}};
        }
        const result = <ObjectPermutation<T>> {};
        let carry: boolean = false;
        for(let i = 0; i < this.keys.length; i++) {
            const key: (keyof T) = this.keys[i];
            const values = this.states[key];
            result[key] = (<any> values)[this.indices[i]];
            this.indices[i] += (carry || i === 0) ? 1 : 0;
            if(this.indices[i] >= (<any> values).length) {
                this.indices[i] = 0;
                carry = true;
            }
            else {
                carry = false;
            }
        }
        if(carry) {
            this.done = true;
        }
        return {
            done: false,
            value: result,
        };
    }
    
    /**
     * Get an array containing the remaining values of this iterator.
     *
     * @returns an array of permutation objects.
     */
    array(): ObjectPermutation<T>[] {
        const results: ObjectPermutation<T>[] = [];
        while(true) {
            const next = this.next();
            if(next.done) {
                break;
            }
            else {
                results.push(next.value);
            }
        }
        return results;
    }
}

export default getObjectPermutations;
