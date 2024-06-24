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
  ],

  invalid: [
    {
      code: "import { SomeActions, SomeReducer } from '@/entities/Article/model/slice/SomeSlice'",
      errors: [{message: "Absolute import is allowed only from the public api (index.ts)"}],
      options: aliasOptions
    },
  ],
});
