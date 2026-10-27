# Validation notes — generated package

The app code was created in an environment without Docker and without network access to the npm registry. As a result, a full Angular compilation, browser smoke test, Docker build, and `npm test` using project-installed packages **could not** be run here. **The app is provided as a ready-to-build project, not a verified Docker image.**

Checks performed locally:

- All project TypeScript source files passed the TypeScript syntax parser (no parse diagnostics).
- The four dependency-free engine modules passed strict TypeScript compilation with the globally available compiler.
- All three intentionally broken starter challenges failed tests as expected.
- All three corrected challenges passed four behavioural tests each.
- Unsafe syntax examples (function calls, property access, global identifiers and added statements) were rejected.
- Restricted interpreter verified arithmetic, conditional expressions and negation.

Before distributing to six laptops:

1. On an internet-connected machine, run `npm install`, `npm test`, and `npm run build`.
2. Commit the generated `package-lock.json`; replace `npm install` with `npm ci` in Dockerfile and CI workflow.
3. Run `docker compose up -d --build` and smoke-test the app in a real browser.
4. Export and load the tested image to the remaining machines as described in README.md.
