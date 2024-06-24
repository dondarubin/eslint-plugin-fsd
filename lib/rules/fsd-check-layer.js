"use strict";

const {isPathRelative} = require("../helpers");
const mircomatch = require("micromatch");
const path = require('path');

module.exports = {
  meta: {
    type: null, // `problem`, `suggestion`, or `layout`
    docs: {
      description: "Checking FSD layers imports", recommended: false, url: null, // URL to the documentation page for this rule
    }, fixable: null, // Or `code` or `whitespace`
    schema: [     // Add a schema if the rule has options
      {
        type: 'object',
        properties: {
          alias: {
            type: 'string'
          },
          ignoreImportPatterns: {
            type: 'array'
          }
        }
      }
    ],
  },

  create(context) {
    const layers = {
      'app': ['pages', 'widgets', 'features', 'entities', 'shared'],
      'pages': ['widgets', 'features', 'entities', 'shared'],
      'widgets': ['features', 'entities', 'shared'],
      'features': ['entities', 'shared'],
      'entities': ['entities', 'shared'],
      'shared': ['shared'],
    }

    const availableLayers = {
      'app': 'app',
      'pages': 'pages',
      'widgets': 'widgets',
      'features': 'features',
      'entities': 'entities',
      'shared': 'shared',
    }

    const {alias = '', ignoreImportPatterns = []} = context.options[0] ?? {};

    const getCurrentFileLayer = () => {
      const currentFilePath = context.getFilename();

      const normalizedPath = path.toNamespacedPath(currentFilePath);
      const projectPath = normalizedPath?.split('src')[1];
      const segments = projectPath?.split('\\');

      return segments?.[1];
    }

    const getImportLayer = (value) => {
      const importPath = alias ? value.replace(`${alias}/`, '') : value;
      const segmets = importPath?.split('/')

      return segmets?.[0]
    }

    return {
      ImportDeclaration(node) {
        const importPath = node.source.value;
        const currentFileLayer = getCurrentFileLayer();
        const importLayer = getImportLayer(importPath);

        if (isPathRelative(importPath)) {
          return;
        }

        // проверяем 2 слоя: в котором находимся и импорируемый (проверка на библиотеки)
        if (!availableLayers[importLayer] || !availableLayers[currentFileLayer]) {
          return;
        }

        const isIgnored = ignoreImportPatterns.some(pattern => {
          return mircomatch.isMatch(importPath, pattern);
        })

        if (isIgnored){
          return;
        }

        if (!layers[currentFileLayer]?.includes(importLayer)){
          context.report(node, "A layer can import only the underlying layers")
        }
      }
    };
  },
};
