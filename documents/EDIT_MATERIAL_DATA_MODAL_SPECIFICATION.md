# Edit Material Data Modal Specification

**Document Version:** 1.0  
**Status:** Production-Ready Design Specification  
**Date:** 2025-11-07  
**Reference:** WUFI Cloud UI/UX Complete Design System v2.1 + C3RRO Visual Design System

---

## Executive Summary

The **Edit Material Data Modal** enables users to view and edit comprehensive material properties for a layer in an assembly. Unlike the Material Database Modal (which is for *selection*), this modal is for *detailed editing* of material properties that may come from the database or user-defined sources.

The modal accommodates three categories of information:

1. **Basic Properties** - Scalar values (density, porosity, heat capacity, thermal conductivity, μ-value)
2. **Functional Relationships** - Properties that depend on moisture content (moisture storage, liquid transport, vapor diffusion, thermal conductivity)
3. **Tabular Data** - Discrete tables defining functions (e.g., water content vs. relative humidity)

---

## Modal Strategy & Purpose

### When to Use This Modal

**Use the Edit Material Data Modal for:**
- Detailed editing of material properties after database selection
- Customization of properties by power users
- Addition/modification of hygrothermal functions
- Viewing and editing tabular function data
- Exporting material data for documentation or sharing

**Don't use this modal for:**
- Simple material selection (use Material Database Modal instead)
- Quick layer edits (use right panel inspector for layer name/thickness)
- Surface coefficient editing (use dedicated Surface Coefficients Modal)

### Design Decision: Edit vs. Display

The modal supports **both display and editing** of material properties:
- **Display mode:** When viewing properties from database materials (read-only or limited edit)
- **Edit mode:** When creating/customizing materials (full edit capability)

This dual-mode approach supports both beginner users (database selection) and power users (custom materials).

---

## Modal Specifications

### Size & Positioning

| Property | Value |
|----------|-------|
| **Width** | 1000px |
| **Height** | 85vh (auto-height, capped at viewport) |
| **Position** | Centered on screen |
| **Background overlay** | Black at 40% opacity |
| **Animation** | Fade-in 300ms (ease-out), scale 0.95→1.0 |

### Layout Architecture

```
┌─────────────────────────────────────────────────────┐
│ Header (Sticky, h=60px)                             │
│ [Material Name] [Manufacturer Logo]     [Close X]   │
├─────────────────────────────────────────────────────┤
│ Tabs: [Material Data] [Information] [Hygrothermal Functions]    │
├─────────────────────────────────────────────────────┤
│                                                      │
│  Content Area (flex, overflow: auto)                │
│  ┌────────────────────────────────────────────────┐ │
│  │                                                 │ │
│  │  Two-Column Layout (540px | 440px)             │ │
│  │  ┌───────────────┐  ┌──────────────────────┐  │ │
│  │  │ Left Column   │  │ Right Column         │  │ │
│  │  │ Basic Props   │  │ Additional Props     │  │ │
│  │  │               │  │ Typical Built-in     │  │ │
│  │  │               │  │ Moisture             │  │ │
│  │  │               │  │ Design Values        │  │ │
│  │  └───────────────┘  └──────────────────────┘  │ │
│  └────────────────────────────────────────────────┘ │
│                                                      │
├─────────────────────────────────────────────────────┤
│ Footer (Sticky, h=56px)                             │
│ [Info Text]                      [Cancel] [Apply]   │
└─────────────────────────────────────────────────────┘
```

---

## Header Section (Sticky, h=60px)

### Layout
- **Container:** Full width, white background, 1px bottom border (greylight), shadow-sm
- **Padding:** 16px horizontal, 12px vertical
- **Display:** flex, justify-content: space-between, align-items: center

