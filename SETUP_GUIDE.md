# WUFI Cloud MVP - Complete Setup Guide

This guide walks you through setting up the project locally and getting ready for development with Claude Code.

## Prerequisites

Before you start, ensure you have:

- **Node.js 18.0.0 or higher** - [Download here](https://nodejs.org/)
- **Git** - [Download here](https://git-scm.com/)
- **A code editor** (VS Code recommended) - [Download here](https://code.visualstudio.com/)
- **Claude Code** - Available in Claude.ai (button in chat)

## Step 1: Clone the Repository

```bash
git clone https://github.com/antfloc3rro/c3_1d_hygro_mock.git
cd c3_1d_hygro_mock
```

## Step 2: Install Dependencies

```bash
npm install
```

This will install all required packages from `package.json`:
- React 18.3
- Vite (build tool)
- TypeScript
- Tailwind CSS
- And many others

The installation may take 2-3 minutes. You'll see progress in your terminal.

## Step 3: Verify Installation

Check that everything installed correctly:

```bash
npm run lint
```

You should see no errors (some warnings are OK).

## Step 4: Start Development Server

```bash
npm run dev
```

You should see output like:
```
  VITE v5.0.0  ready in 123 ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

The app will automatically open in your browser at `http://localhost:5173`. You should see:
- Header with "WUFI Cloud MVP" title
- Three-panel layout (left, center, right)
- Placeholder text in each panel

## Step 5: Keep Dev Server Running

**Important**: Keep the terminal running with `npm run dev` active. This enables hot reload—changes you make to files will instantly update in the browser.

## Step 6: Open Claude Code

1. In this Claude.ai chat, look for a button or option to **open Claude Code**
2. In Claude Code, open the project folder: `/path/to/c3_1d_hygro_mock`
3. Claude Code will analyze the project structure
4. You're now ready to start developing!

## Project Structure Quick Reference

```
c3_1d_hygro_mock/
├── src/
│   ├── components/        # React components (our main focus)
│   ├── hooks/            # Custom hooks
│   ├── types/            # TypeScript types
│   ├── utils/            # Helper functions
│   ├── App.tsx           # Root component
│   ├── main.tsx          # Entry point
│   └── index.css         # Global styles
├── index.html            # HTML file
├── package.json          # Dependencies
├── tsconfig.json         # TypeScript config
├── vite.config.ts        # Vite config
├── tailwind.config.js    # Tailwind config
└── README.md             # Documentation
```

## File Organization as We Build

As we build components, they'll be organized as follows:

```
src/components/
├── layout/               # Layout components
│   ├── Header.tsx
│   ├── MainLayout.tsx
│   └── Panels.tsx
├── panels/              # Three-panel content
│   ├── LeftPanel.tsx    # Project navigation
│   ├── CenterPanel.tsx  # Assembly + table
│   └── RightPanel.tsx   # Inspector
├── modals/              # Modal dialogs
│   ├── MaterialDatabaseModal.tsx
│   ├── ClimateSelectionModal.tsx
│   └── ...
├── inputs/              # Form inputs
│   ├── TextInput.tsx
│   ├── NumberInput.tsx
│   └── ...
└── common/              # Reusable pieces
    ├── Button.tsx
    ├── Card.tsx
    └── ...
```

## Common Commands

While developing, you'll use these commands:

```bash
# Start dev server (hot reload)
npm run dev

# Build for production
npm run build

# Check code quality
npm run lint

# Run tests
npm run test

# Preview production build
npm run preview
```

## Troubleshooting

### "Port 5173 is already in use"
Another process is using the port. Either:
1. Close the other process, or
2. Use a different port:
   ```bash
   npm run dev -- --port 5174
   ```

### "Cannot find module '@components/...'"
The path aliases in `tsconfig.json` might not be recognized. Try:
1. Stop dev server (Ctrl+C)
2. Restart: `npm run dev`

### Hot reload not working
1. Stop dev server
2. Clear browser cache (Ctrl+Shift+Delete)
3. Restart: `npm run dev`

### TypeScript errors in editor
1. Make sure you're in the correct project folder
2. Make sure `node_modules/` is installed
3. Reload your editor (VS Code: Command Palette → "Developer: Reload Window")

## Next Steps

Once you have the dev server running and Claude Code open:

1. **Tell Claude you're ready**: Say something like "I have the dev server running at localhost:5173 and Claude Code open. Ready to build the main interface components."

2. **We'll build the three-panel layout** with proper component structure

3. **Then modals** (Material Database, Climate Selection, etc.)

4. **Finally, integration** with backend API (when ready)

Throughout the process:
- You'll see changes in real-time in your browser
- All files are in the `/src` folder
- We'll follow the design spec from your project knowledge

## Design System Reference

All components follow the **WUFI Cloud UI/UX v2.1** specification already loaded in your project knowledge:

- **Colors**: Teal primary (#14b8a6), neutral grays
- **Typography**: Consistent scale from xs to h1
- **Spacing**: 8px grid system
- **Components**: Buttons, inputs, cards, modals
- **Accessibility**: WCAG 2.1 AA compliant

## Useful Resources

Within this project:
- `README.md` - General overview
- `SETUP_GUIDE.md` - This file
- Docs in project knowledge - Complete UI/UX specifications
- Design tokens in `tailwind.config.js`

External:
- [React Docs](https://react.dev) - React best practices
- [Tailwind CSS](https://tailwindcss.com) - Utility class reference
- [TypeScript Handbook](https://www.typescriptlang.org) - Type safety

## Ready?

Once you confirm the dev server is running and Claude Code is open, let's build! 🚀
