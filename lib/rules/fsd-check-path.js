"use strict";

const path = require('path');
const {isPathRelative} = require("../helpers");

module.exports = {
  meta: {
    type: null, // `problem`, `suggestion`, or `layout`
    docs: {
      description: "check relative path in Feature Sliced Design",
      recommended: false,
      url: null, // URL to the documentation page for this rule
    },
    fixable: null, // Or `code` or `whitespace`
    schema: [     // Add a schema if the rule has options
      {
        type: 'object',
        properties: {
          alias: {
            type: 'string'
          }
        }
      }
    ],
  },

  create(context) {
    const alias = context.options[0]?.alias ?? '';

    return {
      ImportDeclaration(node) {
        // example entities\Article
        const value = node.source.value
        // Если был передан alias, то удаляем, если нет - оставляем как и было
        const importFrom = alias ? value.replace(`${alias}/`, '') : value;

        // example C:\Users\...\src\entities\Article
        const currentFilePath = context.getFilename();

        if (mustBeRelative(currentFilePath, importFrom)) {
          context.report(node, "Within a current slice, the paths must be relative")
        }
      }
    };
  },
};

const layers = {
  'entities': 'entities',
  'features': 'features',
  'pages': 'pages',
  'shared': 'shared',
  'widgets': 'widgets',
}

function mustBeRelative(from, to) {
  if (isPathRelative(to)) {
    return false;
  }

  const toArray = to.split('/')
  const toLayer = toArray[0] //entities
  const toSlice = toArray[1] // Article

  if (!toLayer || !toSlice || !layers[toLayer]) {
    return false
  }

  const normalizedPath = path.toNamespacedPath(from);
  const projectFrom = normalizedPath.split('src')[1]; // entities/Article
  const fromArray = projectFrom.split('\\');          // ['', 'entities', 'Article']

  const fromLayer = fromArray[1] // entities
  const fromSlice = fromArray[2] // Article

  if (!fromLayer || !fromSlice || !layers[fromLayer]) {
    return false
  }

  return fromSlice === toSlice && fromLayer === toLayer
}