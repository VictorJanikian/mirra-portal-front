# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Development Commands

```bash
npm run serve    # Start development server with hot-reload
npm run build    # Create production build
npm run lint     # Run ESLint
```

## Tech Stack

- **Framework:** Vue.js 3.x with Vue CLI 5
- **Language:** JavaScript (ES2020+) with Babel transpilation
- **Linting:** ESLint with `plugin:vue/vue3-essential` and `eslint:recommended`

## Architecture

This is a Vue 3 single-page application using Vue CLI.

**Key paths:**
- `src/main.js` - Application entry point, creates and mounts the Vue app
- `src/App.vue` - Root component
- `src/components/` - Vue single-file components
- `src/assets/` - Static assets (images, etc.)
- `public/` - Static files served as-is (index.html template)

**Import alias:** `@/*` maps to `src/*`

## Conventions

- PascalCase for Vue component file names (e.g., `HelloWorld.vue`)
- Single-file components (.vue) with template, script, and scoped styles
