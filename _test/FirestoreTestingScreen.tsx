import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Provider } from 'react-redux';
import { testStore } from './store';
import { FirestoreTestingCrudForm } from './FirestoreTestingCrudForm';

/**
 * Test screen with Redux Toolkit Provider for isolated testing
 *
 * This demonstrates:
 * - Redux Toolkit setup with configureStore
 * - Async thunks for Firestore operations
 * - Full CRUD operations (Create, Read, Update, Delete)
 * - Form state management
 * - Loading and error states
 *
 * To use this screen:
 * 1. Import it in your navigation/routing
 * 2. The Redux store is isolated to _test/ directory
 * 3. All data is stored in Firestore 'firestoreTesting' collection
 */
export default function FirestoreTestingScreen() {
  return (
    <Provider store={testStore}>
      <View style={styles.container}>
        <FirestoreTestingCrudForm />
      </View>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
