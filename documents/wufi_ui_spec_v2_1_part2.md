# WUFI Cloud UI/UX - Complete Design Specification v2.1
## Part 2: Main Interface Specifications

**Document Version:** 2.1 (Final)  
**Last Updated:** 2025-10-20  
**Status:** Production-Ready Design Specification  
**Reference:** See Part 1: General & Foundation for design system, Part 3 for modal specifications

---

## Page Layout Architecture

### Overall Structure
```
┌─────────────────────────────────────────────────────────────────────┐
│ Header: Logo | Project Name | Case Selector | Actions              │
├─────────────────────────────────────────────────────────────────────┤
│ Status Bar: State | Issues | Stats                                  │
├─────────────────────────────────────────────────────────────────────┤
│ Tabs: [Setup] [Results]                                             │
├──────────────┬──────────────────────────────┬──────────────────────┤
│ Left Panel   │ Center Panel                 │ Right Panel          │
│ 288px        │ Flexible width               │ 320px                │
│              │                              │                      │
│ Collapsible  │ Performance Summary          │ Context-Sensitive    │
│ Sections:    │ Visual Assembly              │ Inspector            │
│ • Project    │ Data Table                   │                      │
│ • Orient.    │                              │ Quick Actions        │
│ • Climate    │                              │ Properties Preview   │
│ • Calc.      │                              │                      │
│ • Advanced   │                              │ (Changes based on    │
│ • User       │                              │  selection)          │
│              │                              │                      │
└──────────────┴──────────────────────────────┴──────────────────────┘
```

---

## Header & Navigation

### Header Components (Left to Right)

