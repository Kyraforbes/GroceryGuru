import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { useRouter } from 'expo-router';
import Navigation from '../components/Navigation';

export default function AddHabit() {
    const router = useRouter();
    const [habit, setHabit] = useState({
        name: '',
        amount_per_day: '',
        target_days_per_week: '7'
    });

    const handleSubmit = async () => {
        try {
            const response = await fetch(`http://${process.env.EXPO_PUBLIC_PUBLIC_IP}:8000/api/habits/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: habit.name,
                    amount_per_day: parseInt(habit.amount_per_day),
                    target_days_per_week: parseInt(habit.target_days_per_week)
                })
            });

            if (response.ok) {
                router.push('/habits');
            } else {
                console.error('Failed to create habit');
            }
        } catch (error) {
            console.error('Error:', error);
        }
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
                    label="Amount Per Day"
                    value={habit.amount_per_day}
                    onChangeText={(text) => setHabit({ ...habit, amount_per_day: text })}
                    style={styles.input}
                    keyboardType="numeric"
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