"use strict";

const rule = require("../../../lib/rules/fsd-check-path"),
  RuleTester = require("eslint").RuleTester;

const ruleTester = new RuleTester();
ruleTester.run("fsd-check-path", rule, {
  valid: [

  ],

  invalid: [
    {
      code: "error",
      errors: [{ message: "Fill me in.", type: "Me too" }],
    },
  ],
});
