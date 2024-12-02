import React, { useEffect } from 'react';
import { StyleSheet, FlatList, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Card, Text } from 'react-native-paper';
import Navigation from './Navigation';  // Make sure this path is correct

export default App = () => {
    const dispatch = useDispatch();
    
    // We'll need to create these in your Redux store
    const habits = useSelector(state => state.habits || []); 

    const renderItem = ({ item }) => (
        <Card style={styles.card}>
            <Card.Content>
                <View style={styles.row}>
                    <Text style={styles.label}>Habit: </Text>
                    <Text style={styles.value}>{item.name}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>Description: </Text>
                    <Text style={styles.value}>{item.description}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>Target Days: </Text>
                    <Text style={styles.value}>{item.target_days_per_week} days/week</Text>
                </View>
            </Card.Content>
        </Card>
    );

    return (
        <View style={styles.container}>
            <Navigation />
            <FlatList
                data={habits}
                keyExtractor={item => item.id.toString()}
                renderItem={renderItem}
                contentContainerStyle={styles.listContainer}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    listContainer: {
        paddingBottom: 20,
    },
    card: {
        marginBottom: 15,
        borderRadius: 8,
        elevation: 3,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    label: {
        fontWeight: 'bold',
        flex: 1,
    },
    value: {
        flex: 2,
        textAlign: 'left',
    },
});