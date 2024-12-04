import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import RecipeCard from '../components/RecipeCard';
import { colors } from '../constants/colors';

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
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading Recipes...</Text>
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
              style={[styles.categoryButton, expanded[category] && styles.categoryButtonActive]}
              onPress={() => toggleCategory(category)}
            >
              <Text style={[styles.categoryText, expanded[category] && styles.categoryTextActive]}>
                {category}
              </Text>
              <Text style={[styles.dropdownIcon, expanded[category] && styles.dropdownIconActive]}>
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
    backgroundColor: colors.white,
    padding: 20,
  },
  header: {
    backgroundColor: colors.primary,
    padding: 20,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.white,
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
    backgroundColor: colors.primaryLight,
    padding: 15,
    borderRadius: 10,
  },
  categoryButtonActive: {
    backgroundColor: colors.primary,
  },
  categoryText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  categoryTextActive: {
    color: colors.white,
  },
  dropdownIcon: {
    fontSize: 16,
    color: colors.textLight,
  },
  dropdownIconActive: {
    color: colors.white,
  },
  recipeList: {
    marginTop: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  loadingText: {
    marginTop: 10,
    color: colors.primary,
    fontSize: 16,
  },
});