### Left Section - Title
- **Material Name:** Jost, 1.25rem (20px), 600 weight, text color (#33302F)
- **Layer/Case Name:** Lato, 0.875rem (14px), greydark color, shown below as secondary text
- **Format:** "Material Name — Layer Name (Case: #1)" or "Custom Brick"

### Center Section - Breadcrumb (Optional)
- **Path:** Greylight background, 0.75rem text, greydark color
- **Format:** "Fraunhofer-IBP › Masonry › Brick (old)" or "User-Defined"
- **Location:** Right-aligned, before close button

### Right Section - Close Button
- **Button:** X icon, 24px, greydark color, no background
- **Hover:** Slightly darker background (greylight at 20%)
- **Click:** Closes modal (checks for unsaved changes)
- **Keyboard:** ESC also closes

---

## Tab Navigation

### Tab Container
- **Position:** Sticky, below header, white background, 1px bottom border
- **Padding:** 0 16px (horizontal)
- **Height:** 48px
- **Display:** flex, gap: 32px

### Tab Styling

**Inactive Tab:**
- **Font:** Lato, 0.875rem, 500 weight
- **Color:** greydark (#5E5A58)
- **Padding:** 12px vertical, 0 horizontal
- **Border-bottom:** None
- **Cursor:** pointer
- **Hover:** Color becomes text (#33302F)

**Active Tab:**
- **Font:** Lato, 0.875rem, 600 weight
- **Color:** text (#33302F)
- **Padding:** 12px vertical, 0 horizontal
- **Border-bottom:** 3px solid bluegreen (#4AB79F)
- **Transition:** color 200ms, border-color 200ms

### Tab List

1. **Material Data** (Default active)
   - Purpose: Edit basic properties and functional relationships
   - Content: Two-column layout with all material properties

2. **Information** (Future)
   - Purpose: Material metadata, manufacturer details, notes
   - Content: Material description, source, quality indicators

3. **Hygrothermal Functions** (Visible when data available)
   - Purpose: View/edit detailed function curves and tables
   - Content: Interactive graphs with tabular data
   - Note: This can be accessed from Material Database preview tab as well

---

## Content Area: Material Data Tab (DEFAULT)

### Overall Layout

**Two-column layout:**
- **Left column (540px):** Basic properties (scalar inputs)
- **Right column (440px):** Additional properties (special values)
- **Gap:** 24px
- **Padding:** 24px
- **Container height:** flex, overflow-y: auto
- **Max content width:** Respects design system spacing

### Left Column: Basic Properties Section

**Section Title**
- **Font:** Jost, 0.875rem (14px), 600 weight, uppercase
- **Color:** greydark (#5E5A58)
- **Margin bottom:** 16px
- **Text:** "Basic Properties"

**Property Input Groups**

Each property follows this pattern:

```
[Label] [info icon - optional]
[Input Field or Display]
[Unit] [Validation message - if needed]
```

#### Property 1: Layer/Material Name
- **Label:** "Layer/Material Name"
- **Input type:** Text input (editable, required)
- **Width:** Full width of column
- **Placeholder:** "Enter material name"
- **Validation:** Min 1 char, max 100 chars
- **Font:** Lato, 0.875rem
- **Padding:** 8px 12px
- **Border:** 1px solid greylight
- **Border-radius:** 4px
- **Focus:** Border changes to bluegreen, subtle shadow
- **Value:** "Brick (old)" or current material name

#### Property 2: Bulk Density ρ
- **Label:** "Bulk Density [kg/m³]"
- **Input type:** Number input (editable, required)
- **Width:** Full width
- **Value format:** Monospace, right-aligned within field
- **Range validation:** > 0 and < 5000
- **Placeholder:** "1670"
- **Unit display:** Shown in label
- **Input styling:** Same as Property 1
- **Info icon:** On hover, shows "Mass per unit volume in dry state"

#### Property 3: Porosity
- **Label:** "Porosity ε [m³/m³]"
- **Input type:** Number input (editable, required)
- **Width:** Full width
- **Range validation:** ≥ 0 and ≤ 1
- **Placeholder:** "0.196"
- **Step:** 0.001
- **Decimal places:** 3
- **Info icon:** "Volume of pores relative to total volume"

#### Property 4: Specific Heat Capacity
- **Label:** "Specific Heat Capacity [J/(kg·K)]"
- **Input type:** Number input (editable, required)
- **Width:** Full width
- **Range validation:** > 0 and < 5000
- **Placeholder:** "840"
- **Info icon:** "Energy required to raise temperature of 1kg by 1K"

#### Property 5: Thermal Conductivity (dry)
- **Label:** "Thermal Conductivity λ (dry) [W/(m·K)]"
- **Input type:** Number input (editable, required)
- **Width:** Full width
- **Range validation:** > 0 and < 5
- **Placeholder:** "0.4"
- **Step:** 0.01
- **Decimal places:** 2
- **Info icon:** "Heat transfer rate in completely dry state"

#### Property 6: Water Vapor Diffusion Resistance Factor
- **Label:** "Water Vapor Diffusion Resistance μ [-]"
- **Input type:** Number input (editable, required)
- **Width:** Full width
- **Range validation:** > 0 and < 10000
- **Placeholder:** "16"
- **Decimal places:** 0
- **Info icon:** "Resistance to vapor diffusion (water vapor permeance ratio)"

**Spacing Between Properties**
- **Vertical gap:** 16px between each property group
- **Bottom margin of section:** 24px

### Right Column: Additional Properties Section

**Section Title**
- **Font:** Jost, 0.875rem, 600 weight, uppercase
- **Color:** greydark
- **Margin bottom:** 16px
- **Text:** "Additional Properties"

#### Subsection 1: Typical Built-In Moisture

**Title:** "Typical Built-In Moisture" (Lato, 0.875rem, 500 weight, greydark)

#### Property 1: Typical Built-In Moisture
- **Label:** "Typical Built-In Moisture [kg/m³]"
- **Input type:** Number input (editable)
- **Range validation:** ≥ 0 and < 200
- **Placeholder:** "3.34"
- **Step:** 0.01
- **Info icon:** "Initial moisture content at 50% RH"
- **Styling:** Same as left column inputs

#### Property 2: Layer Thickness
- **Label:** "Layer Thickness [m]"
- **Input type:** Number input (read-only or editable depending on context)
- **Range validation:** > 0.001 and < 10
- **Placeholder:** "0.104"
- **Step:** 0.001
- **Unit:** meters
- **Info icon:** "Physical thickness of this layer in assembly"
- **Note:** May be read-only if thickness is controlled from main assembly table

#### Subsection 2: Design Values

**Title:** "Design Values" (Lato, 0.875rem, 500 weight, greydark)

#### Property 1: Thermal Conductivity (Design Value)
- **Label:** "Thermal Conductivity, Design Value [W/(m·K)]"
- **Input type:** Number input (often read-only)
- **Value:** Calculated from basic properties or specified by standard
- **Placeholder:** Auto-calculated based on standard (EN ISO 6946, etc.)
- **Step:** 0.01
- **Info icon:** "Standardized thermal conductivity value for calculation (often 90% wet-cup)"
- **Read-only note:** "This value is typically set by building standards (EN ISO 10456, ISO 9346)"

#### Property 2: Visual Color
- **Label:** "Material Color" (with swatch)
- **Input type:** Color picker or swatch selector
- **Display:** 32px × 32px color swatch next to input
- **Click behavior:** Opens simple color picker (or uses browser native)
- **Current color:** Visual swatch showing current selection
- **Use case:** For visual assembly representation
- **Default:** Material color from database (if available)

**Spacing Between Subsections**
- **Gap:** 20px between subsections
- **Bottom margin:** 16px after last property

---

## Hygrothermal Functions Tab Content

When user clicks "Hygrothermal Functions" tab (or clicks the "Hygrothermal Functions" button in Material Database modal):

### Tab Structure Overview

**Sub-tabs (within this tab):**
- [Moisture Storage Function] (default)
- [Liquid Transport Coefficient]
- [Vapor Diffusion Resistance]
- [Thermal Conductivity (moisture-dependent)]

### Sub-Tab Styling

**Layout:** Same tab styling as main tabs, positioned below main tab navigation
- **Height:** 40px
- **Font:** Lato, 0.875rem, 500 weight
- **Active:** bluegreen underline, text color (#33302F)
- **Inactive:** greydark text
- **Spacing:** 24px between sub-tabs

### For Each Hygrothermal Function (e.g., Moisture Storage)

#### Section Layout

**Header Row**
```
[Function Title] [Info Icon]     [Edit Button] [Approximated Checkbox]
```

- **Title:** Jost, 1rem, 600 weight, text color
- **Info icon:** Blue circle with "i", 18px
- **Hover info:** "Shows relationship between relative humidity and water content"
- **Edit button:** Secondary button, "Edit Function Data" or "Edit Table"
- **Checkbox:** "Approximated" (if function is calculated from basic properties)
- **Spacing:** Bottom margin 16px

#### Subsection 1: Interactive Graph

**Container**
- **Width:** Full column width (960px - 48px padding)
- **Height:** 280px
- **Background:** White
- **Border:** 1px solid greylight
- **Border-radius:** 4px
- **Padding:** 16px

**Graph Styling**
- **Type:** XY scatter plot with connecting line
- **Library:** Recharts (optimized for performance)
- **X-axis:** Relative Humidity [%] or Moisture Content [kg/m³]
- **Y-axis:** Water Content [kg/m³] or Function Value
- **Line:** Color bluegreen (#4AB79F), width 2px
- **Data points:** Color bluegreen, radius 3px, hover effect (radius 5px, shadow)
- **Grid:** Major gridlines (grey at 20%), minor gridlines (greylight at 10%)
- **Axis labels:** Lato, 0.875rem, greydark
- **Axis values:** Monospace, 0.75rem, greydark

**Hover Behavior**
- **Tooltip:** Shows (x, y) values with units, follows cursor
- **Font:** Lato, 0.75rem
- **Background:** White with 1px border, subtle shadow
- **Position:** Centered on data point, offset to avoid overlap
- **Animation:** Fade-in 150ms

**Graph Footer**
- **Left side:** Data source indicator
  - "Based on EN ISO 12571" or "Measured data" or "User input"
  - Font: Lato, 0.75rem, greydark, italic
- **Right side:** Action buttons
  - Button: "Export as PNG" (secondary, 32px height)
  - Button: "Copy Data" (secondary, 32px height)

#### Subsection 2: Data Table (Collapsible)

**Trigger Control**
- **Button:** "Show Data Table" / "Hide Data Table"
- **Icon:** ChevronDown / ChevronUp (18px)
- **Position:** Left-aligned, below graph
- **Font:** Lato, 0.875rem, 500 weight, bluegreen
- **Cursor:** pointer
- **Margin-top:** 12px
- **Toggle state:** Stored per function (not per session)

**When Expanded:**

**Table Container**
- **Width:** Full width
- **Max-height:** 200px (scrollable)
- **Border:** 1px solid greylight
- **Border-radius:** 4px
- **Margin-top:** 12px
- **Overflow-y:** auto with custom scrollbar

**Table Header**
- **Row height:** 36px
- **Background:** greylight (#D9D8CD)
- **Font:** Lato, 0.75rem, 600 weight, text color
- **Padding:** 8px 12px
- **Border-bottom:** 1px solid greylight
- **Sticky:** Position: sticky, top: 0, z-index: 1

**Table Header Columns** (for Moisture Storage Function example)
1. **No.** (40px, centered)
2. **RH [%]** (100px, right-aligned, monospace)
3. **Water Content [kg/m³]** (140px, right-aligned, monospace)

**Table Rows**
- **Height:** 32px
- **Padding:** 8px 12px
- **Font:** Lato, 0.875rem, monospace, text color
- **Border-bottom:** 1px solid greylight at 30% opacity
- **Hover effect:** Background becomes greylight at 10%
- **Alternating rows:** Optional subtle background (disabled by default)

**Data Alignment**
- **First column (No.):** Centered
- **Value columns:** Right-aligned
- **Decimal places:** Match input precision (usually 2-3)

**Table Footer**
- **Height:** 36px
- **Background:** greylight at 10%
- **Border-top:** 1px solid greylight
- **Content:** 
  - Left: "Total data points: {count}"
  - Right: "Copy all data" button (secondary, 28px height)
- **Font:** Lato, 0.75rem, greydark

---

## Footer Section (Sticky, h=56px)

### Layout
- **Container:** Full width, white background, 1px top border (greylight), shadow-sm (reverse)
- **Padding:** 12px 16px
- **Display:** flex, justify-content: space-between, align-items: center

### Left Section - Info Text

**Quality Indicator**
- **Display:** Info message with icon
- **Icon:** Info circle (blue, 16px) or Warning triangle (yellow, 16px)
- **Font:** Lato, 0.875rem, greydark
- **Content examples:**
  - "🔵 Based on database estimate"
  - "🟢 Based on measured data"
  - "⚠️ Approximated functions based on basic properties"
  - "💾 Custom material — verify before simulation"

### Right Section - Action Buttons

**Button 1: Cancel**
- **Style:** Secondary (white background, 1px border greylight, greydark text)
- **Font:** Lato, 0.875rem, 600 weight
- **Padding:** 8px 20px
- **Height:** 36px
- **Border-radius:** 4px
- **Hover:** Background becomes greylight at 10%
- **Click:** 
  - If unsaved changes: Shows confirmation dialog
  - Otherwise: Closes modal, returns to previous view
- **Keyboard:** ESC key (but shows confirmation if unsaved)

**Button 2: Apply Changes** (or "Save Material")
- **Style:** Primary (background bluegreen, white text, no border)
- **Font:** Lato, 0.875rem, 600 weight
- **Padding:** 8px 20px
- **Height:** 36px
- **Border-radius:** 4px
- **Shadow:** shadow-sm (0 2px 4px rgba(0,0,0,0.1))
- **Hover:** Background becomes slightly darker (bluegreen at 110%)
- **Click:**
  - Validates all properties
  - If invalid: Shows inline error message in corresponding input
  - If valid: 
    - Applies changes to material
    - Triggers auto-save (1 second debounce)
    - Shows toast: "Material properties updated"
    - Closes modal
    - Returns to assembly view with material updated
- **Disabled state:** Grayed out if no changes made
- **Keyboard:** Ctrl+Enter or Cmd+Enter

**Button Spacing**
- **Gap:** 12px between buttons

---

## Edit Modes & Conditional Behaviors

### Display Mode (Database Materials)

When editing a material loaded from the database:

- **Header:** Shows material name + manufacturer logo
- **All properties:** Editable (can be customized)
- **Hygrothermal functions:** Read-only (can view, not edit)
- **Quality indicator:** Shows data source (e.g., "🟢 Measured data")
- **Footer info:** "This material is from the database - modifications are stored locally"
- **Unsaved changes:** Show in footer

### Edit Mode (Custom Materials)

When creating or editing a user-defined material:

- **Header:** Shows material name (editable)
- **All properties:** Editable (required)
- **Hygrothermal functions:** Option to define or approximate
- **Quality indicator:** Shows "💙 User-defined"
- **Footer info:** "Custom material - verify thermodynamic consistency"
- **Validation:** Stricter (checks for physical plausibility)

---

## Validation Rules

### Input Validation

**Real-time validation (on blur or during edit):**

| Property | Min | Max | Rule |
|----------|-----|-----|------|
| Bulk Density | 10 | 5000 | kg/m³, positive |
| Porosity | 0 | 1 | m³/m³, 0-1 range |
| Specific Heat Capacity | 100 | 5000 | J/(kg·K), positive |
| Thermal Conductivity (dry) | 0.01 | 5 | W/(m·K), positive |
| Water Vapor Diffusion μ | 0.1 | 10000 | dimensionless, positive |
| Typical Built-in Moisture | 0 | 200 | kg/m³, non-negative |
| Layer Thickness | 0.001 | 10 | meters, > 0 |

**Validation feedback:**
- **Invalid:** Red border around input, error message below input
- **Error message:** Lato, 0.75rem, red color
- **Example:** "Density must be between 10 and 5000 kg/m³"
- **Valid:** Green checkmark appears briefly (300ms)

### Thermodynamic Consistency Check

Optional (power users):
- Porosity check: φ = 1 - (ρ_bulk / ρ_solid)
- Vapor resistance check: μ should increase with density
- Thermal conductivity check: λ should be physically plausible

**Warning display:**
- **Background:** yellowlight at 30% opacity
- **Border-left:** 4px solid orange
- **Icon:** AlertTriangle (orange, 18px)
- **Content:** "⚠️ Porosity seems low for this material type"
- **Font:** Lato, 0.875rem, greydark

---

## Unsaved Changes Handling

### Detection

Track all property changes:
- Compare current state to initial state
- Flag as "unsaved" if any difference

### Confirmation Dialog

**Trigger:** User clicks Cancel or attempts to close modal with unsaved changes

**Dialog styling:**
- **Overlay darkness:** 60% opacity (darker than normal)
- **Dialog size:** 400px wide, centered
- **Background:** White
- **Border-radius:** 8px
- **Shadow:** shadow-lg

**Dialog content:**
- **Title:** "Unsaved Changes"
- **Message:** "You have unsaved changes to this material. Do you want to discard them?"
- **Font:** Lato, 0.875rem, greydark
- **Margin:** 20px

**Buttons:**
- **Button 1:** "Keep Editing"
  - Style: Primary (bluegreen)
  - Action: Dismisses dialog, returns to modal
  - Focus: Automatically returns to first changed field

- **Button 2:** "Discard Changes"
  - Style: Secondary (red text, white background, red border)
  - Action: Closes modal without saving
  - State: Reverts to original values

**Keyboard:**
- ESC closes confirmation dialog (same as "Keep Editing")
- Tab cycles between buttons

---

## Accessibility & Keyboard Navigation

### Focus Management

- **Initial focus:** Material name input (first editable field)
- **Tab order:** Left column properties → Right column properties → Tabs → Buttons
- **Focus indicator:** 2px border in bluegreen around focused element

### Keyboard Shortcuts

| Key | Action |
|-----|--------|
| Tab | Move to next field |
| Shift+Tab | Move to previous field |
| Enter | When focused on input: Validate and move to next |
| Ctrl+Enter / Cmd+Enter | Submit form (Apply Changes) |
| Escape | Cancel (with unsaved changes dialog if needed) |
| Alt+H | Jump to Hygrothermal Functions tab |
| Alt+D | Jump to Material Data tab (when in other tab) |

### Screen Reader Support

- **Modal:** role="dialog", aria-modal="true", aria-labelledby="modal-title"
- **Title:** id="modal-title", contains material name
- **Form groups:** fieldset + legend for each section
- **Inputs:** Associated labels with `<label for="input-id">`
- **Error messages:** aria-live="polite", role="alert"
- **Tabs:** role="tablist", tab role="tab", aria-selected, aria-controls
- **Info icons:** aria-label or aria-describedby with accessible description

---

## Responsive Behavior

### Breakpoint: 1400px (Normal Desktop)
- **Layout:** Two-column (540px | 440px) as specified
- **Modal width:** 1000px
- **No horizontal scrolling**

### Breakpoint: 1024px (Tablet/Small Desktop)
- **Modal width:** 900px (90% of viewport, max 900px)
- **Layout:** Two-column maintained (adjusted widths)
- **Padding:** Reduced to 16px
- **Font sizes:** Unchanged (readable at distance)

### Breakpoint: 768px (Tablet)
- **Modal width:** 95% of viewport (with 16px margin)
- **Layout:** Stack columns vertically (full width each)
- **Tab bar:** Becomes scrollable horizontally if needed
- **Buttons:** Full width in footer
- **Footer:** Stacks vertically if needed

### Breakpoint: < 540px (Mobile)
- **Modal:** Full-screen experience
- **Header:** Simplified (no manufacturer logo visible)
- **Layout:** Single column, full width
- **Tab bar:** Scrollable, shows active tab highlighted
- **Buttons:** Full width, stacked vertically
- **Font sizes:** Slightly reduced (0.875rem minimum for readability)

---

## Motion & Transitions

### Open Animation
```
Overlay: Fade-in 200ms (opacity 0→0.4)
Modal: Scale 0.95→1.0 + Fade-in 300ms (ease-out)
```

### Close Animation
```
Modal: Scale 1.0→0.95 + Fade-out 200ms (ease-in)
Overlay: Fade-out 200ms (opacity 0.4→0)
```

### Tab Switch
```
Content: Fade-out 100ms + Fade-in 200ms (ease-out)
Tab indicator: Slide to position 200ms (cubic-bezier 0.4, 0, 0.2, 1)
```

### Property Edit
```
On blur (validation): Subtle pulse (scale 1.0→1.02→1.0) if invalid
Focus: Box-shadow expand 150ms
```

---

## Error Handling

### Network/API Errors

**Scenario:** Material data fails to load or save

**Display:**
- **Position:** Inside modal, above content
- **Background:** redLight (#F2D4D4)
- **Border:** 1px solid red (#C04343)
- **Border-left:** 4px solid red
- **Icon:** AlertCircle (red, 20px)
- **Message:** "Failed to load material data. Please try again."
- **Action:** Retry button (secondary, inline)
- **Font:** Lato, 0.875rem, text color
- **Padding:** 12px
- **Margin-bottom:** 16px

### Validation Errors

**Per-field:**
- Red border around input
- Error message below field (Lato, 0.75rem, red)
- Focus moves to first invalid field on submit

**Summary (if multiple):**
- Shows count of errors at top of modal
- "Fix 3 issues before applying changes"
- Font: Lato, 0.875rem, orange

---

## Design System Compliance Checklist

### Colors (from C3RRO Design System)
- ✅ Text: #33302F (primary text)
- ✅ Greydark: #5E5A58 (secondary text, labels)
- ✅ Greylight: #D9D8CD (borders, backgrounds)
- ✅ Bluegreen: #4AB79F (primary actions, highlights)
- ✅ Orange: #E18E2A (warnings, secondary accent)
- ✅ Red: #C04343 (errors, danger actions)
- ✅ Yellow: #F8C36E (info, notifications)
- ✅ White: #FFFFFF (backgrounds, cards)

### Typography (from C3RRO Design System)
- ✅ Headings: Jost, 600 weight
- ✅ Body text: Lato, 400 weight
- ✅ Monospace: Used for data values and numeric inputs
- ✅ Font sizes: 0.75rem (captions), 0.875rem (body), 1rem (headers), 1.25rem (modal title)
- ✅ Line-height: 1.4-1.6 for body text

### Spacing (Design System)
- ✅ Modal padding: 24px (from specification)
- ✅ Gap between columns: 24px
- ✅ Gap between properties: 16px
- ✅ Gap between buttons: 12px
- ✅ Border-radius: 4px (inputs), 8px (modal)

### Shadows (Design System)
- ✅ Subtle: 0 2px 4px rgba(0,0,0,0.1)
- ✅ Medium: 0 4px 12px rgba(0,0,0,0.15)
- ✅ Modal overlay: 0 20px 25px rgba(0,0,0,0.15)

### Interactive Elements
- ✅ Buttons: Primary (bluegreen bg, white text), Secondary (white bg, border, text color)
- ✅ Inputs: Focused state (bluegreen border), error state (red border)
- ✅ Hover states: Subtle background color change or shadow increase
- ✅ Disabled state: 50% opacity, cursor: not-allowed

### Accessibility
- ✅ Contrast ratio: All text > 4.5:1 (WCAG AA)
- ✅ Focus indicators: Visible on all interactive elements
- ✅ Keyboard navigation: Tab order, Enter to submit, ESC to cancel
- ✅ Screen reader support: ARIA labels, roles, live regions

---

## Implementation Notes

### React Component Structure

```jsx
<EditMaterialDataModal>
  <Header>
    <Title>Material Name</Title>
    <CloseButton />
  </Header>
  
  <TabNavigation>
    <Tab name="Material Data" active>Content</Tab>
    <Tab name="Information">Content</Tab>
    <Tab name="Hygrothermal Functions">Content</Tab>
  </TabNavigation>
  
  <ContentArea>
    <LeftColumn>
      <PropertyInput label="Bulk Density" />
      <PropertyInput label="Porosity" />
      {/* ... */}
    </LeftColumn>
    <RightColumn>
      <PropertyInput label="Typical Built-In Moisture" />
      <PropertyInput label="Design Value Conductivity" />
      {/* ... */}
    </RightColumn>
  </ContentArea>
  
  <Footer>
    <InfoText />
    <CancelButton />
    <ApplyButton />
  </Footer>
</EditMaterialDataModal>
```

### State Management

**Local state:**
- `formValues`: Current property values
- `changedFields`: Set of fields that have been modified
- `errors`: Validation errors per field
- `activeTab`: Current tab (Material Data, Information, Hygrothermal Functions)
- `activeSubTab`: Current hygrothermal function (Moisture Storage, etc.)
- `expandedTables`: Which data tables are expanded

**External (Redux/Zustand):**
- `selectedMaterial`: Material data from database or custom
- `layerContext`: Which layer this material belongs to
- `projectSettings`: For validation rules, standards, etc.

### Performance Considerations

1. **Virtual scrolling:** For data tables with 100+ rows
2. **Memoization:** Prevent unnecessary re-renders of graph components
3. **Lazy loading:** Load hygrothermal function data on tab click (not modal open)
4. **Debounced validation:** 500ms debounce on input blur for real-time checks
5. **Debounced auto-save:** 1000ms debounce when applying changes

---

## Future Enhancements

1. **Material comparison:** Side-by-side view of 2-3 materials
2. **Function editing:** Edit individual data points in hygrothermal functions
3. **Function import:** Load functions from external standards or research data
4. **Material versioning:** Track changes to custom materials
5. **Smart defaults:** Auto-populate fields based on similar materials
6. **Export to standards:** Export material in standard formats (WUFI, WinkelC, etc.)
7. **Collaborative editing:** Real-time sync of material edits across team

---

## References

- **C3RRO Visual Design System:** `250729_c3rro-visual-design-system.tsx`
- **WUFI Cloud UI/UX v2.1:** Complete specification in project knowledge
- **WUFI Pro Material Data Modal:** `MaterialData_Modal.JPG` (screenshot reference)
- **Design System:** Color palette, typography, spacing, shadows
- **Material Database Modal:** Related modal specification for selection workflow

---

## Revision History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2025-11-07 | Initial specification - comprehensive design for edit material data modal |

