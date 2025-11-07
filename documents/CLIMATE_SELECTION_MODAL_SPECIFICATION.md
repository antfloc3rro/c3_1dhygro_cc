# Climate Selection Modal Specification

**Document Version:** 1.0  
**Status:** Production-Ready Design Specification  
**Date:** November 7, 2025  
**Reference:** WUFI Cloud UI/UX v2.1 + C3RRO Visual Design System

---

## Executive Summary

The **Climate Selection Modal** enables users to define exterior and interior climate conditions for hygrothermal simulations. It supports four climate input methods (weather stations via interactive map, three building standards, synthetic sine curves, and user-provided files), with dynamic visualizations and parameter inputs tailored to each method.

---

## Modal Specifications

### Size & Positioning

| Property | Value |
|----------|-------|
| **Width** | 1100px |
| **Height** | 85vh (auto-height, capped at viewport) |
| **Position** | Centered on screen |
| **Background overlay** | Black at 40% opacity |
| **Animation** | Fade-in 300ms (ease-out), scale 0.95→1.0 |

### Layout Architecture

```
┌─────────────────────────────────────────────────────┐
│ Header (h=60px, sticky)                             │
│ "Exterior Climate" or "Interior Climate"     [X]    │
├─────────────────────────────────────────────────────┤
│ Left Column (300px) │ Middle (flexible) │ Right     │
│ Climate Type        │ Visualization     │ (320px)   │
│ Selection           │ (Map/Charts)      │ Inputs/   │
│ + Exterior/         │                   │ Stats     │
│   Interior Tabs     │                   │           │
│                     │                   │           │
│ (scrollable)        │ (scrollable)      │(scroll)   │
├─────────────────────────────────────────────────────┤
│ Footer (h=56px, sticky)                             │
│ [Info Text]              [Cancel] [Apply Climate]   │
└─────────────────────────────────────────────────────┘
```

---

## Header Section (Sticky, h=60px)

### Layout
- **Container:** Full width, white background, 1px bottom border (greylight), shadow-sm
- **Padding:** 16px horizontal, 12px vertical
- **Display:** flex, justify-content: space-between, align-items: center

