# Meridius — Theme & Color System

This document outlines the complete color system, theme variables, hex codes, and styling specifications used across the Meridius website and native macOS application.

---

## 1. Core Brand Colors

The Meridius brand is defined by a warm, technical duo replacing stark blacks and whites:

* **Cream (`#f5f5ee`)**: Warm off-white signature base color (Light mode background, Dark mode primary text, light logo mark dots).
* **Charcoal (`#2b2b2a`)**: Deep warm graphite (Light mode primary text, Dark mode card surfaces, primary button fill, dark logo mark dots).
* **Void (`#0e0e0e`)**: Deep near-black background for Dark mode, representing the background virtual display.

---

## 2. Color Tokens Palette (Tailwind & CSS)

### Cream Scale
| Token | Hex Value | RGBA Equivalent | Usage |
| :--- | :--- | :--- | :--- |
| `cream.DEFAULT` | `#f5f5ee` | `rgba(245, 245, 238, 1)` | Light page background, dark text, bright logo dots |
| `cream.subtle` | `#eaeae2` | `rgba(234, 234, 226, 1)` | Subtle highlights & borders |
| `cream.card` | `#f0f0e8` | `rgba(240, 240, 232, 1)` | Cream container surfaces |
| `cream.dark` | `#d8d8ce` | `rgba(216, 216, 206, 1)` | Mid-tone cream borders |
| `cream.muted` | `#c4c4bb` | `rgba(196, 196, 187, 1)` | Secondary text in dark mode |
| `cream.dim` | `#8a8a82` | `rgba(138, 138, 130, 1)` | Tertiary technical labels, mono metadata |

### Charcoal Scale
| Token | Hex Value | RGBA Equivalent | Usage |
| :--- | :--- | :--- | :--- |
| `charcoal.DEFAULT` | `#2b2b2a` | `rgba(43, 43, 42, 1)` | Light mode headings, body text, primary button fill |
| `charcoal.dark` | `#1a1a19` | `rgba(26, 26, 25, 1)` | Deep charcoal surfaces |
| `charcoal.light` | `#3a3a39` | `rgba(58, 58, 57, 1)` | Elevated card surfaces |
| `charcoal.muted` | `#5e5e57` | `rgba(94, 94, 87, 1)` | Secondary text in light mode |
| `charcoal.dim` | `#8a8a82` | `rgba(138, 138, 130, 1)` | Step numbers, stats, timestamps |
| `charcoal.border` | `—` | `rgba(43, 43, 42, 0.10)` | Light mode structural borders |

### Surface Scale (Elevation & Containers)
| Token | Hex Value | Usage |
| :--- | :--- | :--- |
| `surface.DEFAULT` | `#ffffff` | Pure white panel base (Light mode) |
| `surface.subtle` | `#f8f8f4` | Subtle container background (Light mode) |
| `surface.card` | `#f0f0e8` | Elevated card surface (Light mode) |
| `surface.dark` | `#181817` | Base panel / card surface (Dark mode) |
| `surface.dark-subtle` | `#222220` | Subtle container fill (Dark mode) |
| `surface.dark-elevated`| `#2b2b2a` | Elevated card fill (Dark mode) |

---

## 3. Light Mode vs. Dark Mode Variables

### Light Mode (`:root`)
* `--bg-page`: `#f5f5ee`
* `--text-primary`: `#2b2b2a`
* `--text-muted`: `#5e5e57`
* `--text-dim`: `#8a8a82`
* `--border-subtle`: `rgba(43, 43, 42, 0.08)`
* `--border-medium`: `rgba(43, 43, 42, 0.16)`
* `--border-hover`: `rgba(43, 43, 42, 0.28)`
* `--btn-primary-bg`: `#2b2b2a`
* `--btn-primary-text`: `#f5f5ee`
* `--btn-secondary-border`: `rgba(43, 43, 42, 0.14)`
* `--btn-secondary-hover`: `rgba(43, 43, 42, 0.04)`
* `--dot-color`: `rgba(43, 43, 42, 0.06)`

### Dark Mode (`.dark`)
* `--bg-page`: `#0e0e0e`
* `--text-primary`: `#f5f5ee`
* `--text-muted`: `#c4c4bb`
* `--text-dim`: `#8a8a82`
* `--border-subtle`: `rgba(245, 245, 238, 0.08)`
* `--border-medium`: `rgba(245, 245, 238, 0.16)`
* `--border-hover`: `rgba(245, 245, 238, 0.28)`
* `--btn-primary-bg`: `#f5f5ee`
* `--btn-primary-text`: `#121212`
* `--btn-secondary-border`: `rgba(245, 245, 238, 0.14)`
* `--btn-secondary-hover`: `rgba(245, 245, 238, 0.04)`
* `--dot-color`: `rgba(245, 245, 238, 0.04)`

---

## 4. Frosted Glass UI (Glassmorphism)

### Light Mode (`.frosted-glass`)
* **Background**: `rgba(255, 255, 255, 0.55)` (hover: `rgba(255, 255, 255, 0.70)`)
* **Backdrop Blur**: `16px`
* **Border**: `1px solid rgba(43, 43, 42, 0.08)` (hover: `rgba(43, 43, 42, 0.14)`)
* **Inset Highlight**: `inset 0 1px 0 0 rgba(255, 255, 255, 0.70)`
* **Shadow**: `0 4px 20px -2px rgba(43, 43, 42, 0.03)`

### Dark Mode (`.dark .frosted-glass`)
* **Background**: `rgba(24, 24, 23, 0.60)` (hover: `rgba(30, 30, 29, 0.75)`)
* **Backdrop Blur**: `16px`
* **Border**: `1px solid rgba(245, 245, 238, 0.08)` (hover: `rgba(245, 245, 238, 0.16)`)
* **Inset Highlight**: `inset 0 1px 0 0 rgba(255, 255, 255, 0.06)`
* **Shadow**: `0 4px 24px -2px rgba(0, 0, 0, 0.50)`

### Frosted Glass Pill / Inputs (`.frosted-glass-pill`)
* **Light**: `rgba(255, 255, 255, 0.60)`, blur `12px`, border `rgba(43, 43, 42, 0.08)`, inset `rgba(255, 255, 255, 0.80)`
* **Dark**: `rgba(24, 24, 23, 0.65)`, blur `12px`, border `rgba(245, 245, 238, 0.08)`, inset `rgba(255, 255, 255, 0.06)`

---

## 5. Functional & Status Accents

* **Active / Success / Emerald**:
  * Light Mode: `#059669` / `#10b981` (`emerald-600` / `emerald-500`)
  * Dark Mode: `#34d399` (`emerald-400`)
* **macOS Window Controls**:
  * Close: `#FF5F56`
  * Minimize: `#FFBD2E`
  * Zoom: `#27C93F`
* **Warning / Partial**: `#f59e0b` / `#fbbf24` (`amber-500` / `amber-400`)
* **Error / Validation**: `#f43f5e` (`rose-500`)
* **Ghost Display Signal (Virtual Display Accent)**:
  * Signal Blue: `#5B8CFF`
  * Signal Dim Glow: `rgba(91, 140, 255, 0.15)`
  * Ghost Plane: `#3A4048`

---

## 6. Logo & Asset Standards

* **`meridius-mark-white.svg`**: Transparent background, `#f5f5ee` dots (for dark surfaces).
* **`meridius-mark-black.svg`**: Transparent background, `#2b2b2a` dots (for light surfaces).
* **`meridius-logo-dark.svg`**: Solid `#2b2b2a` background, `#f5f5ee` dots.
* **`meridius-logo-light.svg`**: Solid `#f5f5ee` background, `#2b2b2a` dots.
