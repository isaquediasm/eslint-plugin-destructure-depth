/**
 * @fileoverview Prefer destructuring from arrays and objects
 * @author Alex LaFroscia
 */
'use strict';

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require('../../../lib/rules/max-destructure-depth.js'),
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
      code: 'var {bar: { a: { b } }} = object.foo;',
      output: null,
      errors: [
        {
          messageId: 'tooDeeply',
          data: { depth: 2, maxDepth: 0 },
          type: 'VariableDeclarator',
        },
      ],
    },
  ],
});