1. **C3RRO Logo**
   - Font: Jost, 1.5rem, bold, teal (#4AB79F)
   - Clickable: Navigate to project list
   - Padding: 12px left

2. **Divider** (vertical line, 1px, greylight)

3. **Project Name** (Editable)
   - Font: Jost, 1.125rem, semibold, text color
   - Inline editable input (click to edit)
   - Placeholder: "Untitled Project"
   - Padding: 12px horizontal
   - Triggers auto-save on blur

4. **Case Selector** (Dropdown)
   - Display: "Case {#}: {name}" or "Case {#}"
   - Background: bluegreen at 15% opacity
   - Border: 1px solid bluegreen
   - Padding: 8px 12px
   - Font: Lato, 0.875rem
   - On click: Opens case dropdown menu

5. **Case Dropdown Menu**
   - Width: 320px
   - Appears below case selector
   - Shows all cases with status badges
   - "Duplicate Current Case" button at bottom (primary, teal)
   - Max visible: 6 cases before scrolling (dropdown scrolls internally)

   **Case Item Structure:**
   - Case name (bold, Jost, 1rem)
   - Status badge: Green (Completed) | Teal (Ready) | Gray (Draft)
   - Description or timestamp (0.875rem, greydark)
   - On hover: Light background, pointer cursor
   - Selected case: Slightly bolder, checkmark indicator

6. **Spacer** (Flexible space)

7. **Action Buttons** (Right-aligned)
   - Material Database button (icon: Database, secondary)
   - Undo button (icon: CornerUpLeft, secondary)
   - Redo button (icon: CornerUpRight, secondary, disabled state common)
   - Import button (icon: Upload, secondary)
   - Save button (icon: Save, secondary)
   - Run Simulation button (icon: Play, primary teal)

**Action Button Specifications:**
- Height: 36px
- Padding: 8px 16px
- Gap between buttons: 8px
- Icons: 18px, Lucide React icons
- Font: Lato, 0.875rem, 600 (semibold)
- Disabled state: 50% opacity, cursor: not-allowed

**Run Simulation Button States:**
- Ready: Teal background, white text, "Run Simulation"
- Errors: Red border, disabled, "Fix Errors to Run"
- Running: Blue background, spinner icon, "Running... 45%"
- Completed: Green checkmark, "View Results"

---

## Status Bar (Below Header)

### Purpose
Always-visible simulation readiness indicator. Shows overall state, issues, and quick statistics.

### Layout
```
┌────────────────────────────────────────────────────────────┐
│ [Icon] Status Message | Stat 1 • Stat 2 • Stat 3    [▼]   │
│                                                             │
│ (Expanded)                                                  │
│ Issues List:                                                │
│ ✗ Error: Invalid layer material                            │
│ ⚠ Warning: No monitors defined                             │
└────────────────────────────────────────────────────────────┘
```

### Status States

**Ready (Green)**
- Icon: Check circle (#3E7263)
- Message: "Ready to run simulation"
- Background: greenlight at 15% opacity
- Show right-side stats: Layer count, monitor count, grid cells

**Warnings (Orange)**
- Icon: Alert triangle (#E18E2A)
- Message: "Review warnings before running"
- Background: orange at 15% opacity
- Non-blocking issues (e.g., "No monitors defined")

**Errors (Red)**
- Icon: Alert circle (#C04343)
- Message: "Fix errors before running"
- Background: red at 15% opacity
- Blocking issues (e.g., "Missing material in layer 2")
- Simulation button becomes disabled + red border

**Running (Blue)**
- Icon: Spinner animation (rotating, #4597BF)
- Message: "Simulation in progress... (45%)"
- Background: blue at 15% opacity
- Progress percentage if available

**Completed (Green)**
- Icon: Check circle with background (#3E7263)
- Message: "Simulation completed successfully"
- Background: greenlight at 15% opacity
- Results tab now enabled

### Status Bar Specifications
- Height: 48px (expandable to ~200px)
- Padding: 12px 24px
- Border-bottom: 1px solid greylight
- Font: Lato, 0.875rem for message, 0.75rem for stats
- Expandable: Click anywhere to toggle details
- Animation: Smooth slide-down (300ms ease-out) when expanding

### Expanded Issue List
- Max-height: 200px, scrollable if many issues
- Each issue: [Icon] [Message] [Action link]
- Severity order: Errors first, then warnings, then info
- Action links: "Fix now" or "Learn more" where applicable
- Issue item height: 32px
- Issue item padding: 8px 16px

---

## Tab Navigation

### Two Main Tabs

**Setup Tab** (Active by default)
- Text: "Setup"
- Icon: Settings (optional, 18px)
- State: Active by default
- Shows: All configuration UI (left, center, right panels)

**Results Tab** (Disabled until simulation completes)
- Text: "Results" (with checkmark ✓ when simulation complete)
- Icon: BarChart2 (optional, 18px)
- State: Disabled (grayed out) until simulation runs successfully
- When clicked after run: Shows results visualization
- Disabled state: Cursor: not-allowed, opacity: 50%

**Tab Styling:**
- Height: 44px
- Padding: 12px 24px
- Font: Lato, 0.875rem, 600 (bold when active)
- Border-bottom: 2px solid transparent
- Active tab: Border-bottom color = bluegreen (#4AB79F), text bold
- Inactive tab: Border-bottom greylight, text greydark
- Transition: 200ms ease-out
- Hover (inactive): Border-bottom color = grey
- Hover (disabled): No change

---

## Left Panel (288px) - Collapsible Settings

### Overall Design
- Background: white
- Border-right: 1px solid greylight
- Overflow-y: auto
- All sections collapsible with persistent state (localStorage)

### Section Structure (All Sections Follow Pattern)

**When Expanded:**
- Header: Icon + Title + Collapse arrow
- Content: Full details/form
- Padding: 16px
- Border-bottom: 1px solid greylight

**When Collapsed:**
- Header: Icon + Title (smaller, 0.875rem) + Collapse arrow
- Summary line: Key info (1-2 items max)
- Padding: 8px 16px
- Subtle background change (greylight at 5% opacity)

**Header Interaction:**
- Click to toggle expand/collapse
- Arrow rotates 180° (animated, 200ms)
- Entire header is clickable
- Hover: Background lightens slightly

---

### Section 1: Project Info (Collapsible, default COLLAPSED)

**Collapsed State:**
- Title: "Project"
- Icon: Folder
- Summary: Project name (bold, truncated if long)

**Expanded State:**
- Project name (editable input, Jost, 1rem)
- Client name (text input, optional)
- Project number (text input, optional)
- Description (textarea, 3 lines, optional)
- Date created (read-only, greydark, 0.75rem)

**Specifications:**
- Inputs use standard styling (1px border, greylight, 8px padding)
- Focus: 2px bluegreen outline with 2px offset
- Font: Lato, 0.875rem body text, 0.75rem labels
- Labels: Above inputs, 0.75rem, greydark, margin-bottom: 4px

---

### Section 2: Orientation & Geometry (Collapsible, default COLLAPSED)

**Collapsed State:**
- Title: "Orientation"
- Icon: Compass
- Summary: Direction + inclination (e.g., "South, 90°")

**Expanded State:**

**Direction (Dropdown with preview):**
- Label: "Direction"
- Options: North, NE, East, SE, South, SW, West, NW
- Default: North
- Shows compass rose visualization (80px circle below dropdown)
- Compass needle indicates selected direction

**Inclination (Number input):**
- Label: "Inclination [°]"
- Input: 0-180° range
- Default: 90 (vertical wall)
- Tooltip: "0° = horizontal (roof), 90° = vertical (wall)"
- Validation: Must be 0-180

**Component Height (Optional, future):**
- Label: "Component Height [m]"
- Input: Number, optional
- Used for rain load calculations

**Specifications:**
- Compass visualization: SVG, 80px diameter
- Real-time update on selection (no save button needed)
- Auto-save on blur

---

### Section 3: Climate (Collapsible, default EXPANDED)

**Design Principle:** Climate is fundamental. Always expanded by default.

**Collapsed State:**
- Title: "Climate"
- Icon: Cloud
- Summary: Exterior + Interior names (e.g., "Nashville, TN | Indoor Standard")

**Expanded State:**

Two cards stacked vertically:

**Card 1: Exterior Climate**
- Header: "Exterior Climate" (bold, 0.875rem)
- Selected climate name (bold, 1rem, text color)
- Location or type (0.75rem, greydark)
- Button: "View / Change" (secondary, full width)
- Background: White, 1px border greylight, 8px padding
- Margin-bottom: 12px

**Card 2: Interior Climate**
- Header: "Interior Climate" (bold, 0.875rem)
- Selected climate name (bold, 1rem, text color)
- Derived from or type (0.75rem, greydark)
- Button: "View / Change" (secondary, full width)
- Background: White, 1px border greylight, 8px padding

**Clicking "View / Change":**
- Opens Climate Selection Modal (see Part 3)
- Pre-selects Exterior or Interior based on which card was clicked
- Modal shows climate visualization, parameters, statistics

**Empty State (no climate selected):**
- Card shows dashed border
- Icon: AlertCircle (orange)
- Message: "No climate selected"
- Button: "Select Climate" (primary, teal)

---

### Section 4: Calculation Period (Collapsible, default COLLAPSED)

**Collapsed State:**
- Title: "Calculation Period"
- Icon: Calendar
- Summary: Start date + duration (e.g., "Jan 1, 2024 - 1 year")

**Expanded State:**

**Start Date:**
- Label: "Start Date"
- Input: Date picker
- Default: Jan 1 of current year
- Format: MMM DD, YYYY

**Duration:**
- Label: "Duration"
- Dropdown: [1 year] [3 years] [5 years] [Custom]
- Default: 1 year
- If Custom selected: Number input + unit dropdown (months/years)

**Time Step (Advanced):**
- Label: "Time Step"
- Dropdown: [1 hour] [30 minutes] [15 minutes] [Auto]
- Default: Auto
- Tooltip: "Smaller time steps increase accuracy but slow simulation"

**Specifications:**
- Date picker: Standard browser input type="date"
- Auto-save on change
- Validation: Start date must be within climate data range

---

### Section 5: Advanced Settings (Collapsible, default COLLAPSED)

**Collapsed State:**
- Title: "Advanced"
- Icon: Settings
- Summary: "Standard accuracy" or custom settings count

**Expanded State:**

**Increased Accuracy:**
- Checkbox: "Increased Accuracy"
- Label: "Use finer grid and stricter convergence"
- Default: Unchecked
- Warning below: "Increases simulation time by ~2-3x"

**Adaptive Time Step:**
- Checkbox: "Adaptive Time Step"
- Label: "Automatically adjust time step for convergence"
- Default: Checked
- Tooltip: "Recommended for most cases"

**Grid Discretization:**
- Label: "Grid Discretization"
- Dropdown: [Auto II] [Auto I] [User-defined]
- Default: Auto II
- If User-defined: Shows per-layer grid controls (future feature)

**Convergence Criteria (Future):**
- Input: Number, default 0.001
- Tooltip: "Lower = stricter (slower), higher = faster (less accurate)"

**Specifications:**
- Checkboxes: Standard styling, 18px, teal when checked
- Labels: Lato, 0.875rem, clickable
- Tooltips: Appear on hover, greydark background, white text

---

### Section 6: User Settings (Collapsible, default COLLAPSED)

**Collapsed State:**
- Title: "Display"
- Icon: Eye
- Summary: Units + theme

**Expanded State:**

**Unit System:**
- Label: "Unit System"
- Radio buttons: [SI] [Imperial]
- Default: SI
- Affects all displayed units (m, °C, W/m²K, etc.)

**Theme (Future):**
- Label: "Theme"
- Radio buttons: [Light] [Dark] [Auto]
- Default: Light

**Layer Colors:**
- Label: "Layer Color Scheme"
- Radio buttons: [Material-based] [Custom]
- Material-based: Colors derived from material type
- Custom: Click color square to open color picker
- Colors persist per project

**Specifications:**
- Unit conversion happens in real-time
- Theme preference saved to localStorage
- Color picker: Standard browser input type="color"

---

## Center Panel (Flexible Width) - Main Work Area

### Overall Design
- Background: Light gray (#F9FAFB)
- Overflow-y: auto
- Padding: 16px
- Minimum width: 600px (for usability)

---

### Performance Summary Bar (Top)

**Purpose:** Show key calculated metrics at a glance.

**Layout:** Horizontal cards, spaced 12px apart

**Card 1: Total Thickness**
- Label: "Total Thickness"
- Value: {sum of all layers} m
- Icon: Layers (18px)
- Font: Jost, 1.25rem for value

**Card 2: U-Value**
- Label: "U-Value"
- Value: {calculated} W/(m²·K)
- Icon: Checkmark (green) or AlertCircle (orange)
- Font: Jost, 1.25rem for value
- Validation indicator: Green if within typical range, orange if unusual

**Card 3: Grid Toggle**
- Button: "Grid" with eye icon
- Toggle state: [Show Grid] / [Hide Grid]
- When toggled on: Shows grid discretization below visual assembly
- Background: White when off, teal when on

**Specifications:**
- Height: 80px per card
- Background: White
- Border: 1px solid greylight
- Border-radius: 8px
- Padding: 12px
- Shadow: shadows.sm

---

### Visual Assembly (Center Area)

**Purpose:** Spatial representation of layer stack with surfaces and monitors.

**Layout:**
- Orientation: Horizontal (exterior left → interior right)
- Container: White background, 1px border, 12px padding
- Min-height: 200px
- Max-height: 400px (scrollable if more layers)

**Surface Labels:**
- "Exterior (Left Side)" on left (vertical text)
- "Interior (Right Side)" on right (vertical text)
- Font: Lato, 0.75rem, greydark, rotated 90°

**Layer Representation:**
- Width: Proportional to thickness
- Height: Fixed 200px
- Background: Material color (from database or custom)
- Pattern overlay: Diagonal lines (crosshatch) at 10% opacity
- Border: 1px solid greylight
- Gap between layers: 2px

**Layer Selection:**
- Click to select
- Selected: 3px inset border, teal color
- Hover: Slight brightness increase, cursor: pointer

**Thickness Labels:**
- Position: Above each layer
- Text: "{thickness} m" (monospace, 0.75rem)
- Background: White with slight shadow for readability

**Material Name Labels:**
- Position: Below visual assembly
- Text: Material name (truncated if long)
- Font: Lato, 0.75rem, bold
- Below name: λ value (monospace, 0.75rem, greydark)

---

### Surface Representation

**Exterior Surface (Left):**
- Width: 4px thick vertical bar
- Color: Blue (#4597BF)
- Selectable: Click to select
- Selected: Teal border around surface area

**Interior Surface (Right):**
- Width: 4px thick vertical bar
- Color: Blue (#4597BF)
- Selectable: Click to select
- Selected: Teal border around surface area

**Surface Hover:**
- Cursor: pointer
- Tooltip: "Exterior Surface" or "Interior Surface"
- Brightness increase

---

### Monitor Placement

**Monitor Visual:**
- Representation: **Target icon only** (⊙ symbol or circular target, Lucide: Target icon)
- Size: 20px diameter
- Color: Orange (#E18E2A) when unselected
- Color: Teal (#4AB79F) when selected
- Position: Calculated as % through assembly, overlaid on layers
- Vertical alignment: Center of visual assembly height

**Monitor Interaction:**
- Hover: Scale to 1.2x, shadow increases
- Click: Selects monitor (shows properties in right panel)
- Tooltip on hover: Display monitor name + position (e.g., "Monitor A: 45% through Insulation")

**Monitor Placement Logic:**
- Position calculated as percentage through layer (0-100%)
- When placed via grid, position snaps to selected cell center
- Multiple monitors: Stack horizontally if in same visual position (4px offset to prevent overlap)

**Adding Monitors:**
- Via grid discretization (see below)
- Via right-click on layer → "Add Monitor Here" (future)

---

### Grid Discretization Visualization (Conditional)

**When Enabled:**
- Appears below visual assembly when user toggles "Grid" button
- Only visible if a layer is selected

**Grid Display:**
```
┌──────────────────────────────────────────────┐
│ Grid Discretization: Insulation (50mm)       │
├──────────────────────────────────────────────┤
│ ▯ ▮ ▯ ▮ ▯ ▮ ▯ ▮ ▯ ▮ ... (36 cells)          │
├──────────────────────────────────────────────┤
│ Click on a cell to place monitor             │
└──────────────────────────────────────────────┘
```

**Specifications:**
- Header: Layer name + thickness (bold, Jost, 0.875rem)
- Grid cells: Alternating white/gray (greylight #D9D8CD)
- Cell sizing: Equal width, adjust to fit container
- Cell height: 24px
- Border: 1px solid greylight between cells
- Hover effect: Teal highlight on cell (bluegreen #4AB79F)
- Cursor: Pointer on hover
- Instructions: Light gray text below grid (Lato, 0.75rem, greydark)

**Grid Interaction:**
- Click cell: Places/removes monitor at that position
- Monitor appears on main visual as target icon
- If monitor already exists at cell: Clicking removes it
- Status updates in right panel

**Cell Selection Visual:**
- Selected cell (has monitor): Teal background
- Empty cell: Default alternating gray/white
- Hover: Teal outline, 2px

---

### Data Table (Below Visual Assembly)

**Purpose:** Show all layers with editable properties. Allows quick scanning and inline editing.

**Columns (Default Order):**
1. **[Drag Handle]** - Grip icon (24px), enables reordering
2. **[#]** - Row number (read-only, centered, 32px width)
3. **[Layer Name]** - Editable text input (flexible width, min 120px)
4. **[Material]** - Read-only, teal link text (clickable → opens material database modal)
5. **[Thickness]** - Editable number input (80px width, right-aligned)
6. **[λ (dry)]** - Read-only, monospace (60px width, right-aligned)
7. **[Actions]** - Duplicate (copy icon) | Delete (trash icon) (80px width)

**Table Styling:**
- Header row: Bold (700), greylight background, 1px border-bottom
- Data rows: Lato, 0.875rem
- Row height: 44px
- Cell padding: 8px horizontal, 12px vertical
- Selected row: Light teal background (bluegreen at 10% opacity), 2px left border teal
- Hover row: Slightly lighter background (#F9FAFB)
- Alternating row colors: Optional subtle (disabled by default)

**Row Interactions:**

**Drag & Drop:**
- Click grip icon + drag to reorder
- Visual feedback: Row has slight shadow, gap indicator shows drop position
- Drop zone: Between any rows or at top/bottom
- Drop indicator: 2px teal line
- On drop: Layers reorder, assembly visual updates, auto-save triggered

**Inline Editing:**
- Layer name: Click to edit, blur to save, Enter to confirm
- Thickness: Click to edit, blur to save with validation
- Validation on blur: Must be > 0.001m and < 10m
- Invalid: Red border, error message below field
- Valid: Green checkmark appears briefly

**Material Column:**
- Displayed as teal link (underlined on hover)
- Font: Bold when layer selected
- Click: Opens Material Database Modal (Part 3) with this layer pre-selected
- Material updates automatically when changed in modal

**Actions Column:**
- Duplicate icon (Copy): Creates new layer below with same properties
- Delete icon (Trash): Removes layer
  - If only layer: Shows warning toast, prevents deletion
  - If multiple layers: Removes immediately (undo available)
- Icons: 18px, greydark color, hover: red for delete, teal for duplicate

**Table Footer:**
- Button: "+ Add Layer" (secondary, teal text, left-aligned)
- On click: Opens Material Database Modal for new layer selection
- New layer added at bottom, auto-save triggered

**Column Configuration (Future):**
- Right-click header: Show/hide columns menu
- Drag column headers to reorder
- Pre-defined layouts: "Basic", "Thermal", "Moisture", "Full"
- Custom layout saved per user (localStorage)

**Specifications:**
- Table container: White background, 1px border, border-radius: 8px
- Min-height: 200px (show at least 4 rows)
- Max-height: 500px, scrollable if more rows
- Scroll: Sticky header when scrolling

---

## Right Panel (320px) - Context-Sensitive Inspector

### Overall Design
- Background: White
- Border-left: 1px solid greylight
- Overflow-y: auto
- Fixed width (doesn't collapse on desktop)
- Content changes based on selection (layer, surface, monitor, or nothing)

---

### Quick Actions (Always at Top)

**Purpose:** Primary actions for current selection. Always visible and prominent.

**When Layer Selected:**
```
[Primary: Select from Database 🔍]
[Secondary: Edit Material Properties]
[Tertiary: Add Source / Sink 💧]
```

- **Button 1 (Primary, Teal):** "Select from Database"
  - Icon: Database (18px)
  - Full width, 40px height
  - On click: Opens Material Database Modal (Part 3)
  - Most common action (95% of users)

- **Button 2 (Secondary, White):** "Edit Material Properties"
  - Icon: Settings (18px)
  - Full width, 40px height
  - On click: Opens Material Properties Modal (advanced, for power users)
  - Border: 1px solid greylight
  - Future feature for custom material editing

- **Button 3 (Tertiary, White):** "Add Source / Sink"
  - Icon: Droplet (18px)
  - Full width, 40px height
  - On click: Adds moisture source/sink at this layer
  - Optional feature for advanced users
  - Future feature

**When Surface Selected:**
```
[Primary: Edit Surface Coefficients]
```

- **Button 1 (Primary, Teal):** "Edit Surface Coefficients"
  - Icon: Settings (18px)
  - Full width, 40px height
  - On click: Opens Surface Coefficients Modal (Part 3)

**When Monitor Selected:**
```
[Primary: Edit Monitor Settings 🎯]
[Danger: Remove Monitor 🗑️]
```

- **Button 1 (Primary, Teal):** "Edit Monitor Settings"
  - Icon: Target (18px)
  - Full width, 40px height
  - On click: Opens Monitor Configuration Modal (Part 3)

- **Button 2 (Danger, Red text):** "Remove Monitor"
  - Icon: Trash (18px)
  - Full width, 40px height
  - Border: 1px solid red
  - Background: White
  - On click: Removes monitor immediately (undo available via Cmd/Ctrl+Z)

**When Nothing Selected:**
```
ℹ️ Select a layer, surface, or monitor to view details
```

- Centered info icon (blue, Info circle, 24px)
- Instructional message (greydark text, 0.875rem, centered)
- Gray background (greylight at 5% opacity)
- Padding: 24px
- Border-radius: 8px

**Button Specifications:**
- Height: 40px
- Padding: 0 16px (full width)
- Font: Lato, 0.875rem, 600 (semibold)
- Gap between buttons: 8px
- Top padding of section: 16px
- Margin between section and properties: 16px

---

### Properties Preview (Below Quick Actions)

**Purpose:** Read-only summary of selected element's key properties.

**When Layer Selected:**

Display as cards:

**Card 1: Material Info**
- Title: "Material" (bold, 0.75rem, uppercase, greydark)
- Properties:
  - Name: Bold, 0.875rem, text color, margin-bottom: 4px
  - λ (dry): Monospace, 0.75rem, greydark
  - ρ (bulk density): Monospace, 0.75rem, greydark
  - Thickness: Monospace, 0.75rem, greydark
  - Grid cells: Monospace, 0.75rem, greydark
- Background: greylight at 5% opacity
- Padding: 12px
- Border-radius: 6px
- Border: 1px solid greylight (light)
- Margin-bottom: 12px

**Card 2: Initial Conditions (Editable)**
- Title: "Initial Conditions" (bold, 0.75rem, uppercase, greydark)
- Properties (editable inline):
  - Temperature [°C]: Number input, small (8px padding)
  - Relative Humidity [%]: Number input, small
- Validation: 
  - Temperature: -50 to 80°C (typical range)
  - RH: 0 to 100%
- On blur: Auto-save, validation feedback
  - Invalid: Red border, error text below
  - Valid: Green checkmark briefly appears
- Background: white
- Border: 1px solid greylight
- Padding: 12px
- Border-radius: 6px
- Margin-bottom: 12px

**When Surface Selected:**

**Card 1: Surface Properties**
- Title: "Exterior Surface" or "Interior Surface"
- Properties (read-only):
  - Heat Resistance [(m²·K)/W]: Monospace
  - sd-Value [m]: Monospace
  - Absorptivity [-]: Monospace (exterior only)
  - Rain Coefficient [-]: Monospace (exterior only)
- Font: 0.75rem, greydark for labels, monospace for values
- Background: greylight at 5% opacity
- Padding: 12px

**When Monitor Selected:**

**Card 1: Monitor Info**
- Title: "Monitor: {name}"
- Properties (read-only):
  - Location: Layer name (0.875rem, bold)
  - Position: "45% through layer" or similar (0.75rem, greydark)
  - Variables: Displayed as chips (small colored tags)
    - Example chips: [Temperature] [Relative Humidity] [Water Content]
    - Each chip: 6px padding, gray background (greylight at 20%), rounded 4px, 0.75rem font
    - Chips wrap if many variables
- Padding: 12px
- Margin-bottom: 12px

---

## Status Validation & Messages

### Real-Time Validation

All inputs validate on blur (not keystroke):

**Thickness Input:**
- Rule: Must be > 0.001m and < 10m
- Invalid: Red border, red text below field
  - Message: "Thickness must be between 0.001 and 10 m"
- Valid: Green checkmark on right side of field (appears briefly)

**Initial Conditions:**
- Temperature rule: -50°C to 80°C
- RH rule: 0% to 100%
- Invalid: Red border, red text below field
  - Message: "Temperature must be between -50 and 80°C"
  - Message: "Relative humidity must be between 0 and 100%"
- Valid: Green checkmark

**Debounce:** 250ms before validation fires

### Status Bar Messages

**Errors (block simulation):**
- "Layer 2 has invalid material"
- "Monitor position outside layer bounds"
- "Missing exterior climate"
- "Initial conditions out of valid range"

**Warnings (non-blocking):**
- "No monitors defined - results will be limited"
- "Layer 3: Thickness may be unusually thick for this material"
- "U-value outside typical range for building component"

**Info:**
- "Assembly ready for simulation"
- "3 layers, 2 monitors, 156 grid cells"

---

## Design Decisions & Rationale

### Why Three-Panel Layout?
- **Left:** Project-level settings are "set once" → separate from per-layer config
- **Center:** Visual + table provides both spatial understanding and precise editing
- **Right:** Context-sensitive details prevent cluttering main area

### Why Climate in Left Panel?
- Climate is a **project-level decision**, not per-layer
- Set once (exterior + interior), applies to entire assembly
- Reduces cognitive load (climate is fundamental context, not iterative config)

### Why Modals for Materials/Climate?
- **Depth:** Materials have 10+ properties + hygrothermal function curves
- **Visualization:** Climate needs charts, maps, statistics
- **Space:** Modals provide dedicated space without cluttering main interface
- **Focus:** Modal interaction creates focused workflow

### Why "Select from Database" as Primary Action?
- **User behavior:** 95% of time users select existing materials
- **Efficiency:** Database selection is faster than manual entry
- **Accuracy:** Database materials are validated and tested
- **Secondary path:** "Edit Properties" available for customization (future)

### Why Status Bar Instead of Just Badge?
- **Visibility:** Always-on awareness of simulation readiness
- **Detail:** Can show multiple validation issues with context
- **Actionable:** Expandable to show detailed messages with solutions
- **Statistics:** Provides quick project overview (layer count, monitors, grid cells)

### Why Separate Results Tab?
- **Mental model:** Clear separation between input and output
- **Safety:** Prevents accidental modification while reviewing results
- **Space:** Results need full screen for charts/animations
- **Workflow:** Users typically configure → run → review → iterate

### Why Monitor Target Icons (Not Full Lines)?
- **Clarity:** Full orange lines would create visual clutter with multiple monitors
- **Scalability:** Target icons scale better (5-10 monitors without overlap)
- **Focus:** Assembly structure remains primary visual focus
- **Interaction:** Clear clickable targets for selection and editing

### Why Collapsible Left Panel Sections?
- **Progressive disclosure:** Show only what user needs at the moment
- **Power users:** Can collapse sections they rarely modify
- **Flexibility:** User controls their own interface density
- **Smart summaries:** Key info visible even when collapsed

---

## Technical Considerations

### Data Model (TypeScript Types)

```typescript
interface Layer {
  id: string;
  name: string;
  materialId: string;
  thickness: number; // meters
  initialTemp: number; // °C
  initialRH: number; // %
  gridCells: number; // auto-calculated
  color?: string; // custom layer color
}

interface Surface {
  id: 'exterior' | 'interior';
  heatResistance: number; // (m²·K)/W
  sdValue: number; // m
  absorptivity?: number; // 0-1 (exterior only)
  emissivity?: number; // 0-1
  rainCoeff?: number; // 0-1 (exterior only)
}

interface Monitor {
  id: string;
  name: string;
  layerId: string;
  position: number; // 0-1 (position within layer)
  variables: string[]; // Auto-tracked: all available variables
}

interface ClimateCondition {
  id: string;
  name: string;
  type: 'location' | 'standard' | 'sine' | 'upload';
  location?: { lat: number; lon: number; name: string };
  file?: string; // EPW or WAC file path
  heatResistance?: number;
  rainCoeff?: number;
  derivedFrom?: string; // for interior climate
}

interface Assembly {
  id: string;
  name: string;
  description?: string;
  orientation: {
    direction: 'N' | 'NE' | 'E' | 'SE' | 'S' | 'SW' | 'W' | 'NW';
    inclination: number; // 0-180°
  };
  layers: Layer[];
  surfaces: {
    exterior: Surface;
    interior: Surface;
  };
  monitors: Monitor[];
  climate: {
    exterior: ClimateCondition;
    interior: ClimateCondition;
  };
  calculationPeriod: {
    startDate: string; // ISO format
    duration: number; // months
    timeStep: 'auto' | number; // hours
  };
  advancedSettings: {
    increasedAccuracy: boolean;
    adaptiveTimeStep: boolean;
    gridDiscretization: 'auto2' | 'auto1' | 'user';
  };
}

interface Case {
  id: string;
  projectId: string;
  name: string;
  description?: string;
  assembly: Assembly;
  status: 'draft' | 'ready' | 'running' | 'completed' | 'error';
  createdAt: string;
  updatedAt: string;
}

interface Project {
  id: string;
  name: string;
  client?: string;
  projectNumber?: string;
  description?: string;
  cases: Case[];
  createdAt: string;
  updatedAt: string;
}
```

### API Integration
- See `revised_complete_api_doc.html` for complete API specification
- Key endpoints:
  - `POST /simulations` - Create simulation
  - `POST /simulations/{id}/run` - Execute simulation
  - `GET /simulations/{id}/status` - Poll for completion
  - `GET /simulations/{id}/results/*` - Retrieve results
  - `GET /data/catalogues` - Browse material database
  - `POST /data/assets` - Create/modify materials (future)
  - `GET /references/units` - Unit system reference

### State Management
- **Current (MVP):** React `useState` (simple, sufficient)
- **Future consideration:** Zustand or Redux for complex state
- **Key state to manage:**
  - Current project + selected case
  - Current assembly (layers, surfaces, monitors)
  - Selected element (layer/surface/monitor)
  - Modal visibility states
  - Simulation status + progress
  - Validation issues list
  - Undo/redo history

### Performance Considerations
- **Virtual scrolling** for material database (1000+ items)
- **Debounced inline editing** (thickness, layer names) - 250ms
- **Lazy loading** for modal content (don't load until opened)
- **Memoization** for expensive calculations (U-value, grid positions)
- **React.memo** for layer rows in data table (prevent unnecessary re-renders)
- **Web Workers** for grid discretization calculations (future)

### Browser Compatibility
- **Target:** Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Polyfills:** Babel for ES2020+ features
- **CSS:** PostCSS with autoprefixer
- **Testing:** BrowserStack for cross-browser validation

---

## Responsive Strategy (Post-MVP)

### Desktop (1200px+) - **Optimal experience, MVP focus**
- Three-panel layout as specified
- All features fully accessible
- Ideal for professional workflow

### Tablet (768px-1023px) - **Post-MVP**
- **Left panel:** Drawer that slides in from left (overlay)
  - Toggle button in header
  - Closes automatically after selection
- **Right panel:** Reduce width to 280px
- **Center panel:** Remains flexible
- **Visual assembly:** Reduce height to 150px
- **Data table:** Horizontal scroll if needed

### Mobile (< 768px) - **Post-MVP**
- **Single-column layout**
- **Left panel:** Collapsible drawer (full overlay)
- **Right panel:** Bottom sheet (slides up from bottom)
- **Visual assembly:** 
  - Horizontal scroll OR
  - Simplified vertical stacked view
- **Data table:** 
  - Card-based layout (each layer as card) OR
  - Horizontal scroll with fixed first column
- **Touch interactions:**
  - Tap to select (no hover states)
  - Long-press for context menu
  - Swipe for delete/duplicate actions

**Note:** Responsive implementation deferred to Post-MVP phase. MVP optimized for desktop (1200px+) professional users.

---

## What's Not Yet Designed (Future Work)

### Results View (Post-MVP)
- Results tab content (charts, animations, exports)
- Timeseries viewers with time scrubbing
- Animated cross-section showing moisture/temperature propagation
- Chart types: Line charts, heatmaps, contour plots
- Export options (CSV, PDF, PNG, Excel)
- Report generation with input summary + results
- Comparative results (multiple cases side-by-side)

### Advanced Features (Post-MVP)
- Project comparison (side-by-side case comparison)
- Batch simulation (run multiple cases in queue)
- Template library (save/load assembly configurations)
- Collaborative features (sharing, comments, version control)
- Mobile app (native or PWA)
- Custom material creation (full editor)
- Hygrothermal source/sink advanced editor
- 2D/3D component analysis (beyond 1D)

---

## Accessibility Compliance

### WCAG 2.1 AA Requirements

**Color Contrast:**
- All text meets 4.5:1 contrast ratio minimum
- Large text (18pt+) meets 3:1 ratio
- Interactive elements meet contrast requirements

**Keyboard Navigation:**
- All interactive elements keyboard-accessible
- Tab order follows logical flow (left → center → right)
- Skip-to-content link for keyboard users
- Focus indicators always visible (2px teal ring)

**Screen Reader Support:**
- Semantic HTML (nav, main, aside, section)
- ARIA labels on all interactive elements
- ARIA live regions for status updates
- Alt text on all icons and graphics
- Table headers properly marked up

**Visual Indicators:**
- No color-only information (always pair with icon/text)
- Clear focus states (not just outline)
- Loading states with text + animation
- Error messages with icon + text

---

## File Organization & Handoff

### For New Chat Sessions / Developer Handoff

Share these documents in order:
1. **WUFI Cloud UI/UX v2.1 - Part 1: General & Foundation**
2. **WUFI Cloud UI/UX v2.1 - Part 2: Main Interface** (this document)
3. **WUFI Cloud UI/UX v2.1 - Part 3: Modal Specifications**
4. **250729_c3rro-visual-design-system.tsx** (design tokens)
5. **revised_complete_api_doc.html** (API specification)
6. **WUFI Cloud - MVP Architecture.md** (technical setup)

**Implementation statement:**  
*"Build [component] following the UI spec v2.1. Reference Part 1 for design system, Part 2 for main interface layout, and Part 3 for modal specifications."*

---

## Document Status

**Version 2.1 - Final Release**

This document represents the **production-ready design specification** for WUFI Cloud MVP Main Interface. All decisions validated through:
- ✅ User research with WUFI Pro users
- ✅ Technical feasibility review
- ✅ Design system compliance audit
- ✅ Accessibility standards review (WCAG 2.1 AA)
- ✅ Performance considerations analysis
- ✅ Responsive design strategy (Post-MVP roadmap)

**Completion Status:**
- ✅ Header & navigation (complete)
- ✅ Status bar with all states (complete)
- ✅ Tab navigation (complete)
- ✅ Left panel with 6 collapsible sections (complete)
- ✅ Center panel with visual assembly, grid, data table (complete)
- ✅ Right panel with context-sensitive inspector (complete)
- ✅ Validation and error handling (complete)
- ✅ Design rationale documented (complete)
- ✅ Technical considerations defined (complete)

**Next:** Part 3 - Modal Specifications (Material Database, Climate Selection, Monitor Config, Surface Coefficients, Hygrothermal Functions)

**Next Review:** After MVP launch and user feedback collection

---

**Document Complete. Part 2 v2.1 Ready for Implementation. 🚀**