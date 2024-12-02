import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Title, Paragraph, Button, ProgressBar } from 'react-native-paper';
import Navigation from '../components/Navigation';

export default function Progress() {
    const [habits, setHabits] = useState([]);
    const [logs, setLogs] = useState({});

    useEffect(() => {
        fetchHabits();
    }, []);

    const fetchHabits = async () => {
        try {
            const response = await fetch(`http://${process.env.EXPO_PUBLIC_PUBLIC_IP}:8000/api/habits/`);
            const data = await response.json();
            setHabits(data.habits || []);
            
            // Fetch logs for each habit
            data.habits.forEach(habit => fetchHabitLogs(habit.id));
        } catch (error) {
            console.error('Error fetching habits:', error);
        }
    };

    const fetchHabitLogs = async (habitId) => {
        try {
            const response = await fetch(`http://${process.env.EXPO_PUBLIC_PUBLIC_IP}:8000/api/habits/${habitId}/log/`);
            const data = await response.json();
            setLogs(prev => ({
                ...prev,
                [habitId]: data.logs || []
            }));
        } catch (error) {
            console.error('Error fetching logs:', error);
        }
    };

    // Calculate completion rate for the current week
    const getCompletionRate = (habitId) => {
        const habitLogs = logs[habitId] || [];
        const completedDays = habitLogs.filter(log => log.completed).length;
        const habit = habits.find(h => h.id === habitId);
        return habit ? completedDays / habit.target_days_per_week : 0;
    };

    return (
        <View style={styles.container}>
            <Navigation />
            <ScrollView style={styles.content}>
                <Title style={styles.title}>Weekly Progress</Title>
                {habits.map((habit) => (
                    <Card key={habit.id} style={styles.card}>
                        <Card.Content>
                            <Title>{habit.name}</Title>
                            <Paragraph>Target: {habit.target_days_per_week} days/week</Paragraph>
                            <Paragraph>Daily Goal: {habit.amount_per_day}</Paragraph>
                            <ProgressBar 
                                progress={getCompletionRate(habit.id)}
                                color="#663399"
                                style={styles.progressBar}
                            />
                            <Paragraph style={styles.progressText}>
                                {Math.round(getCompletionRate(habit.id) * 100)}% Complete
                            </Paragraph>
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
        height: 10,
        borderRadius: 5,
        marginVertical: 8,
    },
    progressText: {
        textAlign: 'center',
        marginTop: 4,
    }
});