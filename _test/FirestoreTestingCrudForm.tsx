import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { TestRootState, TestAppDispatch } from './store';
import {
  fetchAll,
  createItem,
  updateItem,
  deleteItem,
  selectItem,
} from './firestoreTestingSlice';
import { FirestoreTesting } from './FirestoreTesting';

export const FirestoreTestingCrudForm: React.FC = () => {
  const dispatch = useDispatch<TestAppDispatch>();
  const { items, selectedItem, loading, error } = useSelector(
    (state: TestRootState) => state.firestoreTesting
  );

  // Form state
  const [stringField, setStringField] = useState('');
  const [arrayStringField1, setArrayStringField1] = useState('');
  const [arrayIntField1, setArrayIntField1] = useState('');
  const [arrayStringField2, setArrayStringField2] = useState('');
  const [arrayIntField2, setArrayIntField2] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  // Load all items on mount
  useEffect(() => {
    dispatch(fetchAll());
  }, [dispatch]);

  // Populate form when item is selected
  useEffect(() => {
    if (selectedItem) {
      setStringField(selectedItem.stringField);
      setArrayStringField1(selectedItem.arrayExample[0]?.arrayStringField || '');
      setArrayIntField1(selectedItem.arrayExample[0]?.arrayIntField || '');
      setArrayStringField2(selectedItem.arrayExample[1]?.arrayStringField || '');
      setArrayIntField2(selectedItem.arrayExample[1]?.arrayIntField || '');
      setIsEditing(true);
    }
  }, [selectedItem]);

  const resetForm = () => {
    setStringField('');
    setArrayStringField1('');
    setArrayIntField1('');
    setArrayStringField2('');
    setArrayIntField2('');
    setIsEditing(false);
    dispatch(selectItem(null));
  };

  const handleSubmit = async () => {
    if (!stringField.trim()) {
      Alert.alert('Error', 'String field is required');
      return;
    }

    const formData: Omit<FirestoreTesting, 'id'> = {
      stringField,
      dateField: new Date().toISOString(),
      arrayExample: [
        {
          arrayStringField: arrayStringField1,
          arrayIntField: arrayIntField1,
        },
        {
          arrayStringField: arrayStringField2,
          arrayIntField: arrayIntField2,
        },
      ],
    };

    try {
      if (isEditing && selectedItem) {
        await dispatch(updateItem({ id: selectedItem.id, data: formData })).unwrap();
        Alert.alert('Success', 'Item updated successfully');
      } else {
        await dispatch(createItem(formData)).unwrap();
        Alert.alert('Success', 'Item created successfully');
      }
      resetForm();
      dispatch(fetchAll());
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Operation failed');
    }
  };

  const handleEdit = (item: FirestoreTesting) => {
    dispatch(selectItem(item));
  };

  const handleDelete = async (id: string) => {
    Alert.alert('Confirm Delete', 'Are you sure you want to delete this item?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await dispatch(deleteItem(id)).unwrap();
            Alert.alert('Success', 'Item deleted successfully');
            dispatch(fetchAll());
          } catch (err: any) {
            Alert.alert('Error', err.message || 'Delete failed');
          }
        },
      },
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Firestore Testing CRUD</Text>

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {/* Form */}
      <View style={styles.formSection}>
        <Text style={styles.sectionTitle}>
          {isEditing ? 'Edit Item' : 'Create New Item'}
        </Text>

        <Text style={styles.label}>String Field *</Text>
        <TextInput
          style={styles.input}
          value={stringField}
          onChangeText={setStringField}
          placeholder="Enter string value"
        />

        <Text style={styles.label}>Array Item 1 - String Field</Text>
        <TextInput
          style={styles.input}
          value={arrayStringField1}
          onChangeText={setArrayStringField1}
          placeholder="Array item 1 string"
        />

        <Text style={styles.label}>Array Item 1 - Int Field</Text>
        <TextInput
          style={styles.input}
          value={arrayIntField1}
          onChangeText={setArrayIntField1}
          placeholder="Array item 1 int"
          keyboardType="numeric"
        />

        <Text style={styles.label}>Array Item 2 - String Field</Text>
        <TextInput
          style={styles.input}
          value={arrayStringField2}
          onChangeText={setArrayStringField2}
          placeholder="Array item 2 string"
        />

        <Text style={styles.label}>Array Item 2 - Int Field</Text>
        <TextInput
          style={styles.input}
          value={arrayIntField2}
          onChangeText={setArrayIntField2}
          placeholder="Array item 2 int"
          keyboardType="numeric"
        />

        <View style={styles.buttonRow}>
          <Pressable
            style={[styles.button, styles.primaryButton]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>
                {isEditing ? 'Update' : 'Create'}
              </Text>
            )}
          </Pressable>

          {isEditing && (
            <Pressable
              style={[styles.button, styles.secondaryButton]}
              onPress={resetForm}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </Pressable>
          )}
        </View>
      </View>

      {/* Items List */}
      <View style={styles.listSection}>
        <Text style={styles.sectionTitle}>All Items ({items.length})</Text>

        {loading && items.length === 0 ? (
          <ActivityIndicator size="large" color="#007AFF" />
        ) : items.length === 0 ? (
          <Text style={styles.emptyText}>No items yet. Create one above!</Text>
        ) : (
          items.map((item) => (
            <View key={item.id} style={styles.itemCard}>
              <View style={styles.itemHeader}>
                <Text style={styles.itemId}>ID: {item.id}</Text>
                <Text style={styles.itemDate}>
                  {new Date(item.dateField).toLocaleString()}
                </Text>
              </View>

              <Text style={styles.itemField}>
                String: <Text style={styles.itemValue}>{item.stringField}</Text>
              </Text>

              <Text style={styles.itemField}>Array Items:</Text>
              {item.arrayExample.map((arrayItem, idx) => (
                <View key={idx} style={styles.arrayItem}>
                  <Text style={styles.arrayItemText}>
                    {idx + 1}. {arrayItem.arrayStringField} - {arrayItem.arrayIntField}
                  </Text>
                </View>
              ))}

              <View style={styles.itemActions}>
                <Pressable
                  style={[styles.button, styles.editButton]}
                  onPress={() => handleEdit(item)}
                >
                  <Text style={styles.buttonText}>Edit</Text>
                </Pressable>

                <Pressable
                  style={[styles.button, styles.deleteButton]}
                  onPress={() => handleDelete(item.id)}
                >
                  <Text style={styles.buttonText}>Delete</Text>
                </Pressable>
              </View>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  errorContainer: {
    backgroundColor: '#ffebee',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    color: '#c62828',
    fontSize: 14,
  },
  formSection: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
    color: '#555',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  button: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButton: {
    backgroundColor: '#007AFF',
  },
  secondaryButton: {
    backgroundColor: '#999',
  },
  editButton: {
    backgroundColor: '#4CAF50',
  },
  deleteButton: {
    backgroundColor: '#dc3545',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  listSection: {
    marginBottom: 32,
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    fontSize: 16,
    fontStyle: 'italic',
    marginTop: 20,
  },
  itemCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  itemId: {
    fontSize: 12,
    color: '#999',
    fontFamily: 'monospace',
  },
  itemDate: {
    fontSize: 12,
    color: '#999',
  },
  itemField: {
    fontSize: 14,
    color: '#555',
    marginBottom: 4,
    fontWeight: '600',
  },
  itemValue: {
    fontWeight: 'normal',
    color: '#333',
  },
  arrayItem: {
    backgroundColor: '#f8f9fa',
    padding: 8,
    borderRadius: 6,
    marginBottom: 4,
    marginLeft: 12,
  },
  arrayItemText: {
    fontSize: 13,
    color: '#555',
  },
  itemActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
});
