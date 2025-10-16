# Changelog

All notable changes to this project will be documented in this file.

## [2.1.0] - 2025-10-16 23:48:22

### Improved

- **UI Optimization**: Moved ride history into the Ride tab instead of separate History tab
- **Better UX**: Users can now see recent rides directly below the start/end ride section
- **Simplified Navigation**: Reduced navigation tabs from 6 to 5 for cleaner interface
- **Space Efficiency**: Shows last 5 rides with option to see total count
- **Fuel Transfer Integration**: Moved fuel transfer functionality into Accounts tab instead of separate Fuel tab
- **Cleaner Navigation**: Reduced navigation tabs from 5 to 4 for even cleaner interface
- **Flexible Fuel Transfers**: Enhanced fuel transfer system to allow transfers from both Main Account and Cash Account
- **Smart Transfer Logic**: "Transfer All" automatically selects the account with sufficient balance
- **Manual Account Selection**: Partial transfers allow users to choose which account to transfer from
- **Manual Transfer All Selection**: "Transfer All" now allows manual account selection instead of auto-selection
- **Consistent UI**: Both transfer options now have the same manual account selection interface
- **General Account Transfers**: Added ability to transfer money between any accounts (not just fuel transfers)
- **Flexible Money Movement**: Transfer between Main Account, Cash Account, Platform Account, and Fuel Account
- **Expense Categories**: Expanded expense categories to include Airport Fee, Platform Fee, Tolls, Other Fees, and Parking Fee

### Added

- **Ride Deletion**: Added ability to delete rides with complete account reversal
- **Account Reversal**: When deleting a ride, all account changes are automatically reversed
- **Fuel Transfer Reversal**: Deleted rides reverse any completed fuel transfers
- **Delete Confirmation**: Confirmation dialog prevents accidental ride deletion
- **Visual Delete Button**: Trash icon button on each ride for easy deletion
- **Account Transfer System**: General money transfer between any accounts
- **Enhanced Expense Tracking**: Additional expense categories for comprehensive tracking

### Fixed

- **Major Calculation Issues**: Fixed critical calculation problems when ending rides
- **Data Type Conversion**: Fixed string vs number issues in ride completion calculations
- **Profit Calculation**: Ensured all inputs are properly converted to numbers before calculations
- **Account Balance Updates**: Fixed fare amount being passed as string instead of number
- **Input Validation**: Added comprehensive validation for ride completion form
- **Error Handling**: Enhanced error handling and validation throughout ride completion process
- **Account Validation**: Added validation to ensure payment method account exists
- **Account Updates**: Fixed payment method mismatch causing account balances not to update
- **Cash Account**: Payment method now correctly matches account name ('Cash Account' instead of 'Cash')
- **Fuel Transfer Logic**: Fixed fuel transfer processing to correctly handle partial transfers
- **Account State**: Enhanced account balance updates to use fresh database data to avoid stale state issues
- **Combined Balance**: Fixed numeric addition issue causing incorrect combined balance calculation (580 showing as 580000)
- **Data Types**: Ensured all account balance operations use parseFloat() to prevent string concatenation
- **Ride Persistence**: Active rides now persist across app restarts using IndexedDB
- **Real-world Usage**: Users can now start a ride, close the app, complete the actual ride, and return to enter data
- **Database Schema**: Added `activeRide` store to IndexedDB for persistent ride tracking
- **Context Updates**: Enhanced AppContext to load/save active rides automatically

### Technical Changes

- Added `ACTIVE_RIDE` store to IndexedDB schema
- Implemented `saveActiveRide()`, `getActiveRide()`, and `clearActiveRide()` methods
- Updated database version to v2 for migration
- Enhanced `startRide()` and `endRide()` functions with persistence
- Modified `loadAllData()` to restore active rides on app startup
- Added `transferBetweenAccounts()` function for general account transfers
- Enhanced `deleteRide()` function with complete account reversal logic
- Updated expense categories in `getExpenseCategories()` utility function

## [Unreleased]

## [2.0.0] - 2025-10-16

### Added

- **Complete Cab Ledger & Ride Tracking System:**

  - 4-account management system (Main Account, Fuel Account, Cash Account, Platform Account)
  - Business day tracking with start/end time and km recording
  - Real-time ride tracking with start/end functionality
  - Automatic profit calculations (profit, profit/km, profit/min)
  - 50% fuel allocation system with pending transfer tracking
  - Expense tracking with 9 categories (Cigarette, Cleaning, Food, Fuel, Goodies, Other, Rent, Water, Withdrawals)
  - Fuel transfer management (full and partial transfers)
  - Account balance management with manual adjustments
  - Complete ride history with detailed information
  - Mobile-first PWA design with bottom navigation

- **Database Layer (IndexedDB):**

  - Offline-first data storage using IndexedDB
  - Stores: accounts, businessDays, rides, fuelTransfers, expenses
  - Automatic database initialization with default accounts
  - Data persistence and migration system

- **Core Components:**

  - Dashboard with account balances, business day status, and quick stats
  - RideTracker for start/end ride functionality with completion form
  - RideHistory with detailed ride information and filtering
  - FuelTransfers for managing pending fuel allocations
  - ExpenseTracker with category-based expense recording
  - AccountsView for detailed account management
  - Navigation component with mobile-friendly bottom tabs

- **Business Logic & Calculations:**

  - Profit calculation (fare - all fees)
  - Profit per km and profit per minute calculations
  - Fuel allocation calculation (50% of profit)
  - Duration calculations for rides and business days
  - Currency formatting (Indian Rupees)
  - Date and time formatting utilities

- **PWA Enhancements:**
  - Preserved all existing PWA functionality (install prompt, offline indicator)
  - Enhanced service worker caching
  - Improved manifest.json configuration
  - Native app-like experience with proper navigation

### Technical Implementation

- **State Management:** React Context API for global state management
- **Data Storage:** IndexedDB for offline-first functionality
- **UI Framework:** Tailwind CSS for consistent mobile-first design
- **Component Architecture:** Modular component structure with clear separation of concerns
- **Error Handling:** Comprehensive error handling with user-friendly messages
- **Loading States:** Proper loading indicators and async operation handling

### User Experience

- **Mobile-First Design:** Optimized for mobile devices with touch-friendly interfaces
- **Offline Support:** Full functionality without internet connection
- **Real-Time Updates:** Instant balance updates and calculations
- **Intuitive Navigation:** Bottom tab navigation for easy access
- **Visual Feedback:** Color-coded accounts, status indicators, and progress feedback
- **Data Persistence:** All data saved locally and persists between sessions

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
