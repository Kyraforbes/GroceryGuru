import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, ActivityIndicator, Picker } from 'react-native';
import RecipeCard from '../components/RecipeCard';
import { colors } from '../constants/colors';
import { TouchableOpacity } from 'react-native';

export default function MyMeals() {
  const [expanded, setExpanded] = useState({
    Breakfasts: false,
    Lunches: false,
    Dinners: false,
    Desserts: false,
  });
  const [recipes, setRecipes] = useState([]);
  const [categoryMeals, setCategoryMeals] = useState({
    Breakfasts: [],
    Lunches: [],
    Dinners: [],
    Desserts: [],
  });
  const [loading, setLoading] = useState(true);

  const fetchRecipes = async () => {
    try {
      setLoading(true);
      const mealPromises = Array.from({ length: 20 }).map(() =>
        fetch('https://www.themealdb.com/api/json/v1/1/random.php').then((res) => res.json())
      );
      const meals = await Promise.all(mealPromises);
      const randomMeals = meals.map((meal) => meal.meals[0]);

      setRecipes(randomMeals);
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

  const addMealToCategory = (meal, category) => {
    setCategoryMeals((prev) => ({
      ...prev,
      [category]: [...prev[category], meal],
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

      {/* Accordion Categories */}
      <View style={styles.categories}>
        {Object.keys(categoryMeals).map((category) => (
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
                {categoryMeals[category].map((recipe, index) => (
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

      {/* List of all meals */}
      <View style={styles.allMealsContainer}>
        <View style={styles.sectionHeaderContainer}>
          <Text style={styles.sectionHeader}>All Meals</Text>
          <TouchableOpacity style={styles.refreshButton} onPress={fetchRecipes}>
            <Text style={styles.refreshButtonText}>Refresh Meal Suggestions</Text>
          </TouchableOpacity>
        </View>
        {recipes.map((recipe, index) => (
          <View key={index} style={styles.mealContainer}>
            <RecipeCard title={recipe.strMeal} imageUrl={recipe.strMealThumb} />
            <Picker
              style={styles.dropdown}
              selectedValue={''}
              onValueChange={(value) => {
                if (value) addMealToCategory(recipe, value);
              }}
            >
              <Picker.Item label="Add to Category" value="" />
              {Object.keys(categoryMeals).map((category) => (
                <Picker.Item key={category} label={category} value={category} />
              ))}
            </Picker>
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
  sectionHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
  },
  refreshButton: {
    backgroundColor: colors.primary,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  refreshButtonText: {
    color: colors.white,
    fontWeight: 'bold',
  },
  allMealsContainer: {
    marginBottom: 20,
  },
  mealContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  dropdown: {
    marginTop: 10,
    width: '90%',
    maxWidth: 300,
    backgroundColor: colors.primaryLight,
    color: colors.text,
    borderRadius: 10,
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
