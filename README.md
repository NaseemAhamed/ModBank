# ModBank — FinTech Fix-It Challenge

A self-contained, Angular-powered coding game for a careers charity event booth. Visitors play three short missions: fix a deposit calculation, stop duplicate payments, and repair transaction categorisation. **All balances, people, transactions and payment actions are fictional.**

> **ModBank is a fictional educational demonstration, not an actual bank or a Modulr Finance product.** The name was proposed for an event run by Modulr Finance staff; the demo does not use company credentials or APIs.

## Quick start:

**Prerequisite:** Docker Desktop (or Docker Engine + Compose plugin), with the Docker service started. Internet access is needed **once** to download the Node/Nginx images and npm packages during the initial build.

```bash
git clone YOUR_GITHUB_REPO_URL
cd modbank
docker compose up -d --build
```

Open **http://localhost:8080** on that laptop. To stop the game: `docker compose down`.

Each laptop runs the app independently and does **not** contact a server, database, API, Google Fonts, or third-party analytics service after the image has been built. Ports bind only to local loopback (`127.0.0.1`), not the public network. The app runs in the browser: refreshing starts at the welcome page, and **New visitor** clears in-memory progress.

### Recommended for event reliability

Build and test one known-good image **before** the event, then use that same image on all six machines. After the image is built on an online laptop, export it:

```bash
docker save -o modbank-image.tar modbank-fintech-challenge:1.0.0
```

Transfer the tarball plus `compose.yaml` to each laptop. From a folder containing `compose.yaml`:

```bash
docker load -i modbank-image.tar
docker compose up -d --no-build
```

Open http://localhost:8080. The image itself does not need internet to launch. **Ensure the laptops have enough disk space and are using compatible CPU architectures**; if some laptops are ARM (for example Apple Silicon) and others x86_64, build/export one image per architecture, or publish a multi-platform image.

### Offline test checklist

1. Disconnect Wi-Fi after the Docker image has been built or loaded.
2. Open `http://localhost:8080` in a modern Chrome/Edge/Firefox/Safari browser.
3. Complete all three missions in **Guided Mode**, checking that the balance, payment safety and transaction labels update.
4. Select **New visitor**, then complete each mission in **Code Mode** by changing the return expression.
5. Press **Reset code** and **Hint** on a fresh mission to ensure they work.
6. Refresh the browser and confirm it starts at the welcome screen.
7. Reboot the laptop, wait for Docker to start, then check the URL again.
8. Set screen brightness, disable automatic screen lock, and leave each laptop at the start screen before opening the booth.

## Developer setup

Requires Node.js 22.12+ (Node 22 is used in Docker). Angular v21 LTS is intentionally selected to work with a typical Node 22 install.

```bash
npm install
npm start                 # http://localhost:4200
npm test                  # engine and safety tests
npm run build             # production build under dist/modbank/browser
```

> **Dependency lockfile note:** The repository package provided here has no `package-lock.json` because the environment used to generate it could not reach npm. Run `npm install` in a networked environment, commit the generated lockfile, then switch Docker and CI installs from `npm install` to `npm ci` for truly repeatable builds. Do this before the event.

## What is included

- Angular standalone components, TypeScript and Signals for state.
- CodeMirror 6 TypeScript editor in Code Mode; multiple-choice Guided Mode for first-timers.
- Four behavioural checks per mission, friendly error messages and two hints.
- Banking monitor that reacts after each passed mission.
- Welcome screen, progress tracking, career badges, victory and new-visitor reset.
- Static Nginx Docker runtime, loopback-only Compose port, GitHub Actions verification.

## How the code challenges work (important safety note)

The editor resembles a TypeScript function, but **only the single `return` expression is evaluated**. `safe-expression.ts` contains a deliberately tiny parser/interpreter for arithmetic, booleans, comparisons and ternaries. The wrapper function name, argument names/types and braces must stay unchanged. This is **not a full TypeScript compiler**. JavaScript statements, `eval`, `Function`, property access, loops, network calls and arbitrary function calls cannot run through this interpreter. The tests verify behaviour for different inputs; they do not merely compare the student's code to one exact answer.

Code and results are kept only in Angular's memory; nothing is uploaded or permanently saved. No personal information is requested.

## Structure

```text
src/app/core/
  challenges.ts              # three missions, hints, starter code and test cases
  challenge-engine.ts        # result and test reporting
  safe-expression.ts         # restricted interpreter (no dynamic execution)
  game-state.service.ts      # Angular signals and visitor reset
src/app/features/
  welcome.component.ts       # visitor intro and mode choice
  mission.component.ts       # playable coding challenges
  dashboard.component.ts     # live fictional bank dashboard
  victory.component.ts       # celebration and careers explainer
src/app/shared/
  code-editor.component.ts   # embedded CodeMirror 6
```

## Troubleshooting

- **Port 8080 in use?** Update the left-hand port in `compose.yaml` from `8080` to another local port, such as `8081`, then open the corresponding URL.
- **Docker doesn't start after a reboot?** Open Docker Desktop and run `docker compose up -d --no-build` again.
- **Blank page or 404?** Check `docker compose ps` and `docker compose logs modbank`, then hard refresh the browser.
- **Image cannot be built with no Wi-Fi?** You must build or load the pre-built image before going offline.
- **Editor does not accept full TypeScript statements?** This is intentional. Edit the expression following `return`, not the function body or signature.

## Licence and branding

This package deliberately does **not** include an open-source licence; ask your company to choose one before publishing. This project uses its own ModBank styling and does **not** package any official Modulr brand artwork. Have the relevant company stakeholder approve use of the name and any visual branding before publicly publishing the GitHub repository.
