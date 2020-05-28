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

## Installation

Use Yarn or NPM to install the package.

```
yarn install eslint-plugin-destructure-depth --dev
```

## Usage

Add `destructure-depth` to the plugins section of your .eslintrc configuration file. You can omit the eslint-plugin- prefix:

```json
{
  "plugins": ["destructure-depth"]
}
```

Then configure the rules you want to use under the rules section.

```json
{
  "rules": {
    "destructure-depth/max-depth": ["warn"]
  }
}
```

To customize the allowed destructuring depth:

```json
{
  "rules": {
    "destructure-depth/max-depth": [
      "warn",
      {
        "object": {
          "max": 1
        }
      }
    ]
  }
}
```

This will allow up to 1 level deep of destructuring:

```js
const {
  a: { b },
} = object;
```

## License

[MIT License](https://github.com/isaquediasm/redux-tracking-middleware/master/LICENSE.md) © [Isaque Dias](https://github.com/isaquediasm)
