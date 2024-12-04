import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import RegisterPage from './pages/RegisterPage';
import MealPlan from './pages/MealPlan';        // Import new pages
import MyMeals from './pages/MyMeals';
import ProfilePage from './pages/ProfilePage';
import ShoppingList from './pages/ShoppingList';

const Drawer = createDrawerNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="Register">
        <Drawer.Screen name="Register" component={RegisterPage} />
        <Drawer.Screen name="Meal Plan" component={MealPlan} />
        <Drawer.Screen name="My Meals" component={MyMeals} />
        <Drawer.Screen name="Profile" component={ProfilePage} />
        <Drawer.Screen name="Shopping List" component={ShoppingList} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}