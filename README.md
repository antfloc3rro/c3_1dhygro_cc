# WUFI Cloud MVP - React Frontend

A professional 1D hygrothermal component simulation interface built with React, TypeScript, and Tailwind CSS.

## Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. Clone this repository:
```bash
git clone https://github.com/antfloc3rro/c3_1d_hygro_mock.git
cd c3_1d_hygro_mock
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The app will open automatically at `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start Vite dev server (hot reload)
- `npm run build` - Build for production
- `npm run lint` - Check code quality
- `npm run preview` - Preview production build locally
- `npm run test` - Run unit tests
- `npm run test:ui` - Run tests with UI

## Project Structure

```
src/
├── components/              # React components
│   ├── layout/             # Layout components (Header, MainLayout, Panels)
│   ├── panels/             # Three-panel layout components
│   ├── modals/             # Modal dialogs
│   ├── inputs/             # Form inputs and controls
│   └── common/             # Reusable components
├── hooks/                  # Custom React hooks
│   └── index.ts           # useUIState, useFormState, useAsync
├── types/                  # TypeScript type definitions
│   └── index.ts           # Domain models and types
├── utils/                  # Utility functions
│   └── index.ts           # Helpers for numbers, dates, etc.
├── api/                    # API integration (future)
├── store/                  # State management (future)
├── App.tsx                 # Root component
├── main.tsx                # React entry point
└── index.css               # Global styles
```

## Architecture Decisions

### State Management
Currently using **React built-in hooks** (`useState`, `useCallback`) for simplicity:
- `useUIState()` for global UI state (selected items, open modals)
- `useFormState()` for local form state
- `useAsync()` for async operations

**Future**: Can migrate to Zustand or Redux when complexity increases.

### Styling
- **Tailwind CSS** for utility-first styling
- **Custom design tokens** for colors, spacing, typography
- **Component layer** in Tailwind for reusable patterns (`.btn-primary`, `.input`, `.card`)

### Type Safety
- **TypeScript strict mode** for compile-time safety
- **Domain models** in `src/types/index.ts`
- **Path aliases** for clean imports (`@components`, `@hooks`, etc.)

### Performance
- Code splitting via Vite
- Lazy loading for routes (future)
- Memoization for expensive computations
- Virtual scrolling for large lists (future)

## Key Features

### Three-Panel Desktop Layout
- **Left Panel**: Project/case/assembly navigation
- **Center Panel**: Visual assembly representation + data table
- **Right Panel**: Context-sensitive inspector

### Design System Compliance
All components follow the WUFI Cloud UI/UX v2.1 specification:
- Color palette (Teal primary, neutral grays)
- Typography scale (xs to h1)
- Spacing system (8px grid)
- Component patterns (buttons, inputs, cards, modals)

### Accessibility (WCAG 2.1 AA)
- Semantic HTML
- Keyboard navigation
- Screen reader support (ARIA labels)
- Color contrast compliance (4.5:1 minimum)
- Focus indicators (2px teal ring)

## Development Workflow

### Adding a New Component

1. Create component file in `src/components/{category}/{ComponentName}.tsx`
2. Import Tailwind classes and icons from lucide-react
3. Use TypeScript interfaces for props
4. Export from appropriate index file

Example:
```typescript
import React from 'react'
import { cn } from '@utils/index'
import { ChevronDown } from 'lucide-react'

interface ButtonProps {
  label: string
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'ghost'
}

export function Button({ label, onClick, variant = 'primary' }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn('btn', `btn-${variant}`)}
    >
      {label}
    </button>
  )
}
```

### Adding a Custom Hook

1. Add to `src/hooks/index.ts`
2. Export from index
3. Use in components with `import { useMyHook } from '@hooks/index'`

### Adding Types

1. Add to `src/types/index.ts`
2. Export from index
3. Use in components/hooks with `import type { MyType } from '@types/index'`

## Design System

### Colors
- **Teal**: Primary brand color (#14b8a6)
- **Neutral**: Cool grays for UI
- **Status**: Green (success), Red (error), Yellow (warning), Blue (info)

### Typography
- **Headings**: h1 (24px), h2 (20px), h3 (18px), h4 (16px)
- **Body**: base (14px, 500 weight), sm (14px, 400 weight)
- **Small**: xs (12px)

### Spacing (8px grid)
- `gutter`: 8px
- `section`: 16px
- `panel`: 24px

### Components
- `.btn` with variants: `btn-primary`, `btn-secondary`, `btn-ghost`
- `.input` for form inputs
- `.card` for content containers
- `.focus-ring` for keyboard focus states

## API Integration (Future)

When backend is ready, add to `src/api/client.ts`:
```typescript
import axios from 'axios'

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3000/api',
})

export default apiClient
```

Then create specific API modules:
```typescript
// src/api/simulations.ts
export async function getSimulations() { ... }
export async function createSimulation(data) { ... }
```

## Responsive Design Strategy

**MVP Focus**: Desktop (1200px+) optimal experience

**Post-MVP**: Tablet and mobile support
- Drawer for left panel
- Bottom sheet for right panel
- Responsive data table

## Troubleshooting

### Port 5173 already in use
```bash
npm run dev -- --port 5174
```

### TypeScript errors
Make sure `tsconfig.json` paths are correct. Run:
```bash
npm run lint
```

### Hot reload not working
Restart dev server and clear browser cache.

## Contributing

1. Create feature branch: `git checkout -b feature/my-feature`
2. Make changes following code style
3. Run linter: `npm run lint`
4. Commit: `git commit -am 'Add feature'`
5. Push: `git push origin feature/my-feature`

## Resources

- [WUFI Cloud UI/UX v2.1 Specification](./docs/WUFI_Cloud_UI_UX_v2_1_*.md)
- [MVP Architecture Document](./docs/WUFI_Cloud_MVP_Architecture.md)
- [API Documentation](./docs/API_Documentation.html)
- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)

## License

Proprietary - Fraunhofer IBP

## Support

For issues or questions, contact the development team.
