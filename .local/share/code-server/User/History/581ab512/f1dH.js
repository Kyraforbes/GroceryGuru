import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import Navigation from '../components/Navigation';
import { useRouter } from 'expo-router';

export default function AddHabit() {
  const router = useRouter();
  const [habit, setHabit] = useState({
    name: '',
    description: '',
    target_days_per_week: '7'
  });

  const handleSubmit = () => {
    // We'll add API call here later
    console.log('New habit:', habit);
    router.push('/');  // Go back to main habits page
  };

  return (
    <View style={styles.container}>
      <Navigation />
      <View style={styles.content}>
        <Text style={styles.title}>Add New Habit</Text>
        
        <TextInput
          label="Habit Name"
          value={habit.name}
          onChangeText={(text) => setHabit({ ...habit, name: text })}
          style={styles.input}
        />

        <TextInput
          label="Description"
          value={habit.description}
          onChangeText={(text) => setHabit({ ...habit, description: text })}
          style={styles.input}
          multiline
        />

        <TextInput
          label="Target Days per Week"
          value={habit.target_days_per_week}
          onChangeText={(text) => setHabit({ ...habit, target_days_per_week: text })}
          style={styles.input}
          keyboardType="numeric"
        />

        <Button mode="contained" onPress={handleSubmit} style={styles.button}>
          Add Habit
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
  },
});