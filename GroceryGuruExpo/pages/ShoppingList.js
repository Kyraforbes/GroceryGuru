import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Modal,
  TextInput,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from 'react-native';
import { colors } from '../constants/colors';
import { mealPlanService, shoppingListService } from '../services/api';

export default function ShoppingList() {
  const [shoppingList, setShoppingList] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [customItem, setCustomItem] = useState('');
  const [mealSelectionVisible, setMealSelectionVisible] = useState(false);
  const [selectedMeals, setSelectedMeals] = useState([]);
  const [availableMeals, setAvailableMeals] = useState([]);

  useEffect(() => {
    loadMeals();
    loadShoppingList();
  }, []);

  const loadMeals = async () => {
    try {
      const response = await mealPlanService.getMealPlans();
      setAvailableMeals(response.data);
    } catch (error) {
      console.error('Error loading meals:', error);
    }
  };

  const loadShoppingList = async () => {
    try {
      const response = await shoppingListService.getList();
      setShoppingList(response.data);
    } catch (error) {
      console.error('Error loading shopping list:', error);
    }
  };

  const handleAddItem = async () => {
    if (customItem.trim() !== '') {
      try {
        const newItem = { text: customItem, isChecked: false };
        const response = await shoppingListService.addItem(newItem);
        setShoppingList((prev) => [...prev, response.data]);
        setCustomItem('');
        setIsModalVisible(false);
      } catch (error) {
        console.error('Error adding item:', error);
      }
    } else {
      alert('Please enter a valid item.');
    }
  };

  const toggleMealSelection = (mealId) => {
    setSelectedMeals((prev) => {
      if (prev.includes(mealId)) {
        return prev.filter((id) => id !== mealId);
      }
      return [...prev, mealId];
    });
  };

  const addMealsToList = async () => {
    try {
      const newItems = selectedMeals.flatMap((mealId) => {
        const meal = availableMeals.find((m) => m.id === mealId);
        return meal.ingredients.map((ingredient) => ({
          text: ingredient,
          isChecked: false,
        }));
      });

      await shoppingListService.addItemsFromMeal(newItems);
      setShoppingList((prev) => [...prev, ...newItems]);
      setSelectedMeals([]);
      setMealSelectionVisible(false);
    } catch (error) {
      console.error('Error adding items from meals:', error);
    }
  };

  const MealSelectionModal = () => (
    <Modal
      visible={mealSelectionVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setMealSelectionVisible(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Select Meals</Text>
          <FlatList
            data={availableMeals}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.mealItem,
                  selectedMeals.includes(item.id) && styles.selectedMealItem,
                ]}
                onPress={() => toggleMealSelection(item.id)}
              >
                <Text style={styles.mealText}>{item.name}</Text>
                {selectedMeals.includes(item.id) && (
                  <Text style={styles.checkIcon}>✓</Text>
                )}
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.id.toString()}
          />
          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={() => setMealSelectionVisible(false)}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.addButton]}
              onPress={addMealsToList}
            >
              <Text style={styles.buttonText}>Add Selected</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  const toggleItemChecked = async (index) => {
    try {
      const item = shoppingList[index];
      const response = await shoppingListService.toggleItem(item.id);
      if (response.status === 200) {
        setShoppingList(prevList => {
          const newList = [...prevList];
          newList[index] = { ...newList[index], isChecked: !newList[index].isChecked };
          return newList;
        });
      }
    } catch (error) {
      console.error('Error toggling item:', error);
      Alert.alert('Error', 'Failed to update item status');
    }
  };
  
  const handleItemRemoval = async (index) => {
    try {
      const item = shoppingList[index];
      const response = await shoppingListService.removeItem(item.id);
      if (response.status === 204) {
        setShoppingList(prevList => prevList.filter((_, i) => i !== index));
      }
    } catch (error) {
      console.error('Error removing item:', error);
      Alert.alert('Error', 'Failed to remove item');
    }
  };

return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Shopping List</Text>

      {/* Selected Meals Section */}
      <TouchableOpacity
        style={styles.selectedMealsCard}
        onPress={() => setMealSelectionVisible(true)}
      >
        <Text style={styles.cardTitle}>
          Selected Meals ({selectedMeals.length})
        </Text>
        <Text style={styles.iconText}>+</Text>
      </TouchableOpacity>

      {/* Add Custom Item Button */}
      <TouchableOpacity
        style={styles.selectedMealsCard}
        onPress={() => setIsModalVisible(true)}
      >
        <Text style={styles.cardTitle}>Add Custom Item</Text>
        <Text style={styles.iconText}>+</Text>
      </TouchableOpacity>

      {/* Shopping List */}
      <View style={styles.listCard}>
        {shoppingList.length > 0 ? (
          <FlatList
            data={shoppingList}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => (
              <View style={styles.listItem}>
                <TouchableOpacity
                  style={[
                    styles.checkbox,
                    item.isChecked && styles.checkboxChecked,
                  ]}
                  onPress={() => toggleItemChecked(index)}
                >
                  {item.isChecked && (
                    <Text style={styles.checkIcon}>✓</Text>
                  )}
                </TouchableOpacity>
                <Text
                  style={[
                    styles.listItemText,
                    item.isChecked && styles.listItemChecked,
                  ]}
                >
                  {item.text}
                </Text>
                <TouchableOpacity
                  style={styles.modifyListButton}
                  onPress={() => handleItemRemoval(index)}
                >
                  <Text style={styles.deleteIcon}>🗑️</Text>
                </TouchableOpacity>
              </View>
            )}
          />
        ) : (
          <View style={styles.emptyListContainer}>
            <Text style={styles.emptyListText}>Your shopping list is empty.</Text>
          </View>
        )}
      </View>

      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TextInput
              style={styles.input}
              placeholder="Enter custom item"
              value={customItem}
              onChangeText={setCustomItem}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => setIsModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.addButton]}
                onPress={handleAddItem}
              >
                <Text style={styles.buttonText}>Add Item</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <MealSelectionModal />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    padding: 20,
  },
  heading: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 20,
  },
  iconText: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
  },
  checkIcon: {
    fontSize: 18,
    color: '#4CAF50', // your primary color
  },
  deleteIcon: {
    fontSize: 20,
    color: '#4CAF50', // your primary color
  },
  selectedMealsCard: {
    backgroundColor: '#4CAF50',
    width: '100%',
    maxWidth: 400,
    padding: 15,
    borderRadius: 15,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
  },
  listCard: {
    backgroundColor: '#E8F5E9',
    width: '100%',
    maxWidth: 400,
    padding: 20,
    borderRadius: 15,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom: 5,
  },
  checkbox: {
    height: 24,
    width: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    backgroundColor: '#fff',
  },
  checkboxChecked: {
    backgroundColor: '#fff',
  },
  listItemText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  listItemChecked: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  modifyListButton: {
    alignSelf: 'flex-end',
    marginTop: 5,
    marginBottom: 15,
  },
  modifyListButtonText: {
    fontSize: 16,
    color: '#007BFF',
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    width: '100%',
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#ccc',
  },
  addButton: {
    backgroundColor: '#4CAF50',
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
  },
  emptyListContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  emptyListText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 16,
  },
});