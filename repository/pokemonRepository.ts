import { Alert } from 'react-native';

export interface Pokemon {
  id: number;
  name: string;
  height: number;
  weight: number;
  types: {
    type: {
      name: string;
    };
  }[];
  sprites: {
    front_default: string;
    other: {
      'official-artwork': {
        front_default: string;
      };
    };
  };
  stats: {
    base_stat: number;
    stat: {
      name: string;
    };
  }[];
  abilities: {
    ability: {
      name: string;
    };
  }[];
}

const BASE_URL = 'https://pokeapi.co/api/v2';

export const pokemonRepository = {
  /**
   * Fetches a Pokemon by name or ID
   * @param nameOrId - The name or ID of the Pokemon to fetch
   * @returns The Pokemon data or null if not found
   */
  async getPokemon(nameOrId: string): Promise<Pokemon | null> {
    try {
      // Convert nameOrId to lowercase for names
      const query = nameOrId.toString().toLowerCase();
      const response = await fetch(`${BASE_URL}/pokemon/${query}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error(`API Error: ${response.status}`);
      }
      
      const data = await response.json();
      return data as Pokemon;
    } catch (error) {
      console.error('Error fetching Pokemon:', error);
      return null;
    }
  },

  /**
   * Searches for Pokemon with pagination
   * @param limit - Number of results to return
   * @param offset - Starting index for pagination
   * @returns List of Pokemon with basic info
   */
  async searchPokemon(limit = 20, offset = 0): Promise<{ count: number, results: { name: string, url: string }[] }> {
    try {
      const response = await fetch(`${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`);
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error searching Pokemon:', error);
      Alert.alert('Error', 'Failed to load Pokemon list. Please try again later.');
      return { count: 0, results: [] };
    }
  }
};
