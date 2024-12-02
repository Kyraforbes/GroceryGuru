import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Title, Text, ProgressBar } from 'react-native-paper';
import Navigation from '../components/Navigation';

export default function Progress() {
  // Placeholder data - we'll connect to API later
  const habitProgress = [
    { 
      id: 1, 
      name: 'Exercise', 
      target: 5,
      completed: 3,
      weekProgress: 0.6 
    },
    { 
      id: 2, 
      name: 'Read', 
      target: 7,
      completed: 5,
      weekProgress: 0.7 
    },
  ];

  return (
    <View style={styles.container}>
      <Navigation />
      <ScrollView style={styles.content}>
        <Text style={styles.title}>Weekly Progress</Text>
        
        {habitProgress.map((habit) => (
          <Card key={habit.id} style={styles.card}>
            <Card.Content>
              <Title>{habit.name}</Title>
              <Text>Target: {habit.target} days/week</Text>
              <Text>Completed: {habit.completed} days</Text>
              <ProgressBar 
                progress={habit.weekProgress} 
                style={styles.progressBar}
              />
            </Card.Content>
          </Card>
        ))}
      </ScrollView>
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
  card: {
    marginBottom: 16,
  },
  progressBar: {
    marginTop: 8,
    height: 10,
  },
});