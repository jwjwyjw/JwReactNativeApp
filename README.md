# Notes App

React Native notes application built with Expo and TypeScript.

- SDK version: 54.0.0
- Runtime version: exposdk:54.0.0

APK Download: 
https://drive.google.com/file/d/1TeDrFu6_vZWHroB-9tXeCLN-UHhra7AR/view?usp=sharing

Web Version (iOS dimensions, no Apple Developer account required):
https://mercumemo.netlify.app 

---

## High-Level Overview

### Core Screens

- **Home Page**
- Shows latest 3 notes per category
- Notes sorted by most recent activity (creation or edit)
- Displays first 20 characters of each note
- Auto-refreshes when you return to the page
- Pull-to-refresh to update notes
- Delete or edit individual notes

- **New Note Page** 
- create notes
- 200 character limit enforcement
- Real-time character counter
Input validation as below:
- Cannot save without selecting category
- Cannot save empty note
- Cannot exceed 200 characters
- Keyboard-aware layout (adjusts when keyboard appears)
- Success feedback via modal/toast

- **Summary Page** 
– statistics (counts) 
- view all notes in detail button
- delete or edit individual notes

- **Settings Page** 
– delete all app local notes
- export/share notes (not affected by the deletion in app)

### Tech Stack

- **Framework**: React Native with Expo
- **Language**: TypeScript
- **Navigation**: Expo Router (file-based routing)
- **Storage**: @react-native-async-storage/async-storage
- **File/Sharing**: expo-file-system (legacy), expo-sharing
- **Icons/Assets**: @expo/vector-icons, image assets

- **Export & Share Section**
  - "Export notes (file)" option – saves all notes to a local `.txt` file using the filesystem API
  - "Share notes" option – opens the native share sheet so the export can be saved to Files / Drive / email, etc.

## Project Structure

MercuMemo/
├── app/
│   ├── (tabs)/
│   │   ├── index.tsx          # Home page
│   │   ├── two.tsx            # Summary page
│   │   ├── add-note.tsx       # Add new note page
│   │   └── _layout.tsx        # Tab navigation layout
│   ├── new-note.tsx           # New note creation page
│   ├── category-notes.tsx      # View all notes for each catogories
│   ├── note/[id].tsx          # Edit note page
│   ├── settings.tsx           # Settings page
│   └── _layout.tsx            # Root layout
├── components/                # Reusable UI components
├── assets/
├── constants/
├── types/
│   └── note.ts                # TypeScript interfaces and enums
├── services/
│   ├── noteStorage.ts         # Data persistence service
│   └── exportService.ts       # Notes export/share service
├── README.md
├── theme.ts
└── package.json
```

---

## Installation & Running

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npx expo start
```

3. Optional platform shortcuts:

```bash
npm run android  # Android
npm run ios      # iOS
npm run web      # Web
```

Use Expo Go (or simulators) to open the app.

### Export & External Copies

- Export notes to a `.txt` file via `ExportService.exportAsFile()`
- Share notes export via native share sheet (`ExportService.shareViaShareSheet()`)
- Exported copies live outside AsyncStorage and **survive Delete All Notes**

> **Note about links in a real backend scenario**  
> The original requirement mentions opening remaining notes via different browser links. In this local-only version, notes are saved to a text file and shared via the system share sheet. In a production app with a backend, each note would typically have its own https:// URL. This version focuses on local persistence and export, keeping exported data independent of the in-app Delete All action.
