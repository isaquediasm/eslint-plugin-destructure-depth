# eslint-plugin-destructure-depth

This rule enforces the usage of single-level destructuring over deep destructuring.

````js
    // bad
    // undefined `b` or `object` would cause a runtime error
    const {a, b: {d: {e: f}}, c} = object;

    // good
    const {a, c} = object;
    const f = object.?b.?d.?e;
    ```
````
