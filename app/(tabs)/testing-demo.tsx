import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import Calculator from '@/components/Calculator';
import UserForm from '@/components/UserForm';

export default function TestingDemoScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Testing Demo</Text>
        <Text style={styles.subtitle}>
          This screen demonstrates components with unit and integration tests
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Calculator Component</Text>
        <Text style={styles.sectionDescription}>
          This component has unit tests for its math functions and integration tests for user interactions.
        </Text>
        <Calculator testID="demo-calculator" />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>User Form Component</Text>
        <Text style={styles.sectionDescription}>
          This component has unit tests for validation functions and integration tests for form submission.
        </Text>
        <UserForm testID="demo-user-form" />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#4a90e2',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: 'white',
    opacity: 0.9,
  },
  section: {
    padding: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
});
