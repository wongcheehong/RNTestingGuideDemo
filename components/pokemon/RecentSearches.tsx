import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';

interface RecentSearchesProps {
  recentSearches: string[];
  onSelectPokemon: (name: string) => void;
}

export const RecentSearches: React.FC<RecentSearchesProps> = ({
  recentSearches,
  onSelectPokemon,
}) => {
  if (recentSearches.length === 0) return null;

  return (
    <View style={styles.recentContainer}>
      <Text style={styles.sectionTitle}>Recent Searches</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {recentSearches.map((name, index) => (
          <TouchableOpacity
            key={index}
            style={styles.recentItem}
            onPress={() => onSelectPokemon(name)}
          >
            <Text style={styles.recentItemText}>{name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  recentContainer: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  recentItem: {
    backgroundColor: '#1E1E1E',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  recentItemText: {
    color: '#fff',
    fontSize: 14,
  },
});
