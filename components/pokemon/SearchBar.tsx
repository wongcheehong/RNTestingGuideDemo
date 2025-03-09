import React from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, Text } from 'react-native';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handleSearch: () => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  setSearchQuery,
  handleSearch,
}) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <View style={styles.searchContainer}>
      <TextInput
        style={[styles.searchInput, { borderColor: colors.tint }]}
        placeholder="Enter Pokemon name or ID"
        placeholderTextColor="#8E8E93"
        value={searchQuery}
        onChangeText={setSearchQuery}
        onSubmitEditing={handleSearch}
        autoCapitalize="none"
        autoCorrect={false}
      />
      <TouchableOpacity 
        style={[styles.searchButton, { backgroundColor: '#2345dc' }]} 
        onPress={handleSearch}
      >
        <Text style={styles.searchButtonText}>Search</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    backgroundColor: '#1E1E1E',
    color: '#fff',
    fontSize: 16,
  },
  searchButton: {
    marginLeft: 8,
    height: 50,
    paddingHorizontal: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
