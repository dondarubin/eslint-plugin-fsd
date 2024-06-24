"use strict";

const rule = require("../../../lib/rules/fsd-check-layer"),
  RuleTester = require("eslint").RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const aliasOptions = [
  {
    alias: "@"
  }
]

const ruleTester = new RuleTester({
  parserOptions: {ecmaVersion: 6, sourceType: 'module'}
});
ruleTester.run("fsd-check-layer", rule, {
  valid: [
    {
      filename: 'C:\\Users\\ulbi-project\\src\\features\\Article',
      code: "import { SomeActions, SomeReducer } from '@/shared/Button.tsx'",
      errors: [],
      options: aliasOptions
    },
    {
      filename: 'C:\\Users\\ulbi-project\\src\\features\\Article',
      code: "import { SomeActions, SomeReducer } from '@/entities/Button.tsx'",
      errors: [],
      options: aliasOptions
    },
    {
      filename: 'C:\\Users\\ulbi-project\\src\\app\\Article',
      code: "import { SomeActions, SomeReducer } from '@/widgets/Button.tsx'",
      errors: [],
      options: aliasOptions
    },
    {
      filename: 'C:\\Users\\ulbi-project\\src\\widgets\\Article',
      code: "import { useLocation } from 'react-router-dom'",
      errors: [],
      options: aliasOptions
    },
    {
      filename: 'C:\\Users\\ulbi-project\\src\\app\\providers',
      code: "import { SomeActions, SomeReducer } from 'redux'",
      errors: [],
      options: aliasOptions
    },
    {
      filename: 'C:\\Users\\ulbi-project\\src\\index.tsx',
      code: "import { StoreProvider } from '@/app/providers/StoreProvider'",
      errors: [],
      options: aliasOptions
    },
    {
      filename: 'C:\\Users\\ulbi-project\\src\\entities\\Article.tsx',
      code: "import { StateSchema } from '@/app/providers/StoreProvider'",
      errors: [],
      options: [
        {
          alias: '@',
          ignoreImportPatterns: ['**/StoreProvider']
        }
      ]
    },
  ],

  invalid: [
    {
      filename: 'C:\\Users\\ulbi-project\\src\\entities\\providers',
      code: "import { SomeActions, SomeReducer } from '@/features/Article'",
      errors: [{ message: "A layer can import only the underlying layers" }],
      options: aliasOptions
    },
    {
      filename: 'C:\\Users\\ulbi-project\\src\\features\\providers',
      code: "import { SomeActions, SomeReducer } from '@/widgets/Article'",
      errors: [{ message: "A layer can import only the underlying layers" }],
      options: aliasOptions
    },
    {
      filename: 'C:\\Users\\ulbi-project\\src\\entities\\providers',
      code: "import { SomeActions, SomeReducer } from '@/widgets/Article'",
      errors: [{ message: "A layer can import only the underlying layers" }],
      options: aliasOptions
    },
  ],
});
