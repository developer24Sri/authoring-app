import type { Config } from "tailwindcss";

/**
 * tailwind.config.ts
 *
 * Font families are registered here so you can use them as Tailwind classes.
 *
 * Current fonts:
 *   font-sans            → Inter Regular (400) — default body font, applied globally via global.css
 *   font-inter-medium    → Inter Medium (500)
 *   font-inter-semibold  → Inter SemiBold (600)
 *   font-inter-bold      → Inter Bold (700)
 *
 * Usage:
 *   <p className="font-sans">Regular text</p>
 *   <p className="font-inter-medium">Medium text</p>
 *   <p className="font-inter-semibold">SemiBold text</p>
 *   <p className="font-inter-bold">Bold text</p>
 *
 * To add a new font:
 *   1. Add @font-face in src/styles/fonts.css
 *   2. Add an entry below under fontFamily
 *   3. Update src/assets/fonts/README.md
 */

const config: Config = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        // Default body font — no class needed, body inherits this via global.css
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],

        // Explicit weight variants — use these when you need a specific weight
        "inter-medium":   ["Inter-Medium", "ui-sans-serif", "system-ui", "sans-serif"],
        "inter-semibold": ["Inter-SemiBold", "ui-sans-serif", "system-ui", "sans-serif"],
        "inter-bold":     ["Inter-Bold", "ui-sans-serif", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;