/**
 * @fileoverview checks the encapsulation of modules in the architecture FSD
 * @author dondarubin
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/imports-from-public-api"),
  RuleTester = require("eslint").RuleTester;


//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parserOptions: {ecmaVersion: 6, sourceType: 'module'}
});

const aliasOptions = [
  {
    alias: '@'
  }
]

ruleTester.run("imports-from-public-api", rule, {
  valid: [
    {
      code: "import { SomeActions, SomeReducer } from '../../model/slices/SomeSlice'",
      errors: []
    },
    {
      code: "import { SomeActions, SomeReducer } from '@/entities/Article'",
      errors: [],
      options: aliasOptions
    },
    {
      filename: 'C:\\Users\\ulbi-project\\src\\entities\\file.test.ts',
      code: "import { SomeActions, SomeReducer } from '@/entities/Article/testing'",
      errors: [],
      options: [{
        alias: '@',
        testFilesPatterns: ['**/*.test.ts', '**/*.test.ts', '**/StoreDecorator.tsx']
      }]
    },
    {
      filename: 'C:\\Users\\ulbi-project\\src\\entities\\StoreDecorator.tsx',
      code: "import { SomeActions, SomeReducer } from '@/entities/Article/testing'",
      errors: [],
      options: [{
        alias: '@',
        testFilesPatterns: ['**/*.test.ts', '**/*.test.ts', '**/StoreDecorator.tsx']
      }]
    },
  ],

  invalid: [
    {
      code: "import { SomeActions, SomeReducer } from '@/entities/Article/model/slice/SomeSlice'",
      errors: [{message: "Absolute import is allowed only from the public api (index.ts)"}],
      options: aliasOptions
    },
    {

      filename: 'C:\\Users\\ulbi-project\\src\\entities\\StoreDecorator.tsx',
      code: "import { SomeActions, SomeReducer } from '@/entities/Article/testing/file.tsx'",
      errors: [{message: "Absolute import is allowed only from the public api (index.ts)"}],
      options: [{
        alias: '@',
        testFilesPatterns: ['**/*.test.ts', '**/*.test.ts', '**/StoreDecorator.tsx']
      }]
    },
    {
      filename: 'C:\\Users\\ulbi-project\\src\\entities\\forbidden.ts',
      code: "import { SomeActions, SomeReducer } from '@/entities/Article/testing'",
      errors: [{message: "The test data must be imported from the public api (testing.ts)"}],
      options: [{
        alias: '@',
        testFilesPatterns: ['**/*.test.ts', '**/*.test.ts', '**/StoreDecorator.tsx']
      }]
    },
  ],
});

