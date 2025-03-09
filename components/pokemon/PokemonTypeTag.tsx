import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

interface PokemonTypeTagProps {
  type: string;
}

export const PokemonTypeTag: React.FC<PokemonTypeTagProps> = ({ type }) => {
  return (
    <View 
      style={[
        styles.typeTag, 
        { backgroundColor: getTypeColor(type) }
      ]}
    >
      <Text style={styles.typeText}>
        {type.toUpperCase()}
      </Text>
    </View>
  );
};

// Get color based on Pokemon type
const getTypeColor = (type: string) => {
  const typeColors: Record<string, string> = {
    normal: '#A8A878',
    fire: '#F08030',
    water: '#6890F0',
    electric: '#F8D030',
    grass: '#78C850',
    ice: '#98D8D8',
    fighting: '#C03028',
    poison: '#A040A0',
    ground: '#E0C068',
    flying: '#A890F0',
    psychic: '#F85888',
    bug: '#A8B820',
    rock: '#B8A038',
    ghost: '#705898',
    dragon: '#7038F8',
    dark: '#705848',
    steel: '#B8B8D0',
    fairy: '#EE99AC',
  };

  return typeColors[type] || '#777777';
};

const styles = StyleSheet.create({
  typeTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginHorizontal: 4,
  },
  typeText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
