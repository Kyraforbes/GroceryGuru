import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Modal,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { shoppingListService } from '../services/api';

export default function ShoppingList() {
  const [shoppingList, setShoppingList] = useState({ id: null, items: [] });
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [customItem, setCustomItem] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Load shopping list when component mounts
  useEffect(() => {
    loadShoppingList();
  }, []);

  const loadShoppingList = async () => {
    try {
      setIsLoading(true);
      const response = await shoppingListService.getList();
      setShoppingList(response.data);
    } catch (error) {
      console.error('Error loading shopping list:', error);
      Alert.alert('Error', 'Failed to load shopping list');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddItem = async () => {
    if (customItem.trim() !== '') {
      try {
        await shoppingListService.addItem(shoppingList.id, {
          text: customItem,
          is_checked: false
        });
        setCustomItem('');
        setIsModalVisible(false);
        loadShoppingList(); // Reload the list to get the new item
      } catch (error) {
        console.error('Error adding item:', error);
        Alert.alert('Error', 'Failed to add item to shopping list');
      }
    } else {
      Alert.alert('Error', 'Please enter a valid item.');
    }
  };

  const handleCancel = () => {
    setCustomItem('');
    setIsModalVisible(false);
  };

  const toggleCheckItem = async (itemId) => {
    try {
      await shoppingListService.toggleItem(shoppingList.id, itemId);
      loadShoppingList(); // Reload to get updated state
    } catch (error) {
      console.error('Error toggling item:', error);
      Alert.alert('Error', 'Failed to update item');
    }
  };

  const handleRemoveItem = async (itemId) => {
    try {
      await shoppingListService.removeItem(shoppingList.id, itemId);
      loadShoppingList();
      if (shoppingList.items.length <= 1) {
        setIsEditMode(false);
      }
    } catch (error) {
      console.error('Error removing item:', error);
      Alert.alert('Error', 'Failed to remove item');
    }
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text>Loading shopping list...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Page Header */}
      <Text style={styles.heading}>Shopping List</Text>

      {/* Selected Meals Section */}
      <View style={styles.selectedMealsCard}>
        <Text style={styles.cardTitle}>Selected Meals</Text>
      </View>

      {/* Shopping List Items */}
      <View style={styles.listCard}>
        {shoppingList.items.length === 0 ? (
          <Text style={styles.emptyListText}>Your shopping list is empty</Text>
        ) : (
          shoppingList.items.map((item) => (
            <View key={item.id} style={styles.listItem}>
              {/* Checkbox */}
              <TouchableOpacity
                style={[
                  styles.checkbox,
                  item.is_checked && styles.checkboxChecked,
                ]}
                onPress={() => toggleCheckItem(item.id)}
              >
                {item.is_checked && (
                  <MaterialIcons name="check" size={20} color="#000" />
                )}
              </TouchableOpacity>

              {/* List Item Text */}
              <Text
                style={[
                  styles.listItemText,
                  item.is_checked && styles.listItemChecked,
                ]}
              >
                {item.text}
              </Text>

              {/* Delete Icon (Visible in Edit Mode Only) */}
              {isEditMode && (
                <TouchableOpacity onPress={() => handleRemoveItem(item.id)}>
                  <MaterialIcons name="delete" size={24} color="#000" />
                </TouchableOpacity>
              )}
            </View>
          ))
        )}

        {/* Modify List Button */}
        {shoppingList.items.length > 0 && (
          <TouchableOpacity
            style={styles.modifyListButton}
            onPress={() => setIsEditMode(!isEditMode)}
          >
            <Text style={styles.modifyListButtonText}>
              {isEditMode ? 'Done' : 'Modify List'}
            </Text>
          </TouchableOpacity>
        )}

        {/* Add Custom Item Button */}
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setIsModalVisible(true)}
        >
          <Text style={styles.addButtonText}>Add Custom Item</Text>
        </TouchableOpacity>
      </View>

      {/* Modal for Adding Custom Item */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={handleCancel}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {/* Cancel Button */}
            <TouchableOpacity onPress={handleCancel} style={styles.cancelButton}>
              <Text style={styles.cancelButtonText}>X</Text>
            </TouchableOpacity>

            {/* Input for Custom Item */}
            <Text style={styles.modalTitle}>Add an Item</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter item"
              value={customItem}
              onChangeText={setCustomItem}
              autoFocus={true}
              onSubmitEditing={handleAddItem}
            />

            {/* Add Item Button */}
            <TouchableOpacity style={styles.addItemButton} onPress={handleAddItem}>
              <Text style={styles.addItemButtonText}>Add Item</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  emptyListText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 16,
    marginVertical: 20,
  },
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
  selectedMealsCard: {
    backgroundColor: '#4CAF50',
    width: '100%',
    maxWidth: 400,
    padding: 15,
    borderRadius: 15,
    marginBottom: 20,
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
  addButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  addButtonText: {
    fontSize: 16,
    color: '#fff',
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
  cancelButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    padding: 5,
  },
  cancelButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
    marginBottom: 20,
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
  addItemButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  addItemButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
});