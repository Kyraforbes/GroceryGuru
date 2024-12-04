import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

export const CustomInput = ({ label, value, onChangeText, placeholder, keyboardType = 'default', error }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, error && styles.inputError]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        keyboardType={keyboardType}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
  },
  inputError: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    marginTop: 5,
    fontSize: 14,
  },
});
