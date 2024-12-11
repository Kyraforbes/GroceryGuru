import React from 'react';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { AuthProvider, useAuth } from './AuthContext';

// Import pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import MealPlan from './pages/MealPlan';
import MyMeals from './pages/MyMeals';
import ProfilePage from './pages/ProfilePage';
import ShoppingList from './pages/ShoppingList';

const Drawer = createDrawerNavigator();

// Main app screens with authentication handling
function AppNavigator() {
  const { isAuthenticated } = useAuth();

  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName={isAuthenticated ? "Meal Plan" : "Login"}>
        {!isAuthenticated ? (
          <>
            <Drawer.Screen name="Login" component={LoginPage} />
            <Drawer.Screen name="Register" component={RegisterPage} />
          </>
        ) : (
          <>
            <Drawer.Screen name="Meal Plan" component={MealPlan} />
            <Drawer.Screen name="My Meals" component={MyMeals} />
            <Drawer.Screen name="Profile" component={ProfilePage} />
            <Drawer.Screen name="Shopping List" component={ShoppingList} />
          </>
        )}
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

// Main app component wrapped with AuthProvider
export default function App() {
  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

