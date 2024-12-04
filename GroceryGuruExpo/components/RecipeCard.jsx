import React from 'react';
import { StyleSheet, Text, View, ImageBackground } from 'react-native';

const RecipeCard = ({ imageUrl, title }) => {
  return (
    <View style={styles.card}>
      <ImageBackground source={{ uri: imageUrl }} style={styles.backgroundImage} imageStyle={styles.imageStyle}>
        <View style={styles.overlay}>
          <Text style={styles.title}>{title}</Text>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    height: 150,
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 20,
  },
  backgroundImage: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  imageStyle: {
    borderRadius: 10,
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Transparent overlay
    padding: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
  },
});

export default RecipeCard;