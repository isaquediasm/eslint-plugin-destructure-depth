/**
 * @fileoverview A rule to set the maximum depth objects can be destructured
 * @author Isaque Dias
 */
'use strict';

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require('../../../lib/rules/max-depth.js'),
  RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester({ parserOptions: { ecmaVersion: 6 } });

ruleTester.run('prefer-destructuring', rule, {
  valid: [
    {
      code: 'var { bar } = object;',
      options: [{ object: true }],
    },
    {
      code: 'var { bar } = object.foo;',
      options: [{ object: true }],
    },
    {
      code: 'const { ...rest } = object.foo;',
      options: [{ object: true }],
      parserOptions: { ecmaVersion: 9 },
    },
    {
      code: 'const { bar = {} } = {}',
      options: [{ object: true }],
      parserOptions: { ecmaVersion: 9 },
    },
    {
      code: 'const { foo: { bar } } = {}',
      options: [{ object: { max: 1 } }],
      parserOptions: { ecmaVersion: 9 },
    },
    {
      code: 'const { a, b, foo: { bar } } = {}',
      options: [{ object: { max: 1 } }],
      parserOptions: { ecmaVersion: 9 },
    },
  ],

  invalid: [
    {
      code: 'var {bar: { a }} = object;',
      output: null,
      errors: [
        {
          messageId: 'tooDeeply',
          data: { depth: 1, maxDepth: 0 },
          type: 'VariableDeclarator',
        },
      ],
    },
    {
      code: 'var {foo, bar: { a: { b } }} = object.foo;',
      output: null,
      errors: [
        {
          messageId: 'tooDeeply',
          data: { depth: 2, maxDepth: 0 },
          type: 'VariableDeclarator',
        },
      ],
    },
    {
      code: 'const { foo: { bar } = {}, baz } = {}',
      output: null,
      errors: [
        {
          messageId: 'tooDeeply',
          data: { depth: 1, maxDepth: 0 },
          type: 'VariableDeclarator',
        },
      ],
      parserOptions: { ecmaVersion: 9 },
    },
    {
      code: 'const { first, second: { third } = {} } = {}',
      output: null,
      errors: [
        {
          messageId: 'tooDeeply',
          data: { depth: 1, maxDepth: 0 },
          type: 'VariableDeclarator',
        },
      ],
      parserOptions: { ecmaVersion: 9 },
    },
    {
      code: 'const { one, first: { second: { third } } = {} } = {}',
      output: null,
      options: [{ object: { max: 1 } }],
      errors: [
        {
          messageId: 'tooDeeply',
          data: { depth: 2, maxDepth: 1 },
          type: 'VariableDeclarator',
        },
      ],
      parserOptions: { ecmaVersion: 9 },
    },
  ],
});
