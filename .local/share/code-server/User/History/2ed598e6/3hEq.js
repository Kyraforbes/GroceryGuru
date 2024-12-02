import React, { useEffect, useState, Suspense } from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { Card, Title, Paragraph, Button, Text } from 'react-native-paper';
import Navigation from '../components/Navigation';

const LoadingFallback = () => (
    <View style={styles.loading}>
        <ActivityIndicator size="large" />
    </View>
);

export default function Habits() {
    const [habits, setHabits] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchHabits();
    }, []);

    const fetchHabits = async () => {
        try {
            setIsLoading(true);
            setError(null);
            // Log the URL being called
            const url = `http://${process.env.EXPO_PUBLIC_PUBLIC_IP}:8000/api/habits/`;
            console.log('Fetching from:', url);
            
            const response = await fetch(url);
            const data = await response.json();
            setHabits(data.habits || []);
        } catch (error) {
            console.error('Error fetching habits:', error);
            setError('Failed to load habits. Please try again.');
        } finally {
            setIsLoading(false);
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
                await fetchHabits();
            }
        } catch (error) {
            console.error('Error marking habit complete:', error);
        }
    };

    const content = () => {
        if (isLoading) {
            return <LoadingFallback />;
        }

        if (error) {
            return (
                <View style={styles.center}>
                    <Text style={styles.error}>{error}</Text>
                    <Button onPress={fetchHabits}>Try Again</Button>
                </View>
            );
        }

        if (habits.length === 0) {
            return (
                <View style={styles.center}>
                    <Text>No habits found. Add some habits to get started!</Text>
                </View>
            );
        }

        return (
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
        );
    };

    return (
        <Suspense fallback={<LoadingFallback />}>
            <View style={styles.container}>
                <Navigation />
                {content()}
            </View>
        </Suspense>
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
    loading: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    error: {
        color: 'red',
        marginBottom: 16,
    },
});