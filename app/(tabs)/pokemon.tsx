import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import { pokemonRepository, Pokemon } from '@/repository/pokemonRepository';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function PokemonScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [popularPokemon, setPopularPokemon] = useState<{ name: string; url: string }[]>([]);
  const [loadingPopular, setLoadingPopular] = useState(true);
  
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  // Load popular Pokemon on component mount
  useEffect(() => {
    const fetchPopularPokemon = async () => {
      try {
        const data = await pokemonRepository.searchPokemon(20, 0);
        setPopularPokemon(data.results);
      } catch (error) {
        console.error('Error fetching popular Pokemon:', error);
      } finally {
        setLoadingPopular(false);
      }
    };

    fetchPopularPokemon();
  }, []);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setError('Please enter a Pokemon name or ID');
      return;
    }

    setLoading(true);
    setError('');
    setPokemon(null);

    try {
      const result = await pokemonRepository.getPokemon(searchQuery.trim());
      
      if (result) {
        setPokemon(result);
        
        // Add to recent searches if not already there
        if (!recentSearches.includes(searchQuery.trim().toLowerCase())) {
          setRecentSearches(prev => [searchQuery.trim().toLowerCase(), ...prev].slice(0, 5));
        }
      } else {
        setError(`Pokemon "${searchQuery}" not found`);
      }
    } catch (error) {
      console.error('Error searching Pokemon:', error);
      setError('An error occurred while searching. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPokemon = (name: string) => {
    setSearchQuery(name);
    setTimeout(() => {
      handleSearch();
    }, 100);
  };

  // Format stat name for display
  const formatStatName = (name: string) => {
    return name
      .replace(/-/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pokemon Search</Text>
      
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

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      {recentSearches.length > 0 && !pokemon && !loading && (
        <View style={styles.recentContainer}>
          <Text style={styles.sectionTitle}>Recent Searches</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {recentSearches.map((name, index) => (
              <TouchableOpacity
                key={index}
                style={styles.recentItem}
                onPress={() => handleSelectPokemon(name)}
              >
                <Text style={styles.recentItemText}>{name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {!pokemon && !loading && !error && (
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
                  onPress={() => handleSelectPokemon(item.name)}
                >
                  <Text style={styles.popularItemText}>
                    {item.name.charAt(0).toUpperCase() + item.name.slice(1)}
                  </Text>
                </TouchableOpacity>
              )}
            />
          )}
        </View>
      )}

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.tint} />
          <Text style={styles.loadingText}>Searching for Pokemon...</Text>
        </View>
      )}

      {pokemon && (
        <ScrollView style={styles.resultContainer} showsVerticalScrollIndicator={false}>
          <View style={styles.pokemonHeader}>
            <Text style={styles.pokemonName}>
              {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)} #{pokemon.id}
            </Text>
            
            <View style={styles.typesContainer}>
              {pokemon.types.map((typeInfo, index) => (
                <View 
                  key={index} 
                  style={[
                    styles.typeTag, 
                    { backgroundColor: getTypeColor(typeInfo.type.name) }
                  ]}
                >
                  <Text style={styles.typeText}>
                    {typeInfo.type.name.toUpperCase()}
                  </Text>
                </View>
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

          <View style={styles.sectionContainer}>
            <Text style={styles.sectionHeader}>Abilities</Text>
            <View style={styles.abilitiesContainer}>
              {pokemon.abilities.map((abilityInfo, index) => (
                <View key={index} style={styles.abilityTag}>
                  <Text style={styles.abilityText}>
                    {abilityInfo.ability.name.replace('-', ' ')}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.sectionContainer}>
            <Text style={styles.sectionHeader}>Base Stats</Text>
            {pokemon.stats.map((statInfo, index) => (
              <View key={index} style={styles.statRow}>
                <Text style={styles.statName}>{formatStatName(statInfo.stat.name)}</Text>
                <Text style={styles.statValue}>{statInfo.base_stat}</Text>
                <View style={styles.statBarContainer}>
                  <View 
                    style={[
                      styles.statBar, 
                      { 
                        width: `${Math.min(100, (statInfo.base_stat / 255) * 100)}%`,
                        backgroundColor: statInfo.base_stat > 100 ? '#4CAF50' : 
                                        statInfo.base_stat > 50 ? '#FFC107' : '#F44336'
                      }
                    ]} 
                  />
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#121212',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 60,
    marginBottom: 20,
    textAlign: 'center',
  },
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
  errorText: {
    color: '#FF6B6B',
    marginBottom: 16,
    fontSize: 16,
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#ccc',
  },
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
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statName: {
    width: 120,
    fontSize: 14,
    color: '#ccc',
  },
  statValue: {
    width: 40,
    fontSize: 14,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'right',
    marginRight: 8,
  },
  statBarContainer: {
    flex: 1,
    height: 8,
    backgroundColor: '#333',
    borderRadius: 4,
    overflow: 'hidden',
  },
  statBar: {
    height: '100%',
  },
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
  popularContainer: {
    flex: 1,
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
