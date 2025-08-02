# OneType - One-Handed Typing App

A revolutionary mobile-first, gamified typing application designed specifically for one-handed users. Features comprehensive accessibility support, adaptive learning, and an engaging Duolingo-inspired interface.

## 🚀 Features

### Core Functionality
- **One-handed optimized keyboard layouts** for both left and right hands
- **Progressive lesson system** with 20+ structured lessons
- **Real-time typing metrics** (WPM, accuracy, consistency tracking)
- **Gamified progression** with achievements and badges
- **Professional settings system** with 5 organized tabs

### Accessibility & Customization
- **WCAG 2.1 AA compliant** design
- **Comprehensive accessibility settings** (high contrast, reduced motion, screen reader support)
- **Real-time preview** for font size, line height, and color adjustments
- **Professional UI controls** with sliders, switches, and color pickers
- **Persistent user preferences** saved across sessions

### Mobile-Optimized Experience
- **Touch-friendly virtual keyboard** with visual feedback
- **Responsive design** that adapts to phone screens
- **Mobile-specific settings panel**
- **Optimized performance** for mobile devices

## 🛠️ Technology Stack

### Frontend
- **React 18** with TypeScript for type safety
- **Vite** for fast development and optimized builds
- **Tailwind CSS** with custom design system
- **Radix UI** for accessible, unstyled components
- **Zustand** for lightweight state management
- **TanStack Query** for server state management

### Backend
- **Express.js** server with TypeScript
- **Drizzle ORM** for PostgreSQL with migration support
- **In-memory storage** for development

### Development Tools
- **Vite middleware integration** for seamless full-stack development
- **Hot module replacement** for both client and server
- **TypeScript compilation** checking

## 🏃‍♂️ Quick Start

### Development
```bash
npm install
npm run dev
```

### Production Build
```bash
npm run build
npm start
```

### Database Management
```bash
npm run db:push
```

## 📱 Mobile Deployment

The app is optimized for mobile deployment on Replit:
1. Click the Deploy button in Replit
2. Get your `.replit.app` URL
3. Add to home screen for native app experience

## 🎯 Key Components

### Typing Engine
- Real-time input processing and validation
- Comprehensive metrics calculation (WPM, accuracy)
- Error detection and correction tracking

### Settings System
- **Typing Tab**: Hand preference, finger guide, WPM goals
- **Display Tab**: Font size, line height with live preview
- **Audio Tab**: Master volume, sound effect toggles
- **Accessibility Tab**: High contrast, reduced motion, screen reader support
- **Appearance Tab**: Custom color themes with color pickers

### Lesson System
- Progressive difficulty with unlockable lessons
- Structured learning path for one-handed typing mastery
- Direct lesson access from main menu

## 🔧 Architecture

The application follows a modern React architecture with:
- **Component-based UI** with reusable components
- **Centralized state management** using Zustand stores
- **Type-safe database operations** with Drizzle ORM
- **Modular design** with clear separation of concerns

## 🎨 Design Philosophy

- **Accessibility-first** approach with WCAG 2.1 AA compliance
- **Mobile-optimized** interface with touch-friendly controls
- **Professional UI/UX** with familiar control patterns
- **Real-time feedback** for immediate user response
- **Gamified learning** to encourage continued practice

## 📈 Recent Updates

- Fixed critical hand preference functionality
- Completely rebuilt settings system with full functionality
- Added real-time preview for all visual settings
- Implemented professional UI controls (sliders, switches, color pickers)
- Restored optional tutorial system with "Start Here" badge
- Optimized for mobile deployment

## 🤝 Contributing

This project is designed for one-handed typing accessibility and welcomes contributions that enhance the user experience for users with diverse typing needs.

## 📄 License

MIT License - See LICENSE file for details