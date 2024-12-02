import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Title, Text, ProgressBar, ActivityIndicator } from 'react-native-paper';
import { useSelector } from 'react-redux';
import Navigation from '../components/Navigation';

export default function Progress() {
    const { habits, loading } = useSelector(state => state.habits);

    if (loading) {
        return (
            <View style={[styles.container, styles.centered]}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Navigation />
            <ScrollView style={styles.content}>
                <Text style={styles.title}>Weekly Progress</Text>
                
                {habits.map((habit) => (
                    <Card key={habit.id} style={styles.card}>
                        <Card.Content>
                            <Title>{habit.name}</Title>
                            <Text>Target: {habit.target_days_per_week} days/week</Text>
                            <ProgressBar 
                                progress={0.5} // You'll need to calculate this based on logs
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