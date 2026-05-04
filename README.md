# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
# Authoring App

A responsive Single Page Application for authoring structured learning content — built with React, TypeScript, and Tailwind CSS.

---

## Tech Stack

| Layer | Choice | Reason |
|-------|--------|--------|
| Framework | React 18 + Vite | Fast dev server, modern React features |
| Language | TypeScript | Type safety catches bugs at compile time |
| Styling | Tailwind CSS v4 | Utility-first, no CSS files needed |
| Editor | Tiptap v3 | Best Medium-style WYSIWYG for React |
| State | useReducer + Context | Scalable without Redux overhead |
| Persistence | localStorage | No API required per assignment spec |

---

## Features

- **Tree Navigator** — Unlimited depth hierarchy of container and leaf nodes. Add, remove, rename nodes with hover controls.
- **WYSIWYG Editor** — Medium-style editor powered by Tiptap with floating toolbar (bold, italic, headings, lists, blockquote, links).
- **Rich Content** — Insert images and videos via URL. Click to select and remove inserted media.
- **Comments** — Highlight any text, add a comment. Hover the highlighted text to see comment tooltip with timestamp and delete option.
- **Breadcrumb Navigation** — Editor header shows the full ancestor path. Click any ancestor to navigate directly.
- **localStorage Persistence** — Full tree structure and all node content survives page refresh.
- **Hamburger Drawer** — Module switcher slides in from the left.
- **Tree / Graph toggle** — Switch between tree view and graph view tab.
- **Invite Collaborators** — Invite team members by email (stored in localStorage).
- **User Menu** — Profile, theme toggle, settings and logout dropdown.

---

## Project Structure

src/
├── components/
│   ├── TreePanel/        # Left panel — tree navigation
│   │   ├── TreePanel.tsx
│   │   ├── TreeNode.tsx  # Recursive component
│   │   └── HamburgerDrawer.tsx
│   ├── Editor/           # Right panel — content editing
│   │   ├── Editor.tsx
│   │   ├── Toolbar.tsx
│   │   ├── WidgetInserter.tsx
│   │   └── CommentTooltip.tsx
│   └── TopBar/           # App header
│       └── TopBar.tsx
├── context/
│   └── TreeContext.tsx   # Global state — useReducer + Context
├── hooks/
│   └── useLocalStorage.ts
├── utils/
│   └── treeHelpers.ts    # Pure functions — add, remove, ancestors
└── types/
└── index.ts          # All TypeScript interfaces