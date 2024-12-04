import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export default function MealPlan() {
  const [editMode, setEditMode] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const mealTypes = ['Breakfast', 'Lunch', 'Dinner'];

  const [mealPlan, setMealPlan] = useState({
    Monday: { Breakfast: 'Acai Bowl', Lunch: 'Sandwich', Dinner: 'Spaghetti' },
    Tuesday: { Breakfast: 'Oatmeal', Lunch: 'Pizza', Dinner: 'Grilled Chicken' },
    Wednesday: { Breakfast: 'Cereal', Lunch: 'Macaroni', Dinner: 'Hamburgers' },
    Thursday: { Breakfast: 'Acai Bowl', Lunch: 'Sandwich', Dinner: 'Alfredo' },
    Friday: { Breakfast: 'Acai Bowl', Lunch: 'Sandwich', Dinner: 'Spaghetti' },
    Saturday: { Breakfast: 'Acai Bowl', Lunch: 'Sandwich', Dinner: 'Spaghetti' },
    Sunday: { Breakfast: 'Acai Bowl', Lunch: 'Sandwich', Dinner: 'Spaghetti' },
  });

  const handleMealPress = (day, mealType) => {
    if (editMode) {
      setSelectedDay(day);
      setSelectedMeal(mealType);
      setModalVisible(true);
    }
  };

  const saveMeal = (newMeal) => {
    setMealPlan(prev => ({
      ...prev,
      [selectedDay]: {
        ...prev[selectedDay],
        [selectedMeal]: newMeal
      }
    }));
    setModalVisible(false);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Weekly Meal Plan</Text>
        <TouchableOpacity 
          style={styles.editButton}
          onPress={() => setEditMode(!editMode)}
        >
          <MaterialIcons 
            name={editMode ? "check" : "edit"} 
            size={24} 
            color="#fff" 
          />
        </TouchableOpacity>
      </View>

      {days.map((day) => (
        <View key={day} style={styles.dayCard}>
          <Text style={styles.dayTitle}>{day}</Text>
          <View style={styles.mealsContainer}>
            {mealTypes.map((mealType) => (
              <TouchableOpacity
                key={mealType}
                style={styles.mealItem}
                onPress={() => handleMealPress(day, mealType)}
              >
                <Text style={styles.mealType}>{mealType}</Text>
                <Text style={styles.mealName}>{mealPlan[day][mealType]}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ))}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>
            Edit {selectedMeal} for {selectedDay}
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Enter meal"
            defaultValue={selectedDay && selectedMeal ? mealPlan[selectedDay][selectedMeal] : ''}
            onSubmitEditing={(e) => saveMeal(e.nativeEvent.text)}
          />
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setModalVisible(false)}
          >
            <Text style={styles.closeButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#4CAF50',
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  editButton: {
    padding: 8,
  },
  dayCard: {
    backgroundColor: '#E8F5E9',
    margin: 10,
    borderRadius: 10,
    padding: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  dayTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 10,
  },
  mealsContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
  },
  mealItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mealType: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4CAF50',
  },
  mealName: {
    fontSize: 16,
    color: '#666',
  },
  modalView: {
    margin: 20,
    marginTop: 'auto',
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 35,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#4CAF50',
  },
  input: {
    height: 40,
    borderColor: '#4CAF50',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  closeButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});