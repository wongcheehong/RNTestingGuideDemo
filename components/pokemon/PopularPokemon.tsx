import React from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

interface PopularPokemonProps {
  popularPokemon: { name: string; url: string }[];
  loadingPopular: boolean;
  onSelectPokemon: (name: string) => void;
}

export const PopularPokemon: React.FC<PopularPokemonProps> = ({
  popularPokemon,
  loadingPopular,
  onSelectPokemon,
}) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <View style={styles.popularContainer}>
      <Text style={styles.sectionTitle}>Popular Pokemon</Text>
      {loadingPopular ? (
        <ActivityIndicator size="large" color={colors.tint} />
      ) : (
        <FlatList
          data={popularPokemon}
          keyExtractor={(item) => item.name}
          numColumns={2}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.popularItem}
              onPress={() => onSelectPokemon(item.name)}
            >
              <Text style={styles.popularItemText}>
                {item.name.charAt(0).toUpperCase() + item.name.slice(1)}
              </Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  popularContainer: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  popularItem: {
    flex: 1,
    backgroundColor: '#1E1E1E',
    padding: 16,
    margin: 4,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  popularItemText: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
  },
});
