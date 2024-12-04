// RegisterPage.js
import { StyleSheet, Text, TextInput, View, Button } from 'react-native';

export default function RegisterPage() {
  const handleSignUp = () => {
    // Handle sign-up logic here
    alert('Sign Up button pressed');
  };

  return (
    <View style={styles.container}>
      {/* Heading */}
      <Text style={styles.heading}>Grocery Guru</Text>

      {/* Subheading */}
      <Text style={styles.subheading}>Grocery Shopping and Meal Prep meets AI</Text>

      {/* Card with form */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Get Started</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none"
        />
        
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
        />
        
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          secureTextEntry
        />

        {/* Sign up button */}
        <Button title="Sign Up" onPress={handleSignUp} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 20,
  },
  heading: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 10,
  },
  subheading: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 30,
    color: '#555',
  },
  card: {
    backgroundColor: '#fff',
    width: '100%',
    maxWidth: 400,
    padding: 20,
    borderRadius: 15,
    elevation: 5,  // Adds shadow for Android
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 2 }, // iOS shadow
    shadowOpacity: 0.25, // iOS shadow
    shadowRadius: 3.5, // iOS shadow
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingLeft: 10,
    width: '100%',
  },
});