import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Title, Text, Button, ActivityIndicator } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
import Navigation from '../components/Navigation';
import { logHabitCompletion } from '../state/habitSlice';

export default function Habits() {
    const dispatch = useDispatch();
    const { habits, loading, error } = useSelector(state => state.habits);

    const handleMarkComplete = (habitId) => {
        dispatch(logHabitCompletion({ 
            habitId, 
            completed: true,
            notes: 'Completed via app'
        }));
    };

    if (loading) {
        return (
            <View style={[styles.container, styles.centered]}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    if (error) {
        return (
            <View style={[styles.container, styles.centered]}>
                <Text>Error: {error}</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Navigation />
            <ScrollView style={styles.content}>
                {habits.map((habit) => (
                    <Card key={habit.id} style={styles.card}>
                        <Card.Content>
                            <Title>{habit.name}</Title>
                            <Text>{habit.description}</Text>
                            <Text>Target: {habit.target_days_per_week} days/week</Text>
                        </Card.Content>
                        <Card.Actions>
                            <Button 
                                onPress={() => handleMarkComplete(habit.id)}
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
    centered: {
        justifyContent: 'center',
        alignItems: 'center',
    },
});