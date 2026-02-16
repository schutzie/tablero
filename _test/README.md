# Redux Toolkit + Firestore CRUD Example

This directory contains a **complete, isolated example** of using Redux Toolkit with Firestore for CRUD operations.

## Files Overview

### 1. **FirestoreTesting.ts**
Zod schema definition for data validation
- Uses Zod v4 syntax (`z.iso` for dates)
- Defines TypeScript types

### 2. **firestoreService.ts**
Firestore database operations
- `createFirestoreTesting()` - Add new document
- `getAllFirestoreTesting()` - Fetch all documents
- `getFirestoreTestingById()` - Fetch single document
- `updateFirestoreTesting()` - Update existing document
- `deleteFirestoreTesting()` - Remove document

### 3. **firestoreTestingSlice.ts**
Redux Toolkit slice with async thunks
- **State**: `items`, `selectedItem`, `loading`, `error`
- **Async Thunks**:
  - `fetchAll` - Load all items
  - `fetchById` - Load single item
  - `createItem` - Create new item
  - `updateItem` - Update existing item
  - `deleteItem` - Delete item
- **Reducers**:
  - `selectItem` - Select item for editing
  - `clearError` - Clear error state

### 4. **store.ts**
Redux Toolkit store configuration
- Uses `configureStore` (not legacy `createStore`)
- Exports TypeScript types for state and dispatch

### 5. **FirestoreTestingCrudForm.tsx**
React Native CRUD form component
- Create/Edit form with validation
- List view of all items
- Edit and Delete actions
- Loading and error states

### 6. **FirestoreTestingScreen.tsx**
Main screen component with Provider
- Wraps the form with Redux `Provider`
- Entry point for testing

## How to Use

### Option 1: Add to Navigation
```typescript
// In your app/(tabs)/_layout.tsx or similar
import FirestoreTestingScreen from '../../_test/FirestoreTestingScreen';

// Add to your tabs/stack
<Tabs.Screen
  name="firestore-test"
  options={{ title: 'Firestore Test' }}
/>

// In app/(tabs)/firestore-test.tsx
export { default } from '../../_test/FirestoreTestingScreen';
```

### Option 2: Direct Import
```typescript
import FirestoreTestingScreen from './_test/FirestoreTestingScreen';

// Use in your component tree
<FirestoreTestingScreen />
```

## Key Redux Toolkit Concepts Demonstrated

### 1. **configureStore** (Modern Redux)
```typescript
export const testStore = configureStore({
  reducer: {
    firestoreTesting: firestoreTestingReducer,
  },
});
```

### 2. **createSlice** (Combines actions + reducers)
```typescript
const firestoreTestingSlice = createSlice({
  name: 'firestoreTesting',
  initialState,
  reducers: { /* sync actions */ },
  extraReducers: (builder) => { /* async thunk handlers */ },
});
```

### 3. **createAsyncThunk** (Async operations)
```typescript
export const createItem = createAsyncThunk(
  'firestoreTesting/create',
  async (data: Omit<FirestoreTesting, 'id'>) => {
    return await firestoreService.createFirestoreTesting(data);
  }
);
```

### 4. **TypeScript Support**
```typescript
export type TestRootState = ReturnType<typeof testStore.getState>;
export type TestAppDispatch = typeof testStore.dispatch;

// In component:
const dispatch = useDispatch<TestAppDispatch>();
const { items } = useSelector((state: TestRootState) => state.firestoreTesting);
```

## Firestore Collection

Data is stored in: **`firestoreTesting`** collection

Document structure:
```json
{
  "id": "auto-generated-id",
  "stringField": "someString",
  "dateField": "2026-01-31T15:14:01.123456Z",
  "arrayExample": [
    { "arrayStringField": "string1", "arrayIntField": "874913" },
    { "arrayStringField": "string2", "arrayIntField": "111222333" }
  ]
}
```

## Notes

- This is **isolated from the main app** (no conflicts with removed Redux)
- Uses **Redux Toolkit** (modern Redux, not legacy)
- TypeScript strict mode compatible
- Includes proper error handling
- Loading states for better UX
- Form validation with alerts

## Why Redux Toolkit?

Redux Toolkit is the **official recommended way** to write Redux:
- Less boilerplate than classic Redux
- Built-in best practices
- Better TypeScript support
- Includes Redux Thunk by default
- Simpler store configuration
