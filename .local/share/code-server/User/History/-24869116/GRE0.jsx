import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import { useRouter } from 'expo-router';

export default Navigation = () => {
    const router = useRouter();
    return (
        <View style={styles.container}>
            <View style={styles.navButtonContainer}>
                <Button mode="contained" onPress={() => router.push('/')}>
                    My Habits
                </Button>
            </View>
            <View style={styles.navButtonContainer}>
                <Button mode="contained" onPress={() => router.push('/addHabit')}>
                    Add Habit
                </Button>
            </View>
            <View style={styles.navButtonContainer}>
                <Button mode="contained" onPress={() => router.push('/progress')}>
                    Progress
                </Button>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
    },
    navButtonContainer: {
        flex: 1,
        margin: 8,
    },
});