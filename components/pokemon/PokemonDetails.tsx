import React from 'react';
import { StyleSheet, View, Text, Image, ScrollView } from 'react-native';
import { Pokemon } from '@/repository/pokemonRepository';
import { PokemonTypeTag } from './PokemonTypeTag';
import { PokemonAbilities } from './PokemonAbilities';
import { PokemonStats } from './PokemonStats';

interface PokemonDetailsProps {
  pokemon: Pokemon;
}

export const PokemonDetails: React.FC<PokemonDetailsProps> = ({ pokemon }) => {
  return (
    <ScrollView style={styles.resultContainer} showsVerticalScrollIndicator={false}>
      <View style={styles.pokemonHeader}>
        <Text style={styles.pokemonName}>
          {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)} #{pokemon.id}
        </Text>
        
        <View style={styles.typesContainer}>
          {pokemon.types.map((typeInfo, index) => (
            <PokemonTypeTag key={index} type={typeInfo.type.name} />
          ))}
        </View>
      </View>

      <View style={styles.imageContainer}>
        <Image
          style={styles.pokemonImage}
          source={{ 
            uri: pokemon.sprites.other['official-artwork'].front_default || 
                 pokemon.sprites.front_default 
          }}
          resizeMode="contain"
        />
      </View>

      <View style={styles.infoContainer}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Height:</Text>
          <Text style={styles.infoValue}>{pokemon.height / 10} m</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Weight:</Text>
          <Text style={styles.infoValue}>{pokemon.weight / 10} kg</Text>
        </View>
      </View>

      <PokemonAbilities abilities={pokemon.abilities} />
      <PokemonStats stats={pokemon.stats} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  resultContainer: {
    flex: 1,
  },
  pokemonHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  pokemonName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  typesContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 8,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  pokemonImage: {
    width: 200,
    height: 200,
  },
  infoContainer: {
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 16,
    color: '#ccc',
  },
  infoValue: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
});
