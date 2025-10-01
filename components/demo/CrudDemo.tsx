import React, { useState } from 'react';
import { 
  View, 
  Text, 
  Pressable, 
  StyleSheet, 
  ScrollView 
} from 'react-native';
import { 
  GameForm, 
  PlayerForm, 
  TeamForm, 
  UserForm, 
  GameEventForm,
  LeagueForm,
  NotificationForm,
  PlayerStatForm 
} from '../forms';

export const CrudDemo: React.FC = () => {
  const [selectedForm, setSelectedForm] = useState<string | null>(null);

  const forms = [
    { key: 'game', label: 'Game', component: GameForm },
    { key: 'player', label: 'Player', component: PlayerForm },
    { key: 'team', label: 'Team', component: TeamForm },
    { key: 'user', label: 'User', component: UserForm },
    { key: 'gameEvent', label: 'Game Event', component: GameEventForm },
    { key: 'league', label: 'League', component: LeagueForm },
    { key: 'notification', label: 'Notification', component: NotificationForm },
    { key: 'playerStat', label: 'Player Stats', component: PlayerStatForm },
  ];

  const renderForm = () => {
    const form = forms.find(f => f.key === selectedForm);
    if (!form) return null;

    const FormComponent = form.component;
    return (
      <FormComponent 
        onSuccess={() => {
          console.log(`${form.label} form submitted successfully`);
          setSelectedForm(null);
        }}
      />
    );
  };

  if (selectedForm) {
    return (
      <View style={styles.container}>
        <Pressable 
          style={({ pressed }) => [
            styles.backButton,
            pressed && styles.buttonPressed
          ]} 
          onPress={() => setSelectedForm(null)}
        >
          <Text style={styles.backButtonText}>← Back to Forms</Text>
        </Pressable>
        {renderForm()}
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>CRUD Forms Demo</Text>
      <Text style={styles.subtitle}>
        Select a form to test CRUD operations with Firebase Firestore
      </Text>
      
      <View style={styles.formGrid}>
        {forms.map((form) => (
          <Pressable
            key={form.key}
            style={({ pressed }) => [
              styles.formButton,
              pressed && styles.buttonPressed
            ]}
            onPress={() => setSelectedForm(form.key)}
          >
            <Text style={styles.formButtonText}>{form.label}</Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.infoTitle}>Features:</Text>
        <Text style={styles.infoText}>✅ Redux Toolkit for state management</Text>
        <Text style={styles.infoText}>✅ Firebase Firestore integration</Text>
        <Text style={styles.infoText}>✅ Full CRUD operations (Create, Read, Update, Delete)</Text>
        <Text style={styles.infoText}>✅ Form validation</Text>
        <Text style={styles.infoText}>✅ TypeScript support</Text>
        <Text style={styles.infoText}>✅ Responsive form components</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    color: '#666',
  },
  formGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  formButton: {
    width: '48%',
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  formButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  backButton: {
    backgroundColor: '#666',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  infoContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  infoText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 8,
    lineHeight: 20,
  },
  buttonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
});