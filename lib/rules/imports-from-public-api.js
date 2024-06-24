"use strict";

const {isPathRelative} = require("../helpers");
const mircomatch = require("micromatch");

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
          },
          testFilesPatterns: {
            type: 'array'
          }
        }
      }
    ],
  },

  create(context) {
    const {alias = '', testFilesPatterns = []} = context.options[0] ?? {};

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

        // entities
        const layer = segments[0];

        if (!checkingLayers[layer]){
          return;
        }

        const isImportNotFromPublicApi = segments.length > 2;

        // [entities, Article, testing]
        const isTestingPublicApi = segments[2] === 'testing' && segments.length < 4;

        if (isImportNotFromPublicApi && !isTestingPublicApi) {
          context.report(node, "Absolute import is allowed only from the public api (index.ts)")
        }

        if (isTestingPublicApi) {
          // example C:\Users\...\src\entities\Article
          const currentFilePath = context.getFilename();

          // true - если файл тестовый
          const currentFileIsTesting = testFilesPatterns.some(
            pattern => mircomatch.isMatch(currentFilePath, pattern)
          )

          if (!currentFileIsTesting) {
            context.report(node, "The test data must be imported from the public api (testing.ts)")
          }
        }
      }
    };
  },
};

