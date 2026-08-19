---
name: Verdant Horizon
colors:
  surface: '#f8f9fb'
  surface-dim: '#d8dadc'
  surface-bright: '#f8f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f6'
  surface-container: '#eceef0'
  surface-container-high: '#e6e8ea'
  surface-container-highest: '#e0e3e5'
  on-surface: '#191c1e'
  on-surface-variant: '#3f4a3c'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eff1f3'
  outline: '#6f7a6b'
  outline-variant: '#becab9'
  surface-tint: '#006e1c'
  primary: '#006e1c'
  on-primary: '#ffffff'
  primary-container: '#4caf50'
  on-primary-container: '#003c0b'
  inverse-primary: '#78dc77'
  secondary: '#0061a4'
  on-secondary: '#ffffff'
  secondary-container: '#33a0fd'
  on-secondary-container: '#00355c'
  tertiary: '#8b5000'
  on-tertiary: '#ffffff'
  tertiary-container: '#e18500'
  on-tertiary-container: '#4d2b00'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#94f990'
  primary-fixed-dim: '#78dc77'
  on-primary-fixed: '#002204'
  on-primary-fixed-variant: '#005313'
  secondary-fixed: '#d1e4ff'
  secondary-fixed-dim: '#9ecaff'
  on-secondary-fixed: '#001d36'
  on-secondary-fixed-variant: '#00497d'
  tertiary-fixed: '#ffdcbe'
  tertiary-fixed-dim: '#ffb870'
  on-tertiary-fixed: '#2c1600'
  on-tertiary-fixed-variant: '#693c00'
  background: '#f8f9fb'
  on-background: '#191c1e'
  surface-variant: '#e0e3e5'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 48px
  xxl: 64px
  container-max: 1200px
  auth-card-width: 440px
---

## Brand & Style

The design system is built upon a **Corporate / Modern** foundation with a vibrant, tropical infusion. It aims to evoke feelings of growth, clarity, and escape. The personality is professional yet energetic, bridging the gap between a high-utility productivity tool and a leisurely travel experience.

Visuals are characterized by generous whitespace, soft-shadowed surfaces, and a sophisticated use of the brand’s signature gradient-inspired palette. The interface remains "clean" by using color strategically as a functional signifier rather than a decorative element, ensuring the authentication flow feels secure and effortless.

## Colors

The palette is derived directly from the lush, sun-drenched tones of the palm motif.

- **Primary Green (#4CAF50):** Used for main actions and success states. In dark mode, this transitions to a slightly more luminous "neon" variant for legibility.
- **Secondary Blue (#2196F3):** Utilized for secondary interactions, links, and informative callouts.
- **Tertiary Orange (#FF9800):** Reserved for warnings or high-impact accents to mimic the "golden hour" light in the logo.
- **Neutrals:** Light mode relies on pure white surfaces with soft grey (#E0E4E8) borders. Dark mode utilizes a deep charcoal base with elevations defined by slightly lighter charcoal surfaces.

## Typography

This design system employs **Plus Jakarta Sans** for its modern, friendly, and slightly geometric character which complements the organic shapes in the logo.

- **Headlines:** Use Bold (700) or SemiBold (600) weights with tighter letter spacing to create a strong visual anchor.
- **Body:** Regular (400) weight ensures high readability during longer interactions.
- **Labels:** Use SemiBold (600) for form labels and button text to provide a clear interactive hierarchy.
- **Hierarchy:** Ensure the authentication title uses `headline-lg` to greet the user, while helper text uses `body-md` in a muted neutral tone.

## Layout & Spacing

The layout follows a **Fluid Grid** model with a standard 8px baseline. For the authentication experience, content is centered within a fixed-width container (440px) on desktop to maintain focus.

- **Breakpoints:** Mobile (<600px), Tablet (600px-1024px), Desktop (>1024px).
- **Margins:** 24px horizontal margins on mobile; 64px+ on desktop.
- **Rhythm:** Vertical spacing between form elements should be 24px (`lg`), while the space between a label and its input is 8px (`sm`).
- **Safety:** Use 48px (`xl`) padding within cards to create a premium, uncrowded feel.

## Elevation & Depth

Visual hierarchy is established through **Tonal Layers** and **Ambient Shadows**.

- **Light Mode:** Uses a "Soft Lift" approach. Background is #F5F7F9. The primary auth card is #FFFFFF with a very subtle, diffused shadow: `0 4px 20px rgba(0, 0, 0, 0.05)`. Borders are thin (1px) and soft grey.
- **Dark Mode:** Surfaces are stacked using color brightness. The base is #121212, and cards "rise" to #1E1E1E. No shadows are required in dark mode; instead, a 1px border of #2C2C2C defines the edges.
- **Focus States:** When a user interacts with a field, a 2px outer glow in the Primary Green (at 20% opacity) should be applied to create a "bloom" effect.

## Shapes

The shape language is consistently **Rounded**, mirroring the friendly curves of the logo's quadrants and the main container.

- **Standard Elements:** Buttons, Input Fields, and Cards use a 12px (`rounded-lg`) corner radius.
- **Small Elements:** Tooltips and Checkboxes use a 4px (`rounded-sm`) radius.
- **Interactive Feedback:** Hover states should not change the shape, but can slightly deepen the shadow or brighten the border color.

## Components

### Buttons
- **Primary:** Solid Primary Green (#4CAF50) with white text. 12px rounded corners.
- **Secondary:** Outlined Blue (#2196F3) with 1px stroke.
- **States:** Hover should involve a 10% brightness increase. Active/Press should involve a 5% scale-down.

### Input Fields
- **Default:** White background (light) or #252525 (dark). 1px grey border.
- **Focus:** Border transitions to Primary Green with a soft outer glow.
- **Error:** Border transitions to a soft red, with helper text appearing below in the same color.

### Cards
- The main authentication card should be centered, utilizing the 12px corner radius and "Soft Lift" shadow.

### Social Auth
- Buttons for Google/Apple should use a neutral background with the respective brand icon, maintaining the 12px roundedness to match the system.

### Progress Indicators
- For multi-step signups, use a thin horizontal bar at the top of the card in Primary Green.
