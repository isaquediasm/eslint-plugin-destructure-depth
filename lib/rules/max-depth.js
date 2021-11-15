/**
 * @fileoverview A rule to set the maximum depth objects can be destructured
 * @author Isaque Dias
 */
'use strict';

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
  meta: {
    type: 'suggestion',

    docs: {
      description: '',
      category: 'ECMAScript 6',
      recommended: false,
      url: 'https://eslint.org/docs/rules/prefer-destructuring',
    },

    schema: [
      {
        /*
         * old support {array: Boolean, object: Boolean}
         * new support {VariableDeclarator: {}, AssignmentExpression: {}}
         */
        oneOf: [
          {
            type: 'object',
            properties: {
              VariableDeclarator: {
                type: 'object',
                properties: {
                  array: {
                    type: 'boolean',
                  },
                  object: {
                    type: 'boolean',
                  },
                },
                additionalProperties: false,
              },
              AssignmentExpression: {
                type: 'object',
                properties: {
                  array: {
                    type: 'boolean',
                  },
                  object: {
                    type: 'boolean',
                  },
                },
                additionalProperties: false,
              },
            },
            additionalProperties: false,
          },
          {
            type: 'object',
            properties: {
              array: {
                type: 'boolean',
              },
              object: {
                type: 'boolean',
              },
            },
            additionalProperties: false,
          },
          {
            type: 'object',
            properties: {
              array: {
                type: 'object',
                properties: {
                  max: {
                    type: 'number',
                  },
                },
              },
              object: {
                type: 'object',
                properties: {
                  max: {
                    type: 'number',
                  },
                },
              },
            },
            additionalProperties: false,
          },
        ],
      },
      {
        type: 'object',
        properties: {
          enforceForRenamedProperties: {
            type: 'boolean',
          },
        },
        additionalProperties: false,
      },
    ],

    messages: {
      tooDeeply:
        'Blocks are destructured too deeply ({{depth}}). Maximum allowed is {{maxDepth}}.',
    },
  },

  create(context) {
    const DEFAULT_MAX_DEPTH = 0;
    const options = context.options[0] || {
      object: { max: DEFAULT_MAX_DEPTH },
    };
    const MAX_DEPTH = options.object.max;

    let normalizedOptions = {
      VariableDeclarator: { array: true, object: true },
      AssignmentExpression: { array: true, object: true },
      AssignmentPattern: { array: true, object: true },
    };

    //--------------------------------------------------------------------------
    // Helpers
    //--------------------------------------------------------------------------

    // eslint-disable-next-line jsdoc/require-description
    /**
     * @param {string} nodeType "AssignmentExpression" or "VariableDeclarator"
     * @param {string} destructuringType "array" or "object"
     * @returns {boolean} `true` if the destructuring type should be checked for the given node
     */
    function shouldCheck(nodeType, destructuringType) {
      return (
        normalizedOptions &&
        normalizedOptions[nodeType] &&
        normalizedOptions[nodeType][destructuringType]
      );
    }

    /**
     * Report that the given node is destructured too deeply
     * @param {ASTNode} reportNode the node to report
     * @param {number} depth the depth of destructuring
     * @returns {void}
     */
    function report(reportNode, depth) {
      context.report({
        node: reportNode,
        messageId: 'tooDeeply',
        data: { depth, maxDepth: MAX_DEPTH },
      });
    }

    function findDestructuringDepth(sourceNode, curDepth = 0) {
      let maxDepth = 0;
      let node = sourceNode;

      if (!node.properties || node.properties.length < 1) {
        return curDepth;
      }

      // recursively check all child properties for depth violations
      node.properties.forEach((prop) => {
        if (prop.value) {
          // regular nested object destructuring: `const { prop: { child } } = ...`
          if (prop.value.type === 'ObjectPattern') {
            const nodeDepth = findDestructuringDepth(prop.value, curDepth + 1);
            if (nodeDepth > maxDepth) {
              maxDepth = nodeDepth;
            }
          } else if (
            node.type === 'ObjectPattern' &&
            prop.value.type === 'AssignmentPattern' &&
            prop.value.left.type === 'ObjectPattern'
          ) {
            // object destructuring with assignment: `const { prop: { child } = {} } = ...`
            const nodeDepth = findDestructuringDepth(
              prop.value.left, // note: this is a subtle difference from the code above, so don't combine these cases
              curDepth + 1
            );
            if (nodeDepth > maxDepth) {
              maxDepth = nodeDepth;
            }
          }
        }
      });

      return Math.max(maxDepth, curDepth);
    }

    /**
     * Check that the `prefer-destructuring` rules are followed based on the
     * given left- and right-hand side of the assignment.
     *
     * Pulled out into a separate method so that VariableDeclarators and
     * AssignmentExpressions can share the same verification logic.
     * @param {ASTNode} leftNode the left-hand side of the assignment
     * @param {ASTNode} rightNode the right-hand side of the assignment
     * @param {ASTNode} reportNode the node to report the error on
     * @returns {void}
     */
    function performCheck(leftNode, rightNode, reportNode) {
      if (!leftNode.properties) return;
      if (shouldCheck(reportNode.type, 'object')) {
        const depth = findDestructuringDepth(leftNode);

        if (depth > MAX_DEPTH) {
          report(reportNode, depth);
        }
      }
    }

    /**
     * Check if a given variable declarator is coming from an property access
     * that should be using destructuring instead
     * @param {ASTNode} node the variable declarator to check
     * @returns {void}
     */
    function checkVariableDeclarator(node) {
      // Skip if variable is declared without assignment
      if (!node.init) {
        return;
      }

      performCheck(node.id, node.init, node);
    }

    /**
     * Run the `prefer-destructuring` check on an AssignmentExpression
     * @param {ASTNode} node the AssignmentExpression node
     * @returns {void}
     */
    function checkAssigmentExpression(node) {
      if (node.operator === '=') {
        performCheck(node.left, node.right, node);
      }
    }

    //--------------------------------------------------------------------------
    // Public
    //--------------------------------------------------------------------------

    return {
      VariableDeclarator: checkVariableDeclarator,
      AssignmentExpression: checkAssigmentExpression,
    };
  },
};
