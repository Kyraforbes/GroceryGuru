import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { useDispatch } from 'react-redux';
import Navigation from '../components/Navigation';
import { fetchHabits } from '../state/habitSlice';

export default App = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchHabits());
    }, []);

    return (
        <View style={styles.container}>
            <Navigation />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
});