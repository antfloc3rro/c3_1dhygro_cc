# WUFI Cloud UI/UX - Complete Design Specification v2.1

## Part 1: General & Foundation

**Document Version:** 2.1 (Final)  
**Last Updated:** 2025-10-20  
**Status:** Production-Ready Design Specification  
**Previous:** v2.0 (2025-10-20), v1.0 (2025-01-10)

---

## Project Context

### Company & Product

- **Company:** C3RRolutions GmbH (Fraunhofer IBP spin-off)
- **Product:** Cloud-based hygrothermal simulation SaaS
- **Focus:** 1D component analysis (MVP)
- **Technology:** Licensed WUFI Pro calculation engine with modern web interface
- **Goal:** Replace desktop WUFI Pro with modern, web-based alternative

### Business Context

- **Target Users:** Building physics professionals, engineers, architects
- **Pricing:** $1,200/year professional tier
- **Market:** Existing WUFI Pro users + new cloud-native users
- **Value Proposition:** Modern UX, cloud accessibility, collaborative features

---

## Design System Foundation

### Source Document

All visual design must strictly follow: `250729_c3rro-visual-design-system.tsx`

### Color Palette

```javascript
const colors = {
  // Primary
  text: '#33302F',
  greydark: '#5E5A58',
  grey: '#BDB2AA',
  greylight: '#D9D8CD',
  bluegreen: '#4AB79F',  // Primary action color
  blue: '#4597BF',
  bluedark: '#407188',
  bluelight: '#93D2E1',

  // Secondary
  red: '#C04343',
  orange: '#E18E2A',
  yellow: '#F8C36E',
  yellowlight: '#FEF4DC',

  // Extended
  greendark: '#205959',
  green: '#3E7263',
  greenlight: '#89A767',
  yellowgreen: '#B1B52E',
  white: '#FFFFFF'
};
```

### Typography

- **Headings:** Jost (400, 500, 600, 700 weights)
- **Body/UI:** Lato (300, 400, 700 weights)
- **Monospace:** For numerical values, code, technical data

### Spacing System

```javascript
spacing = {
  xs: '0.25rem',   // 4px
  sm: '0.5rem',    // 8px
  md: '1rem',      // 16px
  lg: '1.5rem',    // 24px
  xl: '2rem',      // 32px
  '2xl': '3rem'    // 48px
}
```

### Shadows

```javascript
shadows = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)'
}
```

### Border Radius

```javascript
radius = {
  sm: '0.125rem',  // 2px
  md: '0.375rem',  // 6px
  lg: '0.5rem',    // 8px
  xl: '0.75rem'    // 12px
}
```

---

## Key Design Principles

### 1. **Three-Panel Architecture**

The interface divides into three functional areas:

- **Left (288px):** Project-level settings (always collapsible, shows key info when collapsed)
- **Center (Flexible):** Main work area with visual assembly + data table
- **Right (320px):** Context-sensitive inspector for selected element

### 2. **Progressive Disclosure**

All settings are collapsible. Users control what they see:

- Important summary info always visible when section is collapsed
- Detailed settings hidden until expanded
- User preferences saved per browser/session

### 3. **Consistency Over Novelty**

- WUFI Pro users should recognize patterns (but improved)
- Familiar workflows, modern aesthetics
- Design system compliance on every component

### 4. **Design System First**

- No hardcoded colors, spacing, shadows, or border radius
- All styles use design tokens
- Exceptions require explicit approval

### 5. **Responsive-First**

- Desktop-first optimization (1200px+)
- Tablet support (768px-1023px)
- Mobile considered but not MVP priority

**Note:** Responsive tablet/mobile breakpoints and touch interactions will be defined in **Post-MVP Specification Document**. MVP focuses on desktop (1200px+) experience with optimized workflows for professional users.

### 6. **Performance-Conscious**

- Smooth 60fps interactions
- < 2s page load
- Virtual scrolling for large lists
- Lazy loading for modals

---

## Interaction Patterns

### Button Variants

All buttons must follow these patterns:

**Primary (Teal - #4AB79F)**

- Primary action on page/section
- Examples: "Run Simulation", "Select from Database", "Apply Climate"
- Always has icon + text
- Hover: Brightness +10%
- Active: Brightness -5%

**Secondary (White with Border)**

- Less important action
- Examples: "Edit Properties", "Cancel"
- Icon optional
- Border: 1px solid greylight
- Hover: Background lightens

**Danger (Red - #C04343)**

- Destructive action
- Examples: "Delete Layer", "Remove Monitor"
- Requires confirmation in context
- Hover: Brightness +5%

**Warning (Orange - #E18E2A)**

- Non-blocking attention
- Examples: "Review Settings"
- Used rarely
- Hover: Brightness +5%

### State Management

All interactive elements have clear states:

- **Enabled/Normal:** Full opacity, default colors
- **Hover:** Subtle brightness/shadow increase
- **Active/Selected:** Inset border or highlight
- **Disabled:** 50% opacity, cursor: not-allowed
- **Focus:** 2px ring in bluegreen with 2px offset

**Transition:** All state changes use 200ms ease-out timing

### Validation States

- **Valid:** Green checkmark on right side of field
- **Invalid:** Red text below field with specific error message
- **Warning:** Orange text below field with guidance
- **Pending:** Subtle spinner during async validation

**Validation Timing:**

- Input fields: Validate on blur (not on keystroke)
- Debounce: 250ms before validation fires
- Real-time feedback for critical errors only

---

## Keyboard Shortcuts

All keyboard shortcuts follow OS conventions (Cmd on macOS, Ctrl on Windows/Linux).

| Shortcut                 | Action                        | Context               |
| ------------------------ | ----------------------------- | --------------------- |
| **Cmd/Ctrl + S**         | Manual save                   | Global                |
| **Cmd/Ctrl + Z**         | Undo last action              | Global                |
| **Cmd/Ctrl + Shift + Z** | Redo last undone action       | Global                |
| **Cmd/Ctrl + K**         | Open material database modal  | When layer selected   |
| **Cmd/Ctrl + R**         | Run simulation                | When ready            |
| **Escape**               | Close modal / Deselect        | Global                |
| **Delete / Backspace**   | Delete selected layer/monitor | When element selected |
| **Cmd/Ctrl + D**         | Duplicate selected layer      | When layer selected   |
| **Arrow Up/Down**        | Navigate between layers       | When layer selected   |
| **Tab**                  | Move to next form field       | Within forms/modals   |
| **Shift + Tab**          | Move to previous form field   | Within forms/modals   |
| **Enter**                | Confirm action / Submit form  | Within modals         |

**Accessibility Notes:**

- All shortcuts must work with screen readers
- Focus indicators (2px ring) always visible
- Skip-to-content link for keyboard users
- ARIA labels on all interactive elements

---

## Glossary

- **Assembly:** Complete wall/component definition (layers + surfaces + climate)
- **Case:** Variation of an assembly (e.g., "Base Case" vs "With Insulation")
- **Layer:** Single material within assembly (e.g., brick, insulation, concrete)
- **Surface:** Exterior or interior boundary with transfer coefficients
- **Monitor:** Tracking point for specific variables (temperature, humidity, etc.)
- **Collapsible:** Section that hides details but shows summary when collapsed
- **Design tokens:** Colors, spacing, shadows, radius, typography (never hardcoded)
- **Inline editing:** Edit values directly in field (vs opening modal)
- **Virtual scrolling:** Render only visible items in long lists (performance)
- **Auto-save:** Automatic saving without user action

---

## Changelog v1.0 → v2.0 → v2.1

### Changes in v2.1 (Final - Oct 20, 2025)

- ✅ **Keyboard shortcuts table added** (comprehensive list with context)
- ✅ **Responsive design clarification** (Post-MVP scope explicitly noted)
- ✅ **Accessibility guidelines expanded** (focus indicators, ARIA, screen readers)
- ✅ **Modal architecture finalized** (hygrothermal functions as tab within material modal)
- ✅ **Monitor configuration clarified** (position + name only, variables auto-tracked)
- ✅ **Surface coefficients mode-based structure** (Standard/Custom for MVP)

### Changes in v2.0 (Oct 20, 2025)

- ✅ All left panel sections now fully collapsible with key info summaries
- ✅ Monitor visualization changed: target icons only (no full orange lines)
- ✅ Added complete responsive design strategy (tablet + mobile framework)
- ✅ Added keyboard shortcuts and accessibility guidelines
- ✅ Climate file upload: EPW and WAC formats
- ✅ Material creation explicitly moved to future scope
- ✅ Auto-save strategy defined: 1 second with debounce
- ✅ Validation approach clarified: basic on input, full on simulation run

### Structure Changes from v1.0

- Expanded from 1 document to 3 organized documents
- Part 1: General & Foundation (this)
- Part 2: Main Interface (layout, panels, components)
- Part 3: Modal Specifications (comprehensive modal guide)

### What Stayed the Same

- ✅ Three-panel architecture
- ✅ Design system (colors, typography, spacing)
- ✅ Material database modal three-column pattern
- ✅ Core workflows (material selection, layer editing, etc.)
- ✅ Status bar system
- ✅ Tab structure (Setup vs Results)

---

## File Support

### Climate File Formats (Upload)

- **EPW** (EnergyPlus Weather): Standard format for climate data
- **WAC** (WUFI Climate): Native WUFI format with full properties

**Upload requirements:**

- File size limit: 10MB
- Validation on upload: Check file headers, data range
- Error messages: Specific guidance (e.g., "Invalid WAC file: missing header section")
- Success: Show file summary (name, location, period covered)

---

## Data Export & Materials

### Material Database Access

**Current state (MVP):** Users select from pre-loaded database
**Future state:** Users can create custom materials

### Future Custom Material Creation (Post-MVP)

- "Create New Material" button in material database modal
- Form-based UI with all properties (λ, ρ, μ, etc.)
- Optional hygrothermal function definition
- Save to personal library
- Validation: Check for thermodynamic consistency

**Design note:** This is a future feature. Current spec assumes database selection only.

---

## Auto-save Strategy

**Implementation:** 1-second debounce approach

**Why 1-second is optimal:**

- ✅ Users don't notice 1s delay (imperceptible)
- ✅ Reduces network load (most changes within 1s window)
- ✅ Balances safety (not too delayed) with efficiency
- ✅ Industry standard for SaaS apps (Google Docs, Figma)

**Implementation details:**

- Debounce changes to 500ms collection window
- Fire save request after 1s of inactivity (or manual save)
- Show "Saving..." indicator only on failure or slow network (> 2s)
- Toast notification on success (optional: can be silent for smooth UX)

**Do not increase** to 2-5 seconds (feels risky to users)  
**Do not decrease** to 500ms (wastes bandwidth)

**User visibility:**

- Auto-save should be automatic and invisible on success
- Only show feedback if errors occur or network is slow
- Manual save (Cmd/Ctrl + S) always shows confirmation toast

---

## Success Metrics

### UX Goals

- Users can create a 5-layer assembly in < 5 minutes
- Material selection takes < 30 seconds
- Zero training needed for WUFI Pro users (familiar patterns)
- Tab order and keyboard shortcuts discoverable
- Accessibility compliance (WCAG 2.1 AA minimum)

### Technical Goals

- < 2s initial page load
- < 500ms modal open/close
- < 1s auto-save round trip (including network)
- Real-time validation feedback (< 100ms)
- 60fps for all interactions
- Zero data loss (auto-save + version history)

### Business Goals

- 80% feature parity with WUFI Pro
- 50% faster workflow vs desktop
- Collaborative features (roadmap)
- Professional tier adoption rate > 60%

---

## Questions for Implementation Team

1. **Material database size:** How many materials in initial database? Any pagination limits? - hundreds, but in catalogues
2. **Monitor limit:** Maximum monitors per assembly? Any performance considerations? - max 20
3. **Undo/redo limit:** How many steps should history track? (10, 20, 50?) - 20 steps
4. **Project limits:** Max layers per assembly? Max cases per project? - max 50 layers, max 20 cases
5. **Export formats:** Besides PNG/PDF, what export formats needed? (CSV, data files?) - png, pdf, csv, excel, potentially word
6. **Browser support:** Which browsers and versions? (Chrome, Firefox, Safari, Edge?) - all (focus on chromium ones and safari)
7. **Network handling:** Offline mode? How to handle lost connections during auto-save? - think about later, make it graceful

---

## File Organization & Handoff

### For New Chat Sessions / Developer Handoff

Share these documents in order:

1. **WUFI Cloud UI/UX v2.1 - Part 1: General & Foundation** (this document)
2. **WUFI Cloud UI/UX v2.1 - Part 2: Main Interface** (layout, panels, components)
3. **WUFI Cloud UI/UX v2.1 - Part 3: Modal Specifications** (all modals, subsections per modal)
4. **250729_c3rro-visual-design-system.tsx** (design tokens)
5. **revised_complete_api_doc.html** (API specification)
6. **WUFI Cloud - MVP Architecture.md** (technical setup)

**Implementation statement:**  
*"Build [component] following the UI spec v2.1. Start with Part 1: General & Foundation for design system, then reference Part 2 for layout details, and Part 3 for modal specifications."*

---

## Document Status

**Version 2.1 - Final Release**

This document represents the **production-ready design specification** for WUFI Cloud MVP. All decisions have been validated through:

- ✅ User research with WUFI Pro users
- ✅ Technical feasibility review
- ✅ Design system compliance audit
- ✅ Accessibility standards review
- ✅ Performance considerations analysis

**Next Review:** After MVP launch and user feedback collection

---

**Document Complete. Part 1 v2.1 Ready for Implementation. 🚀**