### Left Section - Title
- **Title:** Jost, 1.25rem (20px), 600 weight, text color (#33302F)
- **Text:** "Exterior Climate" or "Interior Climate" (determined by which section user is in)
- **Subtitle (optional):** Lato, 0.875rem, greydark, shown below title
  - "Select outdoor weather conditions" (for exterior)
  - "Define interior climate conditions" (for interior)

### Right Section - Close Button
- **Button:** X icon, 24px, greydark color, no background
- **Hover:** Slightly darker background (greylight at 20%)
- **Click:** Closes modal (no unsaved changes warning - selections apply immediately)
- **Keyboard:** ESC also closes

---

## Left Panel (300px) - Climate Type & Mode Selection

### Overall Structure
- **Width:** 300px
- **Padding:** 16px
- **Background:** White
- **Border-right:** 1px solid greylight
- **Overflow-y:** auto (scrollable)
- **Display:** Two main sections (Exterior / Interior)

### Section 1: Exterior Climate (Collapsible, default EXPANDED)

#### Header
- **Title:** "Exterior Climate" (Jost, 1rem, 600 weight, text color)
- **Icon:** Globe (18px, bluegreen)
- **Background:** greylight at 10%
- **Padding:** 12px
- **Margin-bottom:** 16px
- **Border-radius:** 4px
- **Cursor:** pointer (click to expand/collapse)
- **Chevron icon:** Right-pointing when collapsed, Down when expanded (animated 200ms)

#### Content (When Expanded)

**Climate Type Selection - Radio Button Group**

Each climate type option follows this pattern:

**Option Layout:**
- **Container:** 
  - Padding: 12px
  - Border-bottom: 1px solid greylight (except last)
  - Cursor: pointer
  - Hover: Background becomes greylight at 5%

**Option Components:**
1. **Radio button:** 18px circle, bluegreen when selected
2. **Icon:** 20px, left of label (slightly below radio to align)
3. **Label:** Lato, 0.875rem, bold when selected, text color
4. **Description:** Lato, 0.75rem, greydark, 1-2 lines

#### Climate Type 1: Weather Station
- **Label:** "Weather Station"
- **Icon:** MapPin (blue)
- **Description:** "Select from global climate database"
- **Selected indicator:** Radio filled + teal background on container
- **On select:**
  - Middle panel: Shows interactive map + location search
  - Right panel: Shows data info + location statistics

#### Climate Type 2: Standard Conditions
- **Label:** "Standard Conditions"
- **Icon:** Settings (gear, teal)
- **Description:** "EN 15026, ISO 13788, ASHRAE 160"
- **On select:**
  - Middle panel: Shows standard selector dropdown + parameter form
  - Right panel: Shows summary statistics

#### Climate Type 3: Sine Curves
- **Label:** "Sine Curves"
- **Icon:** Activity/Waves (orange)
- **Description:** "Custom synthetic patterns"
- **On select:**
  - Middle panel: Shows parameter form with live curve preview
  - Right panel: Shows current curve parameters

#### Climate Type 4: Upload File
- **Label:** "Upload File"
- **Icon:** Upload (arrow up, green)
- **Description:** "EPW or WAC climate file"
- **On select:**
  - Middle panel: Shows file upload area + file info
  - Right panel: Shows file statistics

**Selection Behavior:**
- Clicking any option immediately:
  1. Selects that climate type (radio fills, background highlights)
  2. Updates middle panel with visualization/form
  3. Updates right panel with inputs/statistics
- Default on modal open: None selected (blank state with message "Select climate type")

---

### Section 2: Interior Climate (Collapsible, default EXPANDED)

#### Header
- **Title:** "Interior Climate" (Jost, 1rem, 600 weight, text color)
- **Icon:** Building (18px, orange)
- **Background:** greylight at 10%
- **Padding:** 12px
- **Margin-bottom:** 0 (no margin between sections)
- **Border-radius:** 4px
- **Cursor:** pointer (click to expand/collapse)
- **Chevron icon:** Right-pointing when collapsed, Down when expanded (animated 200ms)
- **Margin-top:** 24px (gap from exterior section)

#### Content (When Expanded)

**Identical climate type options as Exterior:**
- Weather Station
- Standard Conditions
- Sine Curves
- Upload File

**Independent selection:**
- Interior selection completely independent from Exterior
- User can have Weather Station outside + ASHRAE 160 inside
- Or any other combination

**Data persistence:**
- Interior and Exterior selections persist independently
- Switching between sections doesn't affect the other
- Both selections apply when user clicks "Apply Climate"

**Special Interior Features:**
- Some standards (EN 15026, ISO 13788) show interior-specific parameters
- Interior standards may have simpler parameter sets than exterior equivalents
- Interior sine curves can be independent or derived from exterior (but MVP treats as independent)

---

## Middle Panel (Flexible Width) - Visualization & Input

### Overall Structure
- **Flexible width:** Fills available space between left and right panels
- **Padding:** 24px
- **Background:** White
- **Overflow-y:** auto (scrollable)
- **Border-left:** 1px solid greylight
- **Border-right:** 1px solid greylight

---

### Weather Station View

#### Section 1: Location Search & Selection

**Search Input:**
- **Label:** "Search Location" (Lato, 0.75rem, greydark, uppercase, bold)
- **Input field:** 
  - Placeholder: "Search by city, region, or coordinates"
  - Full width
  - Padding: 8px 12px
  - Border: 1px solid greylight
  - Border-radius: 4px
  - Font: Lato, 0.875rem
  - Focus: 2px bluegreen border
- **Icon:** Search (18px, greydark, right side of input)
- **Margin-bottom:** 16px

**Autocomplete Dropdown (appears below input as user types):**
- **Position:** Below input field
- **Background:** White
- **Border:** 1px solid greylight
- **Max-height:** 200px (scrollable)
- **Each item:**
  - Padding: 8px 12px
  - Font: Lato, 0.875rem
  - Format: "City, Region, Country"
  - Hover: Background becomes bluegreen at 10%
  - Click: Selects location, closes dropdown, updates map

#### Section 2: Interactive Map

**Container:**
- **Height:** 300px
- **Width:** 100% (fills middle panel width)
- **Border:** 1px solid greylight
- **Border-radius:** 4px
- **Background:** Light blue (map background)
- **Margin-bottom:** 16px

**Map Features:**
- **Library:** Leaflet + OpenStreetMap basemap
- **Initial state:** Global view (zoomed to world, centered at equator/prime meridian)
- **Markers:** Climate station locations shown as blue dots
- **Clustered markers:** At zoomed-out levels, markers cluster into groups
- **Zoom controls:** +/- buttons in top-left of map
- **Pan:** Click + drag to move map
- **Scroll to zoom:** Mouse wheel zooms (if enabled)

**Marker Interaction:**
- **Default marker:** Blue circle (12px)
- **Selected marker:** Teal circle (16px, slightly larger)
- **Click marker:** 
  1. Marker becomes teal (selected)
  2. Map centers on marker
  3. Right panel updates with location info + statistics
  4. Location appears in "Recent Selections" below map

**Marker Tooltip:**
- **On hover:** Small popup showing location name
- **Font:** Lato, 0.75rem
- **Background:** Black at 80% opacity
- **Text:** White
- **Padding:** 4px 8px

#### Section 3: Location Selection - Recent & Popular

**Recent Selections (if available):**
- **Title:** "Recent" (Lato, 0.75rem, greydark, uppercase, bold)
- **List:** 3-5 most recently selected locations
- **Each item:**
  - Padding: 8px 12px
  - Font: Lato, 0.875rem, text color
  - Text: Location name + region
  - Hover: Background becomes bluegreen at 10%
  - Click: Selects location, updates map + right panel
  - Border-bottom: 1px solid greylight (except last)

**Popular Locations (pre-defined):**
- **Title:** "Popular Locations" (Lato, 0.75rem, greydark, uppercase, bold)
- **List:** Major cities (New York, London, Tokyo, Sydney, etc.)
- **Same styling as Recent**

---

### Standard Conditions View

#### Standard Selector

**Dropdown Container:**
- **Label:** "Standard" (Lato, 0.75rem, greydark, uppercase, bold)
- **Margin-bottom:** 8px

**Dropdown:**
- **Width:** 100%
- **Padding:** 8px 12px
- **Font:** Lato, 0.875rem
- **Border:** 1px solid greylight
- **Border-radius:** 4px
- **Background:** White
- **Focus:** 2px bluegreen border

**Options (for both exterior and interior):**
1. EN 15026 / DIN 4108 / WTA 6-2
2. ISO 13788
3. ASHRAE 160

**On standard selection:** Form below updates to show standard-specific parameters

#### Standard-Specific Parameter Forms

**EN 15026 / DIN 4108 / WTA 6-2 Parameters**

**Moisture Load Class:**
- **Label:** "Moisture Load Class" (Lato, 0.75rem, greydark, uppercase, bold)
- **Margin-bottom:** 8px

**Dropdown:**
- **Width:** 100%
- **Options:** (from WUFI Pro screenshots)
  - Low Moisture Load
  - Medium Moisture Load
  - High Moisture Load
- **Default:** Medium
- **Styling:** Same as standard dropdown above

**Live Preview:**
- Immediately shows timeseries curve in right panel

---

**ISO 13788 Parameters**

**Temperature:**
- **Label:** "Mean Temperature [°C]" (Lato, 0.75rem, greydark, uppercase, bold)
- **Input:** Number field, full width
- **Padding:** 8px 12px
- **Border:** 1px solid greylight
- **Border-radius:** 4px
- **Font:** Lato, 0.875rem, monospace for value
- **Placeholder:** "21"
- **Range:** 5-30 (reasonable interior range)
- **Margin-bottom:** 16px

**Humidity Class:**
- **Label:** "Humidity Class" (Lato, 0.75rem, greydark, uppercase, bold)
- **Margin-bottom:** 8px

**Dropdown:**
- **Width:** 100%
- **Options:** (from ISO 13788)
  - Class 1
  - Class 2
  - Class 3
  - Class 4
- **Default:** Class 2
- **Styling:** Same as other dropdowns

**Live Preview:**
- Immediately shows timeseries curve in right panel

---

**ASHRAE 160 Parameters** (Complex Multi-Section Form)

**Layout:** Scrollable form with grouped sections

**Section 1: Air-Conditioning System**

**Title:** "Air-Conditioning System" (Lato, 0.875rem, 600 weight, text color)
- **Background:** greylight at 10%
- **Padding:** 12px
- **Border-radius:** 4px
- **Margin-bottom:** 16px

**AC Type:**
- **Label:** "AC Type" (Lato, 0.75rem, greydark, uppercase, bold)
- **Margin-bottom:** 8px
- **Dropdown:** Full width
- **Options:**
  - AC with Dehumidification
  - Basic AC
- **Default:** AC with Dehumidification
- **Margin-bottom:** 12px

**Floating Indoor Temperature Shift:**
- **Label:** "Floating Indoor Temp Shift [°C]" (Lato, 0.75rem, greydark, uppercase, bold)
- **Input:** Number field, full width
- **Step:** 0.1
- **Placeholder:** "2.8"
- **Margin-bottom:** 12px

**Set Point for Heating:**
- **Label:** "Set Point for Heating [°C]" (Lato, 0.75rem, greydark, uppercase, bold)
- **Input:** Number field, full width
- **Placeholder:** "21.1"
- **Margin-bottom:** 12px

**Set Point for Cooling:**
- **Label:** "Set Point for Cooling [°C]" (Lato, 0.75rem, greydark, uppercase, bold)
- **Input:** Number field, full width
- **Placeholder:** "23.9"
- **Margin-bottom:** 12px

**R.H. Control Setpoint:**
- **Label:** "R.H. Control Setpoint [%]" (Lato, 0.75rem, greydark, uppercase, bold)
- **Input:** Number field, full width
- **Range:** 0-100
- **Placeholder:** "50"
- **Margin-bottom:** 0

---

**Section 2: Moisture Generation** (collapsed/expandable in complex forms, or shown if space)

**Title:** "Moisture Generation" (Lato, 0.875rem, 600 weight, text color)
- **Background:** greylight at 10%
- **Padding:** 12px
- **Border-radius:** 4px
- **Margin-top:** 16px
- **Margin-bottom:** 16px

**Number of Bedrooms:**
- **Label:** "Number of Bedrooms" (Lato, 0.75rem, greydark, uppercase, bold)
- **Input:** Number spinner (up/down arrows), full width
- **Min:** 1, Max: 10
- **Placeholder:** "2"
- **Margin-bottom:** 12px

**Jetted Tub without Exhaust Fan:**
- **Label:** "Jetted Tub without Exhaust Fan" (Lato, 0.75rem, greydark, uppercase, bold)
- **Input:** Checkbox
- **Default:** Unchecked
- **Margin-bottom:** 12px

**User-Defined Moisture Generation Rate:**
- **Label:** "Use Custom Moisture Rate" (Lato, 0.75rem, greydark, uppercase, bold)
- **Input:** Checkbox
- **Default:** Unchecked
- **Margin-bottom:** 12px

**Moisture Generation Rate [kg/s]:** (Appears only if "User-Defined" checkbox is checked)
- **Label:** "Moisture Generation Rate [kg/s]" (Lato, 0.75rem, greydark, uppercase, bold, slightly indented)
- **Input:** Number field, full width
- **Placeholder:** "0.000105"
- **Font:** Lato, 0.875rem, monospace
- **Margin-bottom:** 0

---

**Section 3: Air Exchange** (with Building Volume prominent)

**Title:** "Air Exchange" (Lato, 0.875rem, 600 weight, text color)
- **Background:** greylight at 10%
- **Padding:** 12px
- **Border-radius:** 4px
- **Margin-top:** 16px
- **Margin-bottom:** 16px

**Building Volume [m³]** (PROMINENT)
- **Label:** "Building Volume [m³]" (Lato, 0.875rem, **BOLD**, text color, uppercase)
- **Background highlight:** bluegreen at 5% opacity
- **Padding:** 12px
- **Border-radius:** 4px
- **Border:** 1px solid bluegreen
- **Input field:**
  - Full width
  - Large font: Lato, 1rem (larger than other inputs)
  - Placeholder:** "500"
  - Padding: 12px
  - Border: 2px solid bluegreen when focused
- **Icon (optional):** Info icon on right, shows tooltip "Most frequently modified"
- **Margin-bottom:** 16px
- **Note:** This is the field users most often change, deserves visual prominence

**Construction Airtightness:**
- **Label:** "Construction Airtightness" (Lato, 0.75rem, greydark, uppercase, bold)
- **Margin-bottom:** 8px
- **Dropdown:** Full width
- **Options:**
  - Standard construction
  - Tight construction
  - Very tight construction
- **Default:** Standard construction
- **Margin-bottom:** 12px

**Air Exchange Rate [1/h]:**
- **Label:** "Air Exchange Rate [1/h]" (Lato, 0.75rem, greydark, uppercase, bold)
- **Input:** Number field, full width
- **Step:** 0.1
- **Placeholder:** "0.2"
- **Margin-bottom:** 0

**Live Preview:**
- As user changes ASHRAE parameters, timeseries curve updates in real-time in right panel

---

### Sine Curves View

#### Form Layout

**Section: Temperature**

**Title:** "Temperature" (Lato, 0.875rem, 600 weight, text color)
- **Background:** greylight at 10%
- **Padding:** 12px
- **Border-radius:** 4px
- **Margin-bottom:** 16px

**Mean Value:**
- **Label:** "Mean Value [°C]" (Lato, 0.75rem, greydark, uppercase, bold)
- **Input:** Number field, full width
- **Step:** 0.1
- **Placeholder:** "20"
- **Margin-bottom:** 12px

**Amplitude:**
- **Label:** "Amplitude [K]" (Lato, 0.75rem, greydark, uppercase, bold)
- **Input:** Number field, full width
- **Step:** 0.1
- **Placeholder:** "10"
- **Range:** 0-25 (reasonable amplitude range)
- **Margin-bottom:** 12px

**Day of Maximum:**
- **Label:** "Day of Maximum" (Lato, 0.75rem, greydark, uppercase, bold)
- **Input:** Date picker (shows as "MMM/DD" e.g., "Jun/03")
- **Full width**
- **Default:** Summer solstice (~Jun/21 for Northern hemisphere)
- **Margin-bottom:** 0

---

**Section: Relative Humidity**

**Title:** "Relative Humidity" (Lato, 0.875rem, 600 weight, text color)
- **Background:** greylight at 10%
- **Padding:** 12px
- **Border-radius:** 4px
- **Margin-top:** 16px
- **Margin-bottom:** 16px

**Mean Value:**
- **Label:** "Mean Value [%]" (Lato, 0.75rem, greydark, uppercase, bold)
- **Input:** Number field, full width
- **Step:** 1
- **Placeholder:** "50"
- **Range:** 0-100
- **Margin-bottom:** 12px

**Amplitude:**
- **Label:** "Amplitude [%]" (Lato, 0.75rem, greydark, uppercase, bold)
- **Input:** Number field, full width
- **Step:** 1
- **Placeholder:** "10"
- **Range:** 0-50
- **Margin-bottom:** 12px

**Day of Maximum:**
- **Label:** "Day of Maximum" (Lato, 0.75rem, greydark, uppercase, bold)
- **Input:** Date picker (shows as "MMM/DD" e.g., "Aug/16")
- **Full width**
- **Default:** Late summer (~Aug/15)
- **Margin-bottom:** 0

**Live Preview:**
- Immediately shows generated sine curves in right panel as user edits values

---

### Upload File View

#### File Upload Area

**Container:**
- **Height:** 120px
- **Width:** 100%
- **Border:** 2px dashed bluegreen
- **Border-radius:** 8px
- **Background:** bluegreen at 5% opacity
- **Display:** flex, flex-direction: column, justify-content: center, align-items: center
- **Cursor:** pointer
- **Margin-bottom:** 16px

**Content Inside:**
- **Icon:** Upload arrow (32px, bluegreen)
- **Primary text:** "Drag file here or click to browse" (Lato, 0.875rem, text color, bold)
- **Secondary text:** "Supported formats: EPW, WAC" (Lato, 0.75rem, greydark)

**Hover state:**
- **Background:** bluegreen at 10% opacity
- **Border:** 2px solid bluegreen (instead of dashed)

**On file drop/select:**
- File accepted if .epw or .wac
- Error if wrong format: "Invalid file format. Please upload EPW or WAC file."
- Uploads file (client-side validation)
- Right panel updates with file info

#### File Information Display (After Upload)

**File Name:**
- **Font:** Lato, 0.875rem, bold, text color
- **Margin-bottom:** 12px

**File Size:**
- **Font:** Lato, 0.75rem, greydark
- **Format:** "1.2 MB"
- **Margin-bottom:** 4px

**Format:**
- **Font:** Lato, 0.75rem, greydark
- **Format:** "EPW" or "WAC"
- **Margin-bottom:** 12px

**[Change File] Button:**
- **Style:** Secondary, 36px height
- **Width:** Full width
- **On click:** Resets upload area, allows different file

---

## Right Panel (320px) - Parameters/Statistics

### Overall Structure
- **Width:** 320px
- **Padding:** 16px
- **Background:** White
- **Overflow-y:** auto (scrollable)
- **Border-left:** 1px solid greylight
- **Display:** Changes based on selected climate type

### Weather Station - Right Panel

#### Location Information Card

**Container:**
- **Background:** greylight at 10%
- **Border:** 1px solid greylight
- **Border-radius:** 8px
- **Padding:** 12px
- **Margin-bottom:** 16px

**Location Name:**
- **Font:** Lato, 1rem, bold, text color
- **Margin-bottom:** 4px

**Region / Country:**
- **Font:** Lato, 0.875rem, greydark
- **Margin-bottom:** 12px

**Geographic Information:**
- **Latitude:** 
  - Label: "Lat [°]" (Lato, 0.75rem, greydark, bold)
  - Value: (Lato, 0.875rem, monospace, text color)
  - Example: "35.08 North"
- **Longitude:**
  - Label: "Long [°]" (Lato, 0.75rem, greydark, bold)
  - Value: (Lato, 0.875rem, monospace)
  - Example: "90.02 West"
- **Altitude:**
  - Label: "Alt [m]" (Lato, 0.75rem, greydark, bold)
  - Value: (Lato, 0.875rem, monospace)
  - Example: "77"
- **Time Zone:**
  - Label: "UTC Offset" (Lato, 0.75rem, greydark, bold)
  - Value: (Lato, 0.875rem)
  - Example: "-6.0"

**Spacing:**
- Each property: 8px vertical gap
- No borders between properties

---

#### Annual Statistics

**Title:** "Annual Statistics" (Lato, 0.75rem, greydark, uppercase, bold)
- **Margin-top:** 16px
- **Margin-bottom:** 12px
- **Padding-top:** 12px
- **Border-top:** 1px solid greylight

**Statistics Grid** (2 columns)

**Temperature Statistics:**
- **Mean Temp [°C]:** 14.2
- **Max Temp [°C]:** 36.7
- **Min Temp [°C]:** -23.9

**Humidity Statistics:**
- **Mean RH [%]:** 68.9
- **Max RH [%]:** 100
- **Min RH [%]:** 16

**Radiation & Rain:**
- **Annual Radiation [kWh/m²]:** 2887.9
- **Annual Rain [mm]:** 987.7

**Other:**
- **Mean Wind Speed [m/s]:** 3.7
- **Cloud Index [-]:** 0.47

**Each statistic:**
- **Label:** Lato, 0.75rem, greydark
- **Value:** Lato, 0.875rem, bold, monospace, text color
- **Unit:** Lato, 0.75rem, greydark
- **Padding:** 8px per row
- **Border-bottom:** 1px solid greylight (except last)

---

#### Surface Parameters (Exterior Only)

**Title:** "Surface Parameters" (Lato, 0.75rem, greydark, uppercase, bold)
- **Margin-top:** 16px
- **Margin-bottom:** 12px

**Heat Transfer Resistance:**
- **Label:** "Heat Transfer Resistance [(m²·K)/W]" (Lato, 0.75rem, greydark, bold)
- **Input:** Number field
- **Default:** 0.0588 (exterior standard)
- **Step:** 0.001
- **Margin-bottom:** 12px

**Rain Coefficient:**
- **Label:** "Rain Coefficient [-]" (Lato, 0.75rem, greydark, bold)
- **Input:** Number field or slider
- **Default:** 0.7
- **Range:** 0-1
- **Margin-bottom:** 0

---

### Standard Conditions - Right Panel

#### Selected Standard Summary

**Title:** Standard name (e.g., "EN 15026") (Lato, 1rem, bold, text color)
- **Margin-bottom:** 8px

**Description:** (Lato, 0.875rem, greydark, 2-3 lines)
- Short explanation of what standard defines
- Reference number

**Margin-bottom:** 12px

---

#### Parameters Summary

**Title:** "Selected Parameters" (Lato, 0.75rem, greydark, uppercase, bold)
- **Margin-bottom:** 12px

**For each parameter:**
- **Label:** Lato, 0.875rem, bold, text color
- **Value:** Lato, 0.875rem, monospace, text color
- **Padding:** 8px
- **Border-bottom:** 1px solid greylight (except last)

**Example (EN 15026):**
- "Moisture Load: Medium"

**Example (ISO 13788):**
- "Mean Temperature: 21°C"
- "Humidity Class: Class 3"

**Example (ASHRAE 160):**
- "AC Type: With Dehumidification"
- "Heating Setpoint: 21.1°C"
- "Cooling Setpoint: 23.9°C"
- "R.H. Setpoint: 50%"
- "Building Volume: 500 m³"
- ... (other key parameters)

---

#### Typical Conditions

**Title:** "Typical Conditions" (Lato, 0.75rem, greydark, uppercase, bold)
- **Margin-top:** 16px
- **Margin-bottom:** 12px

**Temperature Range:**
- **Label:** "Temp Range" (Lato, 0.75rem, greydark, bold)
- **Value:** "{min} to {max} °C" (Lato, 0.875rem, monospace)
- **Margin-bottom:** 8px

**Humidity Range:**
- **Label:** "RH Range" (Lato, 0.75rem, greydark, bold)
- **Value:** "{min} to {max} %" (Lato, 0.875rem, monospace)
- **Margin-bottom:** 8px

**Condensation Risk:**
- **Label:** "Condensation Risk" (Lato, 0.75rem, greydark, bold)
- **Value:** "Low" / "Medium" / "High"
- **Color coding (optional):**
  - Low: green (#3E7263)
  - Medium: orange (#E18E2A)
  - High: red (#C04343)

---

### Sine Curves - Right Panel

#### Live Curve Preview

**Temperature Curve:**
- **Title:** "Temperature" (Lato, 0.875rem, bold, text color)
- **Graph option:** "Graph" tab (bold, teal underline when active)
- **Table option:** "Table" tab (greydark, teal underline when clicked)
- **Default:** Graph shown

**Graph:**
- **Size:** Full width × 120px height
- **Chart type:** Line chart (Recharts)
- **X-axis:** Day of year (1-365, shown as months)
- **Y-axis:** Temperature [°C]
- **Line:** Red color, 2px stroke
- **Grid:** Subtle gray gridlines
- **Smooth curve:** Sine wave shape
- **No interaction:** Display only

**Table (if clicked):**
- Shows 5 key points: min, 25%, 50%, 75%, max
- Each with day of year and temperature value
- Monospace font for values

---

**Relative Humidity Curve:**
- **Title:** "Relative Humidity" (Lato, 0.875rem, bold, text color)
- **Graph option:** "Graph" tab
- **Table option:** "Table" tab
- **Default:** Graph shown

**Graph:**
- **Size:** Full width × 120px height
- **X-axis:** Day of year
- **Y-axis:** Relative Humidity [%]
- **Line:** Green color, 2px stroke
- **Same styling as temperature curve**

**Margin-top:** 16px

---

#### Current Parameters Display

**Title:** "Current Parameters" (Lato, 0.75rem, greydark, uppercase, bold)
- **Margin-top:** 16px
- **Margin-bottom:** 12px
- **Padding-top:** 12px
- **Border-top:** 1px solid greylight

**Temperature:**
- **Mean:** {value} °C (Lato, 0.875rem, monospace)
- **Amplitude:** {value} K
- **Range:** {min} to {max} °C
- **Peak day:** {month}/{day}

**Relative Humidity:**
- **Mean:** {value} % 
- **Amplitude:** {value} %
- **Range:** {min} to {max} %
- **Peak day:** {month}/{day}

**Each parameter:**
- **Label:** Lato, 0.75rem, greydark, bold
- **Value:** Lato, 0.875rem, monospace, text color
- **Padding:** 8px per row

---

### Upload File - Right Panel

#### File Information

**File Name:**
- **Label:** "File" (Lato, 0.75rem, greydark, uppercase, bold)
- **Value:** (Lato, 0.875rem, text color)
- **Margin-bottom:** 8px

**File Size:**
- **Label:** "Size" (Lato, 0.75rem, greydark, uppercase, bold)
- **Value:** (Lato, 0.875rem, monospace)
- **Example:** "1.2 MB"
- **Margin-bottom:** 8px

**Format:**
- **Label:** "Format" (Lato, 0.75rem, greydark, uppercase, bold)
- **Value:** "EPW" or "WAC" (Lato, 0.875rem)
- **Margin-bottom:** 8px

**Upload Date:**
- **Label:** "Uploaded" (Lato, 0.75rem, greydark, uppercase, bold)
- **Value:** (Lato, 0.875rem)
- **Format:** "2025-11-07" or relative ("just now")
- **Margin-bottom:** 12px

---

#### Data Summary

**Title:** "Data Summary" (Lato, 0.75rem, greydark, uppercase, bold)
- **Margin-bottom:** 12px
- **Padding-top:** 12px
- **Border-top:** 1px solid greylight

**Location:**
- **Label:** "Location" (Lato, 0.75rem, greydark, bold)
- **Value:** (Lato, 0.875rem)
- **Example:** "Nashville, TN"
- **Margin-bottom:** 8px

**Time Period:**
- **Label:** "Period" (Lato, 0.75rem, greydark, bold)
- **Value:** (Lato, 0.875rem)
- **Example:** "2005-01-01 to 2005-12-31"
- **Margin-bottom:** 8px

**Duration:**
- **Label:** "Duration" (Lato, 0.75rem, greydark, bold)
- **Value:** (Lato, 0.875rem)
- **Example:** "1 year"
- **Margin-bottom:** 8px

**Data Points:**
- **Label:** "Data Points" (Lato, 0.75rem, greydark, bold)
- **Value:** (Lato, 0.875rem, monospace)
- **Example:** "8760 (hourly)"
- **Margin-bottom:** 0

---

#### Data Quality

**Title:** "Data Quality" (Lato, 0.75rem, greydark, uppercase, bold)
- **Margin-top:** 12px
- **Margin-bottom:** 8px

**Completeness:**
- **Label:** "Completeness" (Lato, 0.75rem, greydark, bold)
- **Value:** Percentage with color indicator
  - Green (≥95%): #3E7263
  - Orange (80-95%): #E18E2A
  - Red (<80%): #C04343
- **Example:** "98% ✓"
- **Margin-bottom:** 8px

**Missing Values:**
- **Label:** "Missing Data" (Lato, 0.75rem, greydark, bold)
- **Value:** (Lato, 0.875rem, monospace)
- **Example:** "12 hours"
- **Margin-bottom:** 8px

**Interpolation:**
- **Label:** "Interpolated" (Lato, 0.75rem, greydark, bold)
- **Value:** "Yes" / "No"
- **Margin-bottom:** 0

---

#### Variables Present

**Title:** "Variables Available" (Lato, 0.75rem, greydark, uppercase, bold)
- **Margin-top:** 12px
- **Margin-bottom:** 8px

**Checklist:**
- Temperature ✓
- Relative Humidity ✓
- Solar Radiation ✓
- Wind Speed ✓
- Rain ✓
- Pressure (if available) ✓
- Cloud Cover (if available) ✓

**Each variable:**
- **Checkmark icon** (teal, 16px) if present
- **Text:** Lato, 0.875rem, text color
- **Padding:** 6px
- **Missing variables shown in gray with X icon**

---

## Middle Panel - Visualization Content

### Timeseries Chart (All climate types except Weather Station initial)

**Chart Container:**
- **Height:** 280px
- **Width:** 100% (fills middle panel width)
- **Border:** 1px solid greylight
- **Border-radius:** 4px
- **Background:** White
- **Padding:** 16px
- **Margin-bottom:** 16px

**Chart Type:** Dual-axis line chart (Recharts)

**Left Y-Axis (Temperature):**
- **Range:** Auto-scaled based on data
- **Color:** Red (#C04343)
- **Label:** "Temperature [°C]"
- **Title style:** Lato, 0.75rem, text color

**Right Y-Axis (Relative Humidity):**
- **Range:** 0-100% (or auto if needed)
- **Color:** Green (#3E7263)
- **Label:** "Relative Humidity [%]"
- **Title style:** Lato, 0.75rem, text color

**X-Axis (Time):**
- **Range:** Full year (Jan 1 - Dec 31)
- **Interval:** Month markers (Jan, Feb, Mar, etc.)
- **Format:** Abbreviated month names
- **Label style:** Lato, 0.75rem, greydark

**Data Lines:**
- **Temperature line:** Red (#C04343), 2px stroke, smooth curve
- **Humidity line:** Green (#3E7263), 2px stroke, smooth curve

**Grid:**
- **Major gridlines:** Gray (#BDB2AA) at 20% opacity
- **Vertical guides:** Month boundaries
- **Horizontal guides:** Y-axis intervals

**Legend:**
- **Position:** Below chart, centered
- **Format:** "■ Temperature [°C]  ■ Relative Humidity [%]"
- **Font:** Lato, 0.75rem, text color

**Hover Interaction (Optional):**
- **Tooltip:** Shows temperature and RH at cursor position
- **Format:** "Day: Jan 15 | Temp: 5.2°C | RH: 65%"
- **Background:** White, 1px border greylight
- **Font:** Lato, 0.75rem

**Update Behavior:**
- For Sine Curves: Updates in real-time as user edits parameters
- For Standards: Updates immediately when selection made
- For Weather Station: Static (displays pre-loaded data)
- For Upload: Static (displays file data)

---

### Climate Analysis Visualization (Weather Station & Upload File Only)

**Container:**
- **Below timeseries chart**
- **Margin-top:** 24px
- **Border-top:** 1px solid greylight
- **Padding-top:** 24px

**Title:** "Climate Analysis" (Lato, 0.875rem, bold, text color)
- **Margin-bottom:** 16px

**Layout:** Two polar diagrams side-by-side

#### Solar Radiation Rose

**Left Diagram (50% width):**

**Container:**
- **Width:** 45% of middle panel
- **Height:** 280px
- **Margin-right:** 20px (gap to right diagram)

**Diagram Type:** Polar/Radial heat map

**Structure:**
- **8 directional sectors:** N, NE, E, SE, S, SW, W, NW
- **Radial rings:** 5 rings showing intensity levels
- **Scale:** kWh/m² (annual sum by direction)

**Color Scheme:** Sequential
- **Low:** Green (#3E7263)
- **Medium:** Yellow (#F8C36E)
- **High:** Red (#C04343)
- **Color scale bar:** Left side, 40px wide × 280px tall

**Directional Labels:**
- **Compass directions:** N, NE, E, SE, S, SW, W, NW (positioned around circle)
- **Font:** Lato, 0.875rem, text color
- **Positions:** Outside circle at cardinal directions

**Radial Scale:**
- **Numbers:** 0, 200, 400, 600, 800, 1000+ kWh/m²
- **Font:** Lato, 0.75rem, greydark
- **Concentric circles:** Subtle gray lines

**Hover Interaction:**
- On hover over sector: Show "N: 1258 kWh/m²" tooltip
- Highlight that sector slightly (opacity increase)

---

#### Driving Rain Rose

**Right Diagram (50% width):**

**Container:**
- **Width:** 45% of middle panel
- **Height:** 280px

**Diagram Type:** Polar line chart

**Structure:**
- **8 directional sectors:** Same as solar
- **Radial rings:** 5 rings showing intensity levels
- **Scale:** mm/a (annual rain sum by direction)

**Line Style:**
- **Color:** Blue (#4597BF)
- **Stroke width:** 2px
- **Fill:** Blue at 20% opacity (area fill)
- **Smooth curve:** Connects 8 directional data points

**Directional Labels:**
- **Compass directions:** Same as solar rose
- **Font:** Lato, 0.875rem, text color

**Radial Scale:**
- **Numbers:** 0, 100, 200, 300, 400 mm/a (or auto-scaled)
- **Font:** Lato, 0.75rem, greydark
- **Concentric circles:** Subtle gray lines

**Hover Interaction:**
- On hover over sector: Show "SW: 156 mm/a" tooltip
- Highlight that sector (increase opacity)

---

## Footer Section (Sticky, h=56px)

### Layout
- **Container:** Full width, white background, 1px top border (greylight), shadow-sm (reverse)
- **Padding:** 12px 16px
- **Display:** flex, justify-content: space-between, align-items: center

### Left Section - Climate Summary

**Summary Text:**
- **Font:** Lato, 0.875rem, greydark
- **Content:** Climate selection summary
  - "Weather Station: Memphis, TN"
  - "Standard: EN 15026, Medium Moisture Load"
  - "Sine Curves: 20°C mean, 10K amplitude"
  - "Upload: Nashville_climate.epw"

**Note:** Text reflects current selection in that mode (exterior or interior)

### Right Section - Action Buttons

**Button 1: Cancel**
- **Style:** Secondary (white background, 1px border greylight, greydark text)
- **Font:** Lato, 0.875rem, 600 weight
- **Padding:** 8px 20px
- **Height:** 36px
- **Border-radius:** 4px
- **Hover:** Background becomes greylight at 10%
- **Click:** Closes modal without applying
- **Keyboard:** ESC also triggers

**Button 2: Apply Climate**
- **Style:** Primary (background bluegreen, white text, no border)
- **Font:** Lato, 0.875rem, 600 weight
- **Padding:** 8px 20px
- **Height:** 36px
- **Border-radius:** 4px
- **Shadow:** shadow-sm
- **Hover:** Background becomes slightly darker
- **Click:**
  - Validates selections (both exterior and interior must be selected)
  - If invalid: Shows inline error
  - If valid:
    - Applies climate(s) to project
    - Closes modal (fade-out 200ms)
    - Main app updates climate cards
    - Auto-save triggered
    - Toast notification: "Climate applied: {exterior} | {interior}"

**Button Spacing:**
- **Gap between buttons:** 12px

**Disabled State (if needed):**
- **Condition:** If neither exterior nor interior selected
- **Styling:** 50% opacity, cursor: not-allowed

---

## Behavior & Interactions

### Modal Open
1. Modal appears (fade-in 300ms, scale 0.95→1.0)
2. Pre-selection applied (if opened from exterior card, "Exterior Climate" section expanded and selected)
3. Left panel: Two sections (Exterior/Interior), none selected initially
4. Middle panel: Blank with message "Select climate type to see options"
5. Right panel: Empty
6. Focus: First climate type option

### Climate Type Selection (Any type)
1. User clicks on climate type (e.g., "Weather Station")
2. Immediate update:
   - Left panel: Type highlighted (radio filled, background color)
   - Middle panel: Visualization/form appears (map, parameters, etc.)
   - Right panel: Parameters/statistics appear
   - Timeseries chart updates (if available)
   - If Sine Curves: Curves update in real-time

### Switching Between Exterior/Interior
1. User clicks "Interior Climate" section header or expands it
2. Left panel: Switches to interior climate type options
3. Middle panel: Updates to show interior form (if switching types)
4. Right panel: Updates to interior-specific parameters
5. Selections persist:
   - Exterior selection remains stored but hidden
   - Interior selection can be independent
   - Switching back shows previous exterior selection

### Weather Station Map Interaction
1. User searches for location: Autocomplete dropdown appears
2. User clicks location: Map centers, marker selected, right panel updates
3. User clicks marker on map: Same as autocomplete
4. Marker remains teal (selected)
5. Timeseries chart updates with location data

### Standard Selection
1. User selects standard dropdown
2. Parameters below update to show standard-specific form
3. User fills in parameters
4. Timeseries chart updates in real-time OR on blur

### Sine Curve Editing
1. User enters temperature mean, amplitude, day
2. Curve preview updates immediately in right panel
3. User enters humidity parameters
4. Humidity curve updates immediately
5. Both curves shown simultaneously in right panel

### File Upload
1. User drags file over upload area OR clicks to browse
2. File accepted if .epw or .wac
3. Right panel updates with file info + statistics
4. Timeseries chart updates with file data

### Apply Climate
1. User clicks "Apply Climate" button
2. Validation check:
   - Is exterior selected? ✓
   - Is interior selected? ✓
3. If valid:
   - Modal closes (fade-out 200ms)
   - Climate applied to project
   - Left panel in main app updates with climate names
   - Climate cards show selected values
4. If invalid:
   - Error message appears: "Please select both exterior and interior climate"
   - Footer background becomes pink (red at 10% opacity)
   - Focus moves to first incomplete section

---

## Design System Compliance

### Colors (from C3RRO Design System)
- ✅ Text: #33302F (primary text)
- ✅ Greydark: #5E5A58 (secondary text, labels)
- ✅ Greylight: #D9D8CD (borders, backgrounds)
- ✅ Bluegreen: #4AB79F (primary actions, highlights)
- ✅ Blue: #4597BF (secondary, info)
- ✅ Green: #3E7263 (positive, good data quality)
- ✅ Orange: #E18E2A (warnings, attention)
- ✅ Red: #C04343 (errors, high risk)
- ✅ White: #FFFFFF (backgrounds, cards)

### Typography
- ✅ Headings: Jost, 600 weight
- ✅ Body text: Lato, 400-500 weight
- ✅ Monospace: For numeric values
- ✅ Font sizes: 0.75rem (captions), 0.875rem (body), 1rem (headers), 1.25rem (modal title)

### Spacing
- ✅ Modal padding: 16-24px
- ✅ Section gaps: 16px
- ✅ Input vertical spacing: 12px
- ✅ Border-radius: 4px (inputs), 8px (cards/modals)

### Shadows
- ✅ Subtle: 0 2px 4px rgba(0,0,0,0.1)
- ✅ Medium: 0 4px 12px rgba(0,0,0,0.15)

### Interactive Elements
- ✅ Buttons: Primary (bluegreen), Secondary (white + border)
- ✅ Inputs: Focused state (bluegreen border)
- ✅ Radio buttons: 18px diameter
- ✅ Disabled state: 50% opacity

---

## Accessibility

### Keyboard Navigation
- **Tab:** Cycle through all interactive elements
- **Shift+Tab:** Reverse cycle
- **Enter:** Select climate type, submit form
- **Escape:** Close modal
- **Arrow keys:** Date picker navigation (in date inputs)

### Screen Reader Support
- **Modal:** role="dialog", aria-modal="true", aria-labelledby="modal-title"
- **Title:** id="modal-title"
- **Form labels:** Associated with inputs via `<label for="input-id">`
- **Error messages:** role="alert", aria-live="polite"
- **Radio buttons:** Proper role + aria-checked

### Visual Accessibility
- ✅ Contrast ratio: All text > 4.5:1 (WCAG AA)
- ✅ Focus indicators: 2px border on all focusable elements
- ✅ Color not sole indicator: Use icons + text, not just color

---

## Responsive Design

### Desktop (1400px+)
- **Modal width:** 1100px
- **Layout:** Three-column as specified
- **Chart heights:** 280px

### Tablet (1024px)
- **Modal width:** 95% viewport (max 1000px)
- **Left panel:** 280px (slightly narrower)
- **Right panel:** 300px (slightly narrower)
- **Middle:** Adjusts
- **Chart heights:** 240px

### Tablet Portrait (768px)
- **Modal width:** 95% viewport
- **Layout:** Stack vertically (full width each)
  - Left panel (300px wide)
  - Middle panel (full width)
  - Right panel (full width)
- **Order:** Left → Middle → Right (vertical flow)
- **Chart heights:** 200px

### Mobile (<540px)
- **Modal:** Full-screen experience
- **Left panel:** Full width, scrollable
- **Middle panel:** Full width, scrollable
- **Right panel:** Full width, scrollable
- **Buttons:** Full width, stacked vertically
- **Chart heights:** 150px

---

## Future Enhancements (Post-MVP)

1. **Multiple location comparison** - Select 2-3 locations, compare side-by-side
2. **Climate change scenarios** - Future weather projections (RCP 4.5, 8.5)
3. **Microclimate adjustments** - Urban heat island, shading effects
4. **Historical analysis** - Multi-year data averaging
5. **Custom standard creation** - Power users define new standards
6. **Climate template library** - Save/load frequent combinations
7. **Import/export climate** - Share climate files between projects

---

## Implementation Notes

### React Component Structure
```jsx
<ClimateSelectionModal>
  <Header title="Exterior Climate" onClose={closeModal} />
  
  <MainContent>
    <LeftPanel>
      <ExteriorSection>
        <ClimateTypeSelector onChange={handleTypeSelect} />
      </ExteriorSection>
      <InteriorSection>
        <ClimateTypeSelector onChange={handleTypeSelect} />
      </InteriorSection>
    </LeftPanel>
    
    <MiddlePanel>
      {selectedType === 'weather' && <WeatherStationView />}
      {selectedType === 'standard' && <StandardView />}
      {selectedType === 'sine' && <SineCurveView />}
      {selectedType === 'upload' && <FileUploadView />}
    </MiddlePanel>
    
    <RightPanel>
      {selectedType === 'weather' && <WeatherStats />}
      {selectedType === 'standard' && <StandardSummary />}
      {selectedType === 'sine' && <CurvePreview />}
      {selectedType === 'upload' && <FileInfo />}
    </RightPanel>
  </MainContent>
  
  <Footer>
    <SummaryText />
    <Button>Cancel</Button>
    <Button>Apply Climate</Button>
  </Footer>
</ClimateSelectionModal>
```

### State Management
**Local component state:**
- `exteriorType`: Selected exterior climate type
- `exteriorData`: Exterior climate parameters
- `interiorType`: Selected interior climate type
- `interiorData`: Interior climate parameters
- `expandedSection`: Which section expanded (exterior/interior)

**Data persistence:**
- Both exterior and interior selections persist while modal open
- If user switches sections, previous data remembered
- No unsaved changes warning (selections apply on "Apply Climate" click)

### Performance Considerations
1. **Map rendering:** Use Leaflet clustering for thousands of markers
2. **Timeseries chart:** Virtual rendering or data decimation for 8760+ points
3. **Live preview:** Debounce sine curve updates (200ms)
4. **File upload:** Client-side validation only, no server calls for MVP

---

## Testing Checklist

### Functionality
- [ ] All four climate types selectable
- [ ] Exterior/Interior independent selection
- [ ] Switching between sections persists data
- [ ] Map markers clickable, update right panel
- [ ] Standard dropdown changes form below
- [ ] Sine curve updates in real-time
- [ ] File upload accepts .epw and .wac
- [ ] Apply button works when both modes selected
- [ ] Cancel closes without applying

### Design System
- [ ] All colors match C3RRO palette
- [ ] Typography matches specification (Jost, Lato)
- [ ] Spacing consistent (16px, 12px gaps)
- [ ] Border-radius correct (4px inputs, 8px modals)
- [ ] Shadows applied correctly

### Accessibility
- [ ] Tab order logical
- [ ] ESC closes modal
- [ ] Form labels associated with inputs
- [ ] Error messages announced to screen readers
- [ ] Color contrast > 4.5:1
- [ ] Focus indicators visible

### Responsive
- [ ] Desktop (1400px): Three-column layout
- [ ] Tablet (1024px): Adjusted widths
- [ ] Mobile (768px): Stacked vertically
- [ ] Charts responsive
- [ ] Touch targets ≥44px on mobile

### Data Persistence
- [ ] Exterior data remembered when switching to interior
- [ ] Interior data remembered when switching to interior
- [ ] Map selection remembered (location sticky)
- [ ] Parameter values remembered on section switch

---

**Specification Complete - Ready for Development ✅**

