import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { profileService } from '../services/api';
import { colors } from '../constants/colors';

// Separate component for the submitted profile view
const SubmittedProfilePage = ({ profile, onEdit }) => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Your Profile</Text>

        <Text style={styles.label}>Age Group: {profile.age_group}</Text>
        <Text style={styles.label}>
          Shopping Frequency: {profile.shopping_frequency}
        </Text>
        <Text style={styles.label}>
          Eating Out Frequency: {profile.eating_out_frequency}
        </Text>
        <Text style={styles.label}>Allergies: {profile.allergies}</Text>
        <Text style={styles.label}>
          Other Preferences: {profile.other_preferences}
        </Text>

        <TouchableOpacity
          style={styles.editButton}
          onPress={onEdit}
        >
          <Text style={styles.editButtonText}>Edit</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default function ProfilePage() {
  const [ageGroupOpen, setAgeGroupOpen] = useState(false);
  const [shoppingFrequencyOpen, setShoppingFrequencyOpen] = useState(false);
  const [eatingOutFrequencyOpen, setEatingOutFrequencyOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [ageGroup, setAgeGroup] = useState(null);
  const [shoppingFrequency, setShoppingFrequency] = useState(null);
  const [eatingOutFrequency, setEatingOutFrequency] = useState(null);

  const [ageGroupItems] = useState([
    { label: 'Under 18', value: 'under_18' },
    { label: '18-25', value: '18_25' },
    { label: '26-35', value: '26_35' },
    { label: '36-50', value: '36_50' },
    { label: '51 and above', value: '51_above' },
  ]);

  const [shoppingFrequencyItems] = useState([
    { label: 'Daily', value: 'daily' },
    { label: 'Weekly', value: 'weekly' },
    { label: 'Bi-weekly', value: 'bi_weekly' },
    { label: 'Monthly', value: 'monthly' },
  ]);

  const [eatingOutFrequencyItems] = useState([
    { label: '1 time per week', value: '1_per_week' },
    { label: '2 times per week', value: '2_per_week' },
    { label: '3 times per week', value: '3_per_week' },
    { label: '4 times per week', value: '4_per_week' },
    { label: '5 or more times per week', value: '5_plus_per_week' },
  ]);

  const [allergies, setAllergies] = useState('');
  const [otherPreferences, setOtherPreferences] = useState('');
  const [isProfileSubmitted, setIsProfileSubmitted] = useState(false);
  const [submittedProfile, setSubmittedProfile] = useState(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setIsLoading(true);
      const response = await profileService.getProfile();
      const profile = response.data;

      setAgeGroup(profile.age_group);
      setShoppingFrequency(profile.shopping_frequency);
      setEatingOutFrequency(profile.eating_out_frequency);
      setAllergies(profile.allergies || '');
      setOtherPreferences(profile.other_preferences || '');
    } catch (error) {
      console.error('Error loading profile:', error);
      Alert.alert('Error', 'Failed to load profile data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      const profileData = {
        age_group: ageGroup,
        shopping_frequency: shoppingFrequency,
        eating_out_frequency: eatingOutFrequency,
        allergies,
        other_preferences: otherPreferences,
      };

      await profileService.updateProfile(profileData);
      setSubmittedProfile(profileData);
      setIsProfileSubmitted(true);
    } catch (error) {
      console.error('Error saving profile:', error);
      Alert.alert('Error', 'Failed to save profile data');
    }
  };

  const handleDropdownOpen = (dropdown) => {
    setAgeGroupOpen(dropdown === 'ageGroup');
    setShoppingFrequencyOpen(dropdown === 'shoppingFrequency');
    setEatingOutFrequencyOpen(dropdown === 'eatingOutFrequency');
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text>Loading profile...</Text>
      </View>
    );
  }

  if (isProfileSubmitted && submittedProfile) {
    return (
      <SubmittedProfilePage
        profile={submittedProfile}
        onEdit={() => setIsProfileSubmitted(false)}
      />
    );
  }

  return (
    <KeyboardAvoidingView
      style={[styles.container, styles.centerContent]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={styles.scrollContainer}>
        <Text style={styles.heading}>Profile</Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Your preferences:</Text>

          <Text style={styles.label}>Allergies:</Text>
          <TextInput
            style={styles.input}
            placeholder="Type your allergies here"
            value={allergies}
            onChangeText={setAllergies}
          />

          <Text style={styles.label}>Age Group:</Text>
          <DropDownPicker
            open={ageGroupOpen}
            value={ageGroup}
            items={ageGroupItems}
            setOpen={setAgeGroupOpen}
            setValue={setAgeGroup}
            style={styles.dropdown}
            placeholder="Select age group"
            zIndex={3000}
            zIndexInverse={1000}
          />

          <Text style={styles.label}>Shopping Frequency:</Text>
          <DropDownPicker
            open={shoppingFrequencyOpen}
            value={shoppingFrequency}
            items={shoppingFrequencyItems}
            setOpen={setShoppingFrequencyOpen}
            setValue={setShoppingFrequency}
            style={styles.dropdown}
            placeholder="How often do you go shopping?"
            zIndex={2000}
            zIndexInverse={2000}
          />

          <Text style={styles.label}>Eating Out Frequency:</Text>
          <DropDownPicker
            open={eatingOutFrequencyOpen}
            value={eatingOutFrequency}
            items={eatingOutFrequencyItems}
            setOpen={setEatingOutFrequencyOpen}
            setValue={setEatingOutFrequency}
            style={styles.dropdown}
            placeholder="How many times per week do you eat out?"
            zIndex={1000}
            zIndexInverse={3000}
          />

          <Text style={styles.label}>Other Preferences:</Text>
          <TextInput
            style={styles.input}
            placeholder="Type any other dietary restrictions/preferences here"
            value={otherPreferences}
            onChangeText={setOtherPreferences}
            multiline
          />

          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSaveProfile}
          >
            <Text style={styles.saveButtonText}>Save Profile</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    padding: 20,
  },
  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContainer: {
    width: '100%',
    maxWidth: 400,
  },
  heading: {
    fontSize: 36,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 10,
  },
  card: {
    backgroundColor: colors.primaryLight,
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
  cardTitle: {
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 20,
    color: colors.primaryDark,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: colors.text,
  },
  input: {
    height: 40,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingLeft: 10,
    width: '100%',
    backgroundColor: colors.white,
  },
  dropdown: {
    borderColor: colors.border,
    borderRadius: 5,
    marginBottom: 15,
    width: '100%',
    backgroundColor: colors.white,
  },
  saveButton: {
    backgroundColor: colors.primary,
    padding: 15,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  editButton: {
    backgroundColor: colors.primary,
    padding: 15,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
  },
  editButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});