"use strict";

const {isPathRelative} = require("../helpers");
module.exports = {
  meta: {
    type: null, // `problem`, `suggestion`, or `layout`
    docs: {
      description: "checks the encapsulation of modules in the architecture FSD",
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

    const checkingLayers = {
      'entities': 'entities',
      'features': 'features',
      'pages': 'pages',
      'widgets': 'widgets',
    }

    return {
      ImportDeclaration(node) {
        // example entities\Article
        const value = node.source.value
        // Если был передан alias, то удаляем, если нет - оставляем как и было
        const importFrom = alias ? value.replace(`${alias}/`, '') : value;

        if (isPathRelative(importFrom)) {
          return;
        }

        // [entities, Article, model]
        const segments = importFrom.split('/');
        const isImportNotFromPublicApi = segments.length > 2;

        // entities
        const layer = segments[0];

        if (!checkingLayers[layer]){
          return;
        }

        if (isImportNotFromPublicApi) {
          context.report(node, "Absolute import is allowed only from the public api (index.ts)")
        }
      }
    };
  },
};

