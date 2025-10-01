# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

courtFlow is a React Native Expo application for basketball game analysis and visualization. It provides an interactive canvas where users can tap to create draggable basketball icons, likely intended for tactical analysis or play visualization.

## Development Commands

- `npm start` - Start Expo development server
- `npm run android` - Run on Android device/emulator  
- `npm run ios` - Run on iOS device/simulator
- `npm run web` - Run in web browser

## Technology Stack

- **Framework**: React Native with Expo SDK 53
- **Graphics**: @shopify/react-native-skia for 2D canvas rendering
- **Animation**: react-native-reanimated for smooth animations
- **Gestures**: react-native-gesture-handler for touch interactions
- **Language**: TypeScript with strict mode enabled

## Application Architecture

### Core Components
- **App.tsx**: Main application component containing the interactive basketball court canvas
- **DraggableCircle**: Custom component for basketball icons that can be moved via long-press + drag gestures

### Data Models
The application uses TypeScript interfaces for basketball game data:
- **Game**: Contains game metadata (teams, officials, location, tipoff time)
- **PlayEvent**: Represents basketball events with coordinates, timestamps, and play types
- **Player/Team**: Basic entities for game participants
- **RuleSet**: Configurable game rules (periods, timeouts, fouls, etc.)

### Play Event System
Basketball events are categorized in `model/enums.ts`:
- Scoring plays (2PM, 3PM, FreeThrows)
- Defensive actions (Blocks, Steals, Rebounds)  
- Game flow events (Timeouts, Substitutions, Fouls)
- Violations (Traveling, Shot clock, etc.)

### Component Structure
```
components/
├── functional/     # Interactive components (GestureHandler)
├── layout/         # Layout components
└── ui/            # UI components (Timeline)
```

### Styling
- Global styles defined in `styles/globalStyle.ts`
- Common layout utilities (fullSize, allCenter, debug)
- Individual component styles using StyleSheet

## Key Features

1. **Interactive Canvas**: Tap anywhere to create basketball icons
2. **Drag Interactions**: Long-press + drag to move basketball icons
3. **Visual Feedback**: Selected items show stroke outline
4. **Clear Function**: Button to reset canvas
5. **SVG Integration**: Basketball icons loaded from assets/icons/

## Configuration Notes

- App configured for landscape orientation
- Uses new React Native architecture
- Babel configured with react-native-reanimated plugin
- TypeScript strict mode enabled