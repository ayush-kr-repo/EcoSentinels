---
name: Biodiversity Drift
colors:
  surface: '#051424'
  surface-dim: '#051424'
  surface-bright: '#2c3a4c'
  surface-container-lowest: '#010f1f'
  surface-container-low: '#0d1c2d'
  surface-container: '#122131'
  surface-container-high: '#1c2b3c'
  surface-container-highest: '#273647'
  on-surface: '#d4e4fa'
  on-surface-variant: '#b9cacb'
  inverse-surface: '#d4e4fa'
  inverse-on-surface: '#233143'
  outline: '#849495'
  outline-variant: '#3b494b'
  surface-tint: '#00dbe9'
  primary: '#dbfcff'
  on-primary: '#00363a'
  primary-container: '#00f0ff'
  on-primary-container: '#006970'
  inverse-primary: '#006970'
  secondary: '#4ae176'
  on-secondary: '#003915'
  secondary-container: '#00b954'
  on-secondary-container: '#004119'
  tertiary: '#fff4df'
  on-tertiary: '#3c2f00'
  tertiary-container: '#ffd546'
  on-tertiary-container: '#735c00'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#7df4ff'
  primary-fixed-dim: '#00dbe9'
  on-primary-fixed: '#002022'
  on-primary-fixed-variant: '#004f54'
  secondary-fixed: '#6bff8f'
  secondary-fixed-dim: '#4ae176'
  on-secondary-fixed: '#002109'
  on-secondary-fixed-variant: '#005321'
  tertiary-fixed: '#ffe083'
  tertiary-fixed-dim: '#eec200'
  on-tertiary-fixed: '#231b00'
  on-tertiary-fixed-variant: '#574500'
  background: '#051424'
  on-background: '#d4e4fa'
  surface-variant: '#273647'
typography:
  display-hero:
    fontFamily: Space Grotesk
    fontSize: 72px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.04em
  headline-lg:
    fontFamily: Space Grotesk
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Space Grotesk
    fontSize: 24px
    fontWeight: '500'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  label-caps:
    fontFamily: Space Grotesk
    fontSize: 12px
    fontWeight: '700'
    lineHeight: '1'
    letterSpacing: 0.1em
  data-mono:
    fontFamily: Space Grotesk
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1'
    letterSpacing: 0.05em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 4px
  gutter: 24px
  margin-edge: 48px
  container-max: 1440px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
---

## Brand & Style

This design system establishes a high-fidelity, cinematic interface for ecological intelligence. The brand personality is authoritative yet organic, merging the cold precision of space exploration with the vibrant, urgent vitality of planetary life. It evokes a sense of "cosmic stewardship"—the feeling of monitoring a living planet from an orbital station.

The visual style is a hybrid of **Glassmorphism** and **High-Contrast / Bold** data visualization. It utilizes deep layering, background blurs, and luminous accents to create a sense of infinite depth. The interface remains largely invisible and "space-dark" until data is surfaced, at which point it blooms into organic, biodiversity-inspired color states. Environmental particles and subtle "pulsing" animations should be used to make the UI feel like a living, breathing organism rather than a static tool.

## Colors

The palette is rooted in a "Deep Space" foundation, transitioning into biological signal colors based on environmental data.

*   **Atmospheric Foundation:** The base is a deep navy-to-black gradient (`#020617`). Atmospheric glows use the primary Cyan (`#00F0FF`) at 5-10% opacity to simulate orbital light.
*   **Biodiversity Drift States:**
    *   **Optimal (Health):** A lush, vibrant green (`#22C55E`) used for stable ecosystems.
    *   **Vulnerable (Warning):** A warm, high-visibility yellow-orange (`#FACC15`) for emerging ecological threats.
    *   **Critical (Danger):** A deep, cinematic red (`#EF4444`) with high saturation for immediate environmental collapse.
*   **Accents:** Neutral grays and muted blues are used for secondary UI chrome, ensuring the biological colors remain the primary focus.

## Typography

This design system uses a dual-font approach to balance futuristic technicality with high-performance readability. 

**Space Grotesk** is used for all headlines, labels, and data points. Its geometric nature supports the "high-tech" intelligence aesthetic. Display headers should use tight letter spacing and heavy weights to appear cinematic.

**Inter** is utilized for body copy and descriptions. Its neutral, utilitarian structure provides a necessary counter-balance to the expressive display type, ensuring complex ecological reports remain legible. 

Data-heavy labels should always be rendered in **Space Grotesk** with increased letter spacing and uppercase styling to mimic telemetry readouts.

## Layout & Spacing

The layout philosophy follows a **Fluid Grid** model with generous margins to create an "observatory" feel. The interface should never feel cramped; white space (or "black space") is treated as a premium element that allows the biological data to breathe.

A 12-column grid is used for dashboard views, while singular narrative content centers within a max-width container. Spacing follows a 4px rhythmic scale. Components should use wide internal padding (24px+) to support the glassmorphic aesthetic, ensuring the background blurs have enough surface area to be visible.

## Elevation & Depth

Depth is achieved through **Glassmorphism** and light-based layering rather than traditional shadows.

1.  **Base Layer:** The star-field background and cosmic gradients.
2.  **Mid-Layer (Surfaces):** Semi-transparent cards with a `backdrop-filter: blur(20px)`. These surfaces use a subtle white or cyan border (0.5px) at 10-15% opacity to define their edges.
3.  **Top-Layer (Interaction):** Active elements emit a "glow" (outer shadow with high blur, 0% spread) using the current state color (Green, Yellow, or Red). 

When an element is hovered, its border opacity increases, and an "inner glow" should be applied to simulate light refracting through the glass edge.

## Shapes

The shape language is primarily **Soft** and precision-engineered. Sharp corners are avoided to maintain an organic feel, but the roundedness is kept subtle (0.25rem - 0.75rem) to ensure the system feels like professional aerospace equipment.

Large glass containers should use `rounded-xl` for a more immersive, "lens-like" appearance, while buttons and input fields utilize the standard `rounded-sm`. Circular shapes are reserved exclusively for status indicators, data points on maps, and biological pulse animations.

## Components

**Buttons & Controls**
Buttons should be ghost-styled by default with a thin border. On hover, they fill with a semi-transparent version of the primary color and trigger a subtle pulse animation. Use uppercase labels for primary actions.

**Glassmorphic Cards**
The core container of the design system. Every card must have a `backdrop-filter` and a "light-leak" gradient—a subtle diagonal shine that moves slightly with the user's cursor to emphasize the glass texture.

**Biodiversity Chips**
Used for tagging ecological zones. These change color dynamically:
- *Stable:* Emerald glow border.
- *At Risk:* Amber pulse.
- *Extinction Level:* Crimson flicker.

**Data Visualization**
Charts should use thin, luminous lines (1px) with gradient fills that fade into the background. Grid lines in charts should be kept at 5% opacity.

**Environmental Particles**
A background component consisting of floating, out-of-focus bokeh particles that respond to scroll speed, simulating the movement of spores or cosmic dust.