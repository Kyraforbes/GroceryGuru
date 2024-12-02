import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import { useRouter } from 'expo-router';

export default function Navigation() {
    const router = useRouter();
    return (
        <View style={styles.container}>
            <View style={styles.navButtonContainer}>
                <Button 
                    mode="contained" 
                    onPress={() => router.push('/habits')}
                    buttonColor="#663399" // Purple color
                >
                    My Habits
                </Button>
            </View>
            <View style={styles.navButtonContainer}>
                <Button 
                    mode="contained" 
                    onPress={() => router.push('/addHabit')}
                    buttonColor="#663399"
                >
                    Add Habit
                </Button>
            </View>
            <View style={styles.navButtonContainer}>
                <Button 
                    mode="contained" 
                    onPress={() => router.push('/progress')}
                    buttonColor="#663399"
                >
                    Progress
                </Button>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        padding: 8,
    },
    navButtonContainer: {
        flex: 1,
        margin: 8,
    },
});