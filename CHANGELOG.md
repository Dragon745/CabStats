# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

## [1.1.0] - 2025-10-16

### Added

- Firebase hosting configuration for GitHub Actions deployment
- Modified GitHub Actions workflows to deploy from local build folder instead of building on GitHub

### Updated

- GitHub Actions workflow (`.github/workflows/firebase-hosting-merge.yml`) to skip build step and deploy directly from `build` folder
- GitHub Actions workflow (`.github/workflows/firebase-hosting-pull-request.yml`) to skip build step for PR previews
- `.gitignore` to track `build` folder in Git for deployment

### Technical Changes

- **Deployment Strategy**: Changed from GitHub-based builds to local build + Git deployment
- **Firebase Configuration**: Confirmed `firebase.json` points to `build` folder as public directory
- **Project ID**: Using Firebase project `cabstats-bb4ab` for hosting
- **Workflow Optimization**: Reduced GitHub Actions execution time by removing build steps

## [1.0.0] - 2025-10-16

### Added

- Tailwind CSS v3 configuration and setup
- `tailwind.config.js` configuration file for Tailwind CSS v3
- `postcss.config.js` configuration file
- Tailwind CSS directives in `src/index.css`
- Beautiful homepage design using Tailwind CSS classes
- **Custom CabStats SVG icon** (`src/logo.svg`) with:
  - Clean, simple square design with rounded corners
  - Beautiful blue gradient background (#3B82F6 to #1E40AF)
  - "CabStats" text centered in white
  - Optimized for all icon sizes (favicon, app icons, etc.)
  - Minimalist design perfect for app icons and branding
- **🚀 Progressive Web App (PWA) Features:**
  - Service worker (`public/sw.js`) for offline functionality
  - Caching strategy for offline access
  - App installation support on mobile devices
  - Offline indicator in the UI
  - Network status detection
  - Uses existing icon files (`favicon.ico`, `logo192.png`, `logo512.png`) for app installation

### Updated

- Homepage (`src/App.js`) with modern Tailwind CSS styling:
  - Gradient background (`bg-gradient-to-br from-blue-50 to-indigo-100`)
  - Card-based layout with shadows and rounded corners
  - Responsive design with proper spacing
  - Interactive button with hover effects
  - Typography improvements with proper text sizing and colors
- **App branding and metadata:**
  - Updated page title to "CabStats"
  - Updated meta description to "CabStats - Track and analyze your cab/taxi statistics"
  - Updated `manifest.json` with proper app name and theme colors
  - Added SVG favicon support for modern browsers
  - Updated theme color to match brand (#3B82F6)
