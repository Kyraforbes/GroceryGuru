import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import RecipeCard from '../components/RecipeCard';

export default function MyMeals() {
  const [expanded, setExpanded] = useState({
    Breakfasts: false,
    Lunches: false,
    Dinners: false,
    Desserts: false,
  });
  const [recipes, setRecipes] = useState({
    Breakfasts: [],
    Lunches: [],
    Dinners: [],
    Desserts: [],
  });
  const [loading, setLoading] = useState(true);

  // Fetch 2 random meals for each category
  const fetchRecipes = async () => {
    try {
      const mealPromises = Array.from({ length: 8 }).map(() =>
        fetch('https://www.themealdb.com/api/json/v1/1/random.php').then((res) => res.json())
      );
      const meals = await Promise.all(mealPromises);

      // Organize meals into categories
      const randomMeals = meals.map((meal) => meal.meals[0]);
      const newRecipes = {
        Breakfasts: randomMeals.slice(0, 2),
        Lunches: randomMeals.slice(2, 4),
        Dinners: randomMeals.slice(4, 6),
        Desserts: randomMeals.slice(6, 8),
      };

      setRecipes(newRecipes);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching recipes:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  const toggleCategory = (category) => {
    setExpanded((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#F7B888" />
        <Text>Loading Recipes...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>My Meals</Text>
      </View>

      {/* Dropdown Categories */}
      <View style={styles.categories}>
        {Object.keys(recipes).map((category) => (
          <View key={category} style={styles.category}>
            <TouchableOpacity
              style={styles.categoryButton}
              onPress={() => toggleCategory(category)}
            >
              <Text style={styles.categoryText}>{category}</Text>
              <Text style={styles.dropdownIcon}>
                {expanded[category] ? '▲' : '▼'}
              </Text>
            </TouchableOpacity>

            {expanded[category] && (
              <View style={styles.recipeList}>
                {recipes[category].map((recipe, index) => (
                  <RecipeCard
                    key={index}
                    title={recipe.strMeal}
                    imageUrl={recipe.strMealThumb}
                  />
                ))}
              </View>
            )}
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF6ED',
  },
  header: {
    backgroundColor: '#F7B888',
    padding: 20,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  categories: {
    padding: 20,
  },
  category: {
    marginBottom: 15,
  },
  categoryButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F6EDE3',
    padding: 15,
    borderRadius: 10,
  },
  categoryText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  dropdownIcon: {
    fontSize: 16,
    color: '#888',
  },
  recipeList: {
    marginTop: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF6ED',
  },
});