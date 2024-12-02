import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Title, Text, Button } from 'react-native-paper';
import Navigation from '../components/Navigation';

export default function Habits() {
  // This is placeholder data - we'll connect to your Django API later
  const habits = [
    { id: 1, name: 'Exercise', description: '30 minutes daily', target_days_per_week: 5 },
    { id: 2, name: 'Read', description: 'Read a book', target_days_per_week: 7 },
  ];

  return (
    <View style={styles.container}>
      <Navigation />
      <View style={styles.content}>
        {habits.map((habit) => (
          <Card key={habit.id} style={styles.card}>
            <Card.Content>
              <Title>{habit.name}</Title>
              <Text>{habit.description}</Text>
              <Text>Target: {habit.target_days_per_week} days/week</Text>
            </Card.Content>
            <Card.Actions>
              <Button onPress={() => console.log('Mark complete')}>Mark Complete</Button>
            </Card.Actions>
          </Card>
        ))}
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
  card: {
    marginBottom: 16,
  },
});