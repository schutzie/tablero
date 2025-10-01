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
import { Picker } from '@react-native-picker/picker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'number' | 'email' | 'select' | 'date' | 'multiselect' | 'boolean';
  required?: boolean;
  options?: { label: string; value: string | number | boolean }[];
  placeholder?: string;
  multiline?: boolean;
}

interface BaseCrudFormProps<T> {
  fields: FormField[];
  initialValues?: Partial<T>;
  onSubmit: (data: Partial<T>) => void;
  onDelete?: (id: string) => void;
  loading: boolean;
  error: string | null;
  submitLabel?: string;
  title: string;
  isEditing?: boolean;
  idField?: string;
}

export function BaseCrudForm<T extends Record<string, any>>({
  fields,
  initialValues,
  onSubmit,
  onDelete,
  loading,
  error,
  submitLabel = 'Submit',
  title,
  isEditing = false,
  idField = 'id',
}: BaseCrudFormProps<T>) {
  const [formData, setFormData] = useState<Partial<T>>(initialValues || {});
  const [showDatePicker, setShowDatePicker] = useState<string | null>(null);

  useEffect(() => {
    if (initialValues) {
      setFormData(initialValues);
    }
  }, [initialValues]);

  const handleSubmit = () => {
    const requiredFields = fields.filter(field => field.required);
    const missingFields = requiredFields.filter(field => !formData[field.name]);
    
    if (missingFields.length > 0) {
      Alert.alert('Error', `Please fill in required fields: ${missingFields.map(f => f.label).join(', ')}`);
      return;
    }
    
    onSubmit(formData);
  };

  const handleDelete = () => {
    if (onDelete && formData[idField]) {
      Alert.alert(
        'Confirm Delete',
        'Are you sure you want to delete this item?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Delete', style: 'destructive', onPress: () => onDelete(formData[idField] as string) }
        ]
      );
    }
  };

  const renderField = (field: FormField) => {
    const value = formData[field.name];

    switch (field.type) {
      case 'text':
      case 'email':
        return (
          <TextInput
            style={styles.input}
            value={value?.toString() || ''}
            onChangeText={(text) => setFormData(prev => ({ ...prev, [field.name]: text }))}
            placeholder={field.placeholder || field.label}
            keyboardType={field.type === 'email' ? 'email-address' : 'default'}
            multiline={field.multiline}
            numberOfLines={field.multiline ? 3 : 1}
          />
        );

      case 'number':
        return (
          <TextInput
            style={styles.input}
            value={value?.toString() || ''}
            onChangeText={(text) => {
              const num = parseFloat(text);
              setFormData(prev => ({ ...prev, [field.name]: isNaN(num) ? 0 : num }));
            }}
            placeholder={field.placeholder || field.label}
            keyboardType="numeric"
          />
        );

      case 'select':
        return (
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={value}
              onValueChange={(itemValue) => setFormData(prev => ({ ...prev, [field.name]: itemValue }))}
              style={styles.picker}
            >
              <Picker.Item label={`Select ${field.label}`} value="" />
              {field.options?.map(option => (
                <Picker.Item key={option.value.toString()} label={option.label} value={option.value} />
              ))}
            </Picker>
          </View>
        );

      case 'date':
        return (
          <>
            <Pressable
              style={({ pressed }) => [
                styles.dateButton,
                pressed && styles.buttonPressed
              ]}
              onPress={() => setShowDatePicker(field.name)}
            >
              <Text style={styles.dateButtonText}>
                {value ? new Date(value).toLocaleDateString() : `Select ${field.label}`}
              </Text>
            </Pressable>
            <DateTimePickerModal
              isVisible={showDatePicker === field.name}
              mode="date"
              onConfirm={(date) => {
                setFormData(prev => ({ ...prev, [field.name]: date.toISOString() }));
                setShowDatePicker(null);
              }}
              onCancel={() => setShowDatePicker(null)}
            />
          </>
        );

      case 'boolean':
        return (
          <View style={styles.checkboxContainer}>
            <Pressable
              style={({ pressed }) => [
                styles.checkbox,
                value && styles.checkboxChecked,
                pressed && styles.buttonPressed
              ]}
              onPress={() => setFormData(prev => ({ ...prev, [field.name]: !value }))}
            >
              {value && <Text style={styles.checkboxText}>✓</Text>}
            </Pressable>
            <Text style={styles.checkboxLabel}>{field.label}</Text>
          </View>
        );

      case 'multiselect':
        return (
          <View>
            <Text style={styles.multiselectLabel}>{field.label}:</Text>
            {field.options?.map(option => {
              const isSelected = Array.isArray(value) && value.includes(option.value);
              return (
                <Pressable
                  key={option.value.toString()}
                  style={({ pressed }) => [
                    styles.multiselectOption,
                    isSelected && styles.multiselectOptionSelected,
                    pressed && styles.buttonPressed
                  ]}
                  onPress={() => {
                    const currentValues = Array.isArray(value) ? value : [];
                    const newValues = isSelected
                      ? currentValues.filter(v => v !== option.value)
                      : [...currentValues, option.value];
                    setFormData(prev => ({ ...prev, [field.name]: newValues }));
                  }}
                >
                  <Text style={[styles.multiselectText, isSelected && styles.multiselectTextSelected]}>
                    {option.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {fields.map(field => (
        <View key={field.name} style={styles.fieldContainer}>
          <Text style={styles.label}>
            {field.label} {field.required && <Text style={styles.required}>*</Text>}
          </Text>
          {renderField(field)}
        </View>
      ))}

      <View style={styles.buttonContainer}>
        <Pressable
          style={({ pressed }) => [
            styles.button,
            styles.submitButton,
            pressed && styles.buttonPressed,
            loading && styles.buttonDisabled
          ]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>{submitLabel}</Text>
          )}
        </Pressable>

        {isEditing && onDelete && (
          <Pressable
            style={({ pressed }) => [
              styles.button,
              styles.deleteButton,
              pressed && styles.buttonPressed,
              loading && styles.buttonDisabled
            ]}
            onPress={handleDelete}
            disabled={loading}
          >
            <Text style={styles.buttonText}>Delete</Text>
          </Pressable>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  fieldContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    color: '#333',
  },
  required: {
    color: '#ff0000',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  picker: {
    height: 50,
  },
  dateButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#fff',
  },
  dateButtonText: {
    fontSize: 16,
    color: '#333',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius: 4,
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  checkboxText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  checkboxLabel: {
    fontSize: 16,
    color: '#333',
  },
  multiselectLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    color: '#333',
  },
  multiselectOption: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 4,
    backgroundColor: '#fff',
  },
  multiselectOptionSelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  multiselectText: {
    fontSize: 16,
    color: '#333',
  },
  multiselectTextSelected: {
    color: '#fff',
  },
  buttonContainer: {
    marginTop: 20,
    gap: 12,
  },
  button: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButton: {
    backgroundColor: '#007AFF',
  },
  deleteButton: {
    backgroundColor: '#ff3333',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
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
  buttonPressed: {
    opacity: 0.8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});