import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export const GameSessionManager: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [sessionTime, setSessionTime] = useState('00:00');

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // TODO: Implement actual recording logic
    console.log(isRecording ? 'Stopping session' : 'Starting session');
  };

  return (
    <View style={styles.container}>
      <View style={styles.sessionInfo}>
        <Text style={styles.title}>Basketball Court</Text>
        <Text style={styles.timer}>{sessionTime}</Text>
      </View>
      
      <View style={styles.controls}>
        <Pressable 
          style={({ pressed }) => [
            styles.recordButton, 
            isRecording && styles.recordingActive,
            pressed && styles.buttonPressed
          ]}
          onPress={toggleRecording}
        >
          <MaterialIcons 
            name={isRecording ? "stop" : "fiber-manual-record"} 
            size={24} 
            color="#fff" 
          />
          <Text style={styles.buttonText}>
            {isRecording ? 'Stop' : 'Record'}
          </Text>
        </Pressable>
        
        <Pressable 
          style={({ pressed }) => [
            styles.iconButton,
            pressed && styles.buttonPressed
          ]}
        >
          <MaterialIcons name="save" size={24} color="#666" />
        </Pressable>
        
        <Pressable 
          style={({ pressed }) => [
            styles.iconButton,
            pressed && styles.buttonPressed
          ]}
        >
          <MaterialIcons name="settings" size={24} color="#666" />
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  sessionInfo: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  timer: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  recordButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  recordingActive: {
    backgroundColor: '#FF3B30',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  iconButton: {
    padding: 8,
  },
  buttonPressed: {
    opacity: 0.7,
  },
});