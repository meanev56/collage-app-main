# Collage Maker App

A beautiful, modern **React Native** mobile application for creating stunning photo collages.  
Choose from grid layouts, pre-made templates, adjust photos, add text/stickers, and export your creations.

<p align="center">
  <img src="https://via.placeholder.com/800x400.png?text=Collage+Maker+App+Preview" alt="App Preview" width="800"/>
</p>

## ✨ Features

- **Home Screen** — Discover trending templates, popular grids, birthday cards, and quick AI tools
- **Create Screen** — Start a new collage with blank canvas, custom layouts or beautiful templates
- **Collage Editor (EditsScreen)** — 
  - Dynamic grid layouts (2×2, 3×3, freestyle, etc.)
  - Photo picker with add/remove support
  - Real-time adjustments (brightness, contrast, saturation)
  - Text overlays (with future drag support)
  - Export collage as image (using ViewShot)
- **Template Preview Screen** — 
  - Large zoomable/pannable preview
  - Photo count compatibility check
  - Favorite toggle
  - Author info display
  - Similar templates carousel
- Clean, modern UI with consistent design system (#FF5A5F accent color)
- Navigation with React Navigation
- TypeScript support

 
## 🛠️ Tech Stack

- **React Native** (Expo recommended)
- **TypeScript**
- **React Navigation** (stack + native stack)
- **Expo modules**:
  - expo-image-picker
  - expo-image-manipulator
  - expo-av (future stickers/media)
- **react-native-view-shot** — for exporting collages
- **@react-native-community/slider** — adjustment controls
- **react-native-reanimated** + **react-native-gesture-handler** — zoom/pan in preview
- **@expo/vector-icons** (Ionicons)

## 📂 Project Structure

├── src/
│   ├── screens/
│   │   ├── HomeScreen.tsx
│   │   ├── CreateScreen.tsx
│   │   ├── EditsScreen.tsx        ← main collage editor
│   │   └── TemplatePreviewScreen.tsx
│   ├── components/
│   │   ├── GridItem.tsx
│   │   └── ... (more reusable components)
│   ├── constants/
│   │   └── layouts.ts            ← grid layouts, templates, design options
│   ├── types/
│   │   └── index.ts
│   ├── navigation/
│   └── App.tsx
├── assets/
└── app.json / app.config.js


## 🚀 Getting Started

### Prerequisites

- Node.js ≥ 18
- Yarn or npm
- Expo CLI (`npm install -g expo-cli`) — recommended

### Installation

1. Clone the repository

```bash
git clone https://github.com/meanev56/collage-app.git

2. Install dependencies

yarn install
# or
npm install

3. Start the app

npx expo start
# or
yarn start

Press i → iOS simulator
Press a → Android emulator
Scan QR code with Expo Go app

Important Setup Steps

Add Reanimated Babel plugin in babel.config.js:

plugins: [
  // ... other plugins
  'react-native-reanimated/plugin',
],

Clear cache after adding plugins:

npx expo start --clear