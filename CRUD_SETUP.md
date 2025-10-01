# CRUD Forms Setup Guide

This document explains how to use the React Native CRUD forms with Redux Toolkit and Firebase Firestore integration.

## 🚀 Features

- **Redux Toolkit** for modern state management with slices
- **Firebase Firestore** for cloud database operations
- **TypeScript** support with full type safety
- **Reusable form components** with validation
- **Automatic timestamp conversion** between Firestore and app
- **Form field types**: text, number, email, select, date, multiselect, boolean

## 📁 Project Structure

```
├── config/
│   └── firebase.ts              # Firebase configuration
├── store/
│   ├── index.ts                 # Redux store configuration
│   └── slices/
│       ├── baseCrudSlice.ts     # Reusable CRUD slice factory
│       ├── gameSlice.ts         # Game-specific Redux slice
│       ├── playerSlice.ts       # Player-specific Redux slice
│       └── ...                  # Other model slices
├── components/
│   └── forms/
│       ├── BaseCrudForm.tsx     # Reusable form component
│       ├── GameForm.tsx         # Game CRUD form
│       ├── PlayerForm.tsx       # Player CRUD form
│       └── ...                  # Other model forms
└── model/
    ├── game.ts                  # Game model with Zod validation
    ├── player.ts                # Player model with Zod validation
    └── ...                      # Other model definitions
```

## 🔧 Setup Instructions

### 1. Configure Firebase

Update `config/firebase.ts` with your Firebase project credentials:

```typescript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-auth-domain",
  projectId: "your-project-id",
  storageBucket: "your-storage-bucket",
  messagingSenderId: "your-messaging-sender-id",
  appId: "your-app-id"
};
```

### 2. Environment Variables

Create a `.env` file in your project root:

```env
EXPO_PUBLIC_FIREBASE_API_KEY=your-api-key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your-storage-bucket
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
EXPO_PUBLIC_FIREBASE_APP_ID=your-app-id
```

### 3. Redux Provider Integration

The Redux Provider is already integrated in `App.tsx`:

```typescript
import { Provider } from 'react-redux';
import { store } from './store';

export default function App() {
  return (
    <Provider store={store}>
      {/* Your app content */}
    </Provider>
  );
}
```

## 📝 Usage Examples

### Basic Form Usage

```typescript
import React from 'react';
import { PlayerForm } from './components/forms';

const MyComponent = () => {
  return (
    <PlayerForm 
      playerId="optional-existing-id" // For editing
      onSuccess={() => console.log('Form submitted!')}
    />
  );
};
```

### Using Redux Hooks

```typescript
import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from './store';
import { playerActions } from './store/slices/playerSlice';

const PlayerList = () => {
  const dispatch = useAppDispatch();
  const { items: players, loading } = useAppSelector(state => state.players);

  useEffect(() => {
    // Fetch all players
    dispatch(playerActions.fetchAll());
  }, [dispatch]);

  const createPlayer = () => {
    dispatch(playerActions.create({
      playerId: 'new-id',
      firstName: 'John',
      lastName: 'Doe',
      // ... other required fields
    }));
  };

  return (
    // Your component JSX
  );
};
```

### Form Field Types

The `BaseCrudForm` supports various field types:

```typescript
const formFields: FormField[] = [
  { name: 'firstName', label: 'First Name', type: 'text', required: true },
  { name: 'email', label: 'Email', type: 'email', required: true },
  { name: 'age', label: 'Age', type: 'number' },
  { name: 'birthDate', label: 'Birth Date', type: 'date' },
  { name: 'isActive', label: 'Active', type: 'boolean' },
  { 
    name: 'position', 
    label: 'Position', 
    type: 'select',
    options: [
      { label: 'Point Guard', value: 'PG' },
      { label: 'Shooting Guard', value: 'SG' }
    ]
  },
  { 
    name: 'skills', 
    label: 'Skills', 
    type: 'multiselect',
    options: [
      { label: 'Shooting', value: 'shooting' },
      { label: 'Defense', value: 'defense' }
    ]
  }
];
```

## 🎯 Available Forms

1. **GameForm** - Create/edit basketball games
2. **PlayerForm** - Manage player profiles
3. **TeamForm** - Team management
4. **UserForm** - User account management
5. **GameEventForm** - Game events (shots, fouls, etc.)
6. **LeagueForm** - League configuration
7. **NotificationForm** - User notifications
8. **PlayerStatForm** - Game statistics

## 🔄 CRUD Operations

Each form supports:
- **Create**: Add new records to Firestore
- **Read**: Fetch and display existing data
- **Update**: Modify existing records
- **Delete**: Remove records with confirmation

### Automatic Features
- **Validation**: Required field checking
- **Loading States**: UI feedback during operations
- **Error Handling**: Display error messages
- **Timestamp Management**: Automatic createdAt/updatedAt
- **Type Safety**: Full TypeScript support

## 🧪 Testing the Forms

Use the demo component to test all forms:

```typescript
import { CrudDemo } from './components/demo/CrudDemo';

// In your app
<CrudDemo />
```

## 🔧 Customization

### Adding New Models

1. Define your model in `model/yourModel.ts` using Zod
2. Create a Redux slice in `store/slices/yourModelSlice.ts`
3. Add to store in `store/index.ts`
4. Create form component in `components/forms/YourModelForm.tsx`

### Custom Form Fields

Extend the `FormField` type in `BaseCrudForm.tsx` to add new field types.

## 🚨 Important Notes

- Ensure Firebase rules allow read/write access for your collections
- The `createdAt` and `updatedAt` fields are managed automatically
- Nested object fields use dot notation (e.g., 'homeTeam.name')
- Arrays and complex objects are handled automatically
- All timestamps are converted between Firestore Timestamp and ISO strings

## 🎛️ Configuration

The CRUD system is highly configurable through:
- Field definitions in each form component
- Redux slice configurations
- Firebase collection names
- Form validation rules
- UI styling in form components