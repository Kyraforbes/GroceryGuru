import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Title, Paragraph, Button } from 'react-native-paper';
import Navigation from '../components/Navigation';

export default function Habits() {
    const [habits, setHabits] = useState([]);

    useEffect(() => {
        fetchHabits();
    }, []);

    const fetchHabits = async () => {
        try {
            const response = await fetch(`http://${process.env.EXPO_PUBLIC_PUBLIC_IP}:8000/api/habits/`);
            const data = await response.json();
            setHabits(data.habits || []);
        } catch (error) {
            console.error('Error fetching habits:', error);
        }
    };

    const markComplete = async (habitId) => {
        try {
            const response = await fetch(`http://${process.env.EXPO_PUBLIC_PUBLIC_IP}:8000/api/habits/${habitId}/log/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ completed: true })
            });
            if (response.ok) {
                // Refresh the habits list after marking complete
                fetchHabits();
            }
        } catch (error) {
            console.error('Error marking habit complete:', error);
        }
    };

    return (
        <View style={styles.container}>
            <Navigation />
            <ScrollView style={styles.content}>
                {habits.map((habit) => (
                    <Card key={habit.id} style={styles.card}>
                        <Card.Content>
                            <Title>{habit.name}</Title>
                            <Paragraph>Daily Goal: {habit.amount_per_day}</Paragraph>
                            <Paragraph>Target: {habit.target_days_per_week} days/week</Paragraph>
                        </Card.Content>
                        <Card.Actions>
                            <Button 
                                mode="contained"
                                buttonColor="#663399"
                                onPress={() => markComplete(habit.id)}
                            >
                                Mark Complete
                            </Button>
                        </Card.Actions>
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
    card: {
        marginBottom: 16,
    },
});