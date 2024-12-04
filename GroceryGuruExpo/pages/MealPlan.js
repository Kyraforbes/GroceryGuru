import { StyleSheet, Text, View } from 'react-native';

export default function MealPlan() {
  return (
    <View style={styles.container}>
      <Text>Page Content Goes Here</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});