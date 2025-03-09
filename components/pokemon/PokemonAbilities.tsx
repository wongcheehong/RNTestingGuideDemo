import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

interface PokemonAbilitiesProps {
  abilities: Array<{
    ability: {
      name: string;
      url: string;
    };
    is_hidden: boolean;
    slot: number;
  }>;
}

export const PokemonAbilities: React.FC<PokemonAbilitiesProps> = ({ abilities }) => {
  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionHeader}>Abilities</Text>
      <View style={styles.abilitiesContainer}>
        {abilities.map((abilityInfo, index) => (
          <View key={index} style={styles.abilityTag}>
            <Text style={styles.abilityText}>
              {abilityInfo.ability.name.replace('-', ' ')}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  abilitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  abilityTag: {
    backgroundColor: '#333',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  abilityText: {
    color: '#fff',
    fontSize: 14,
  },
});
