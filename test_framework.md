# Testing Framework Setup Prompt (Spec-Driven)

We are doing spec-driven development.

Write me a prompt I can use in VSCode or Cursor to generate Spec files which describe our testing setup.

I want to add testing frameworks to my project, but I do NOT want to write tests yet.
I only want the framework setup and wiring (configs + scripts) for:

- unit tests
- integration/API tests
- e2e tests

Project context:
- Backend: NestJS (TypeScript)
- Database: MySQL
- Structure includes modules like auth, issues, votes, suggestions
- Existing scripts: start, start:dev

Constraints:
- do not change application behavior
- do not add features
- do not create real test cases
- keep changes minimal
- follow spec-driven development
- output should be:
  1. spec file(s)
  2. step-by-step implementation plan
  3. verification commands (even if there are 0 tests)

The output should include:

1. Spec files describing:
   - testing frameworks to use (Jest, Supertest, Playwright if needed)
   - configuration approach
   - scripts to be added in package.json

2. Implementation Plan:
   - small, safe steps
   - each step suitable for one Git commit
   - include commit message examples

3. Verification Steps:
   - commands like:
     npm run test
     npm run test:e2e
     npx playwright --version
   - expected results (even if 0 tests)

4. Safety Notes:
   - ensure no behavior changes
   - ensure app still runs

Do NOT:
- write test cases
- modify business logic
- change existing endpoints

If you start generating tests, STOP immediately.

Focus only on framework setup planning.
