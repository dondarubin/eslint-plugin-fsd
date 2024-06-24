"use strict";

const rule = require("../../../lib/rules/fsd-check-path"),
  RuleTester = require("eslint").RuleTester;

const ruleTester = new RuleTester({
  parserOptions: {ecmaVersion: 6, sourceType: 'module'}
});
ruleTester.run("fsd-check-path", rule, {
  valid: [
    {
      filename: 'C:\\Users\\ulbi-project\\src\\entities\\Article',
      code: "import { SomeActions, SomeReducer } from '../../model/slices/SomeSlice'",
      errors: [],
    },
  ],

  invalid: [
    {
      filename: 'C:\\Users\\ulbi-project\\src\\entities\\Article',
      code: "import { SomeActions, SomeReducer } from 'entities/Article/model/slices/SomeSlice'",
      errors: [{ message: "Within a current slice, the paths must be relative" }],
    },
    {
      filename: 'C:\\Users\\ulbi-project\\src\\entities\\Article',
      code: "import { SomeActions, SomeReducer } from '@/entities/Article/model/slices/SomeSlice'",
      errors: [{ message: "Within a current slice, the paths must be relative" }],
      options: [
        {
          alias: '@'
        }
      ]
    },
  ],
});
