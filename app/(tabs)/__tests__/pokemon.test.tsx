import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import PokemonScreen from '../pokemon';

// Mock the pokemonRepository
jest.mock('@/repository/pokemonRepository', () => ({
  pokemonRepository: {
    getPokemon: jest.fn(),
    searchPokemon: jest.fn(),
  },
}));

// Mock react-query
jest.mock('@tanstack/react-query', () => ({
  useQuery: jest.fn(({ queryKey, queryFn, enabled = true }) => {
    // For popular Pokemon query
    if (queryKey[0] === 'popularPokemon') {
      return {
        data: {
          count: 2,
          results: [
            { name: 'pikachu', url: 'https://pokeapi.co/api/v2/pokemon/25/' },
            { name: 'charizard', url: 'https://pokeapi.co/api/v2/pokemon/6/' },
          ],
        },
        isLoading: false,
        isError: false,
      };
    }

    // For specific Pokemon query
    if (queryKey[0] === 'pokemon') {
      const pokemonName = queryKey[1];

      if (!enabled) {
        return {
          data: null,
          isLoading: false,
          isError: false,
        };
      }

      if (pokemonName === 'pikachu') {
        return {
          data: {
            id: 25,
            name: 'pikachu',
            height: 4,
            weight: 60,
            types: [{ type: { name: 'electric' } }],
            sprites: {
              front_default:
                'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png',
              other: {
                'official-artwork': {
                  front_default:
                    'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png',
                },
              },
            },
            stats: [
              { base_stat: 35, stat: { name: 'hp' } },
              { base_stat: 55, stat: { name: 'attack' } },
              { base_stat: 40, stat: { name: 'defense' } },
            ],
            abilities: [
              {
                ability: {
                  name: 'static',
                  url: 'https://pokeapi.co/api/v2/ability/9/',
                },
                is_hidden: false,
                slot: 1,
              },
              {
                ability: {
                  name: 'lightning-rod',
                  url: 'https://pokeapi.co/api/v2/ability/31/',
                },
                is_hidden: true,
                slot: 3,
              },
            ],
          },
          isLoading: false,
          isError: false,
        };
      } else if (pokemonName === 'not-found') {
        return {
          data: null,
          isLoading: false,
          isError: false,
        };
      } else if (pokemonName === 'error') {
        return {
          data: null,
          isLoading: false,
          isError: true,
        };
      } else {
        return {
          isLoading: true,
          isError: false,
          data: null,
        };
      }
    }

    return {
      data: null,
      isLoading: false,
      isError: false,
    };
  }),
}));

describe('PokemonScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders correctly with popular Pokemon list', () => {
    const { getByText, getAllByText } = render(<PokemonScreen />);

    // Check if the screen title is rendered
    expect(getByText('Pokemon Search')).toBeTruthy();

    // Check if popular Pokemon section is rendered
    expect(getByText('Popular Pokemon')).toBeTruthy();

    // Check if popular Pokemon are rendered
    expect(getByText('Pikachu')).toBeTruthy();
    expect(getByText('Charizard')).toBeTruthy();
  });

  test('allows searching for a Pokemon and displays results', async () => {
    const { getByText, getByPlaceholderText, getByRole } = render(
      <PokemonScreen />,
    );

    // Enter a search term
    const searchInput = getByPlaceholderText('Enter Pokemon name or ID');
    fireEvent.changeText(searchInput, 'pikachu');

    // Press the search button
    const searchButton = getByText('Search');
    fireEvent.press(searchButton);

    // Wait for the Pokemon data to be displayed
    await waitFor(() => {
      // Check if Pokemon name and ID are displayed
      expect(getByText('Pikachu #25')).toBeTruthy();

      // Check if type is displayed
      expect(getByText('ELECTRIC')).toBeTruthy();

      // Check if stats are displayed
      expect(getByText('Hp')).toBeTruthy();
      expect(getByText('35')).toBeTruthy();
      expect(getByText('Attack')).toBeTruthy();
      expect(getByText('55')).toBeTruthy();
      expect(getByText('Defense')).toBeTruthy();
      expect(getByText('40')).toBeTruthy();
    });
  });

  test('displays loading state while searching', () => {
    const { getByText, getByPlaceholderText } = render(<PokemonScreen />);

    // Enter a search term that will trigger loading state
    const searchInput = getByPlaceholderText('Enter Pokemon name or ID');
    fireEvent.changeText(searchInput, 'loading');

    // Press the search button
    const searchButton = getByText('Search');
    fireEvent.press(searchButton);

    // Check if loading indicator is displayed
    expect(getByText('Searching for Pokemon...')).toBeTruthy();
  });

  test('displays error message when Pokemon is not found', async () => {
    const { getByText, getByPlaceholderText } = render(<PokemonScreen />);

    // Enter a search term for a Pokemon that doesn't exist
    const searchInput = getByPlaceholderText('Enter Pokemon name or ID');
    fireEvent.changeText(searchInput, 'not-found');

    // Press the search button
    const searchButton = getByText('Search');
    fireEvent.press(searchButton);

    // Check if error message is displayed
    await waitFor(() => {
      expect(getByText('Pokemon "not-found" not found')).toBeTruthy();
    });
  });

  test('displays error message when API request fails', async () => {
    const { getByText, getByPlaceholderText } = render(<PokemonScreen />);

    // Enter a search term that will trigger an error
    const searchInput = getByPlaceholderText('Enter Pokemon name or ID');
    fireEvent.changeText(searchInput, 'error');

    // Press the search button
    const searchButton = getByText('Search');
    fireEvent.press(searchButton);

    // Check if error message is displayed
    await waitFor(() => {
      expect(
        getByText('An error occurred while searching. Please try again.'),
      ).toBeTruthy();
    });
  });

  test('adds searched Pokemon to recent searches', async () => {
    const { getByText, getByPlaceholderText, queryByText } = render(
      <PokemonScreen />,
    );

    // Initially, there should be no recent searches
    expect(queryByText('Recent Searches')).toBeNull();

    // Search for a Pokemon
    const searchInput = getByPlaceholderText('Enter Pokemon name or ID');
    fireEvent.changeText(searchInput, 'pikachu');

    // Press the search button
    const searchButton = getByText('Search');
    fireEvent.press(searchButton);

    // Wait for the Pokemon data to be displayed
    await waitFor(() => {
      expect(getByText('Pikachu #25')).toBeTruthy();
    });

    // Clear the search
    fireEvent.changeText(searchInput, '');
    fireEvent.press(searchButton);

    // Now recent searches should be visible
    await waitFor(() => {
      expect(getByText('Recent Searches')).toBeTruthy();
      expect(getByText('pikachu')).toBeTruthy();
    });
  });

  test('allows selecting a Pokemon from popular list', async () => {
    const { getByText } = render(<PokemonScreen />);

    // Check if popular Pokemon section is rendered
    expect(getByText('Popular Pokemon')).toBeTruthy();

    // Select a Pokemon from the popular list
    const popularPokemon = getByText('Pikachu');
    fireEvent.press(popularPokemon);

    // Wait for the Pokemon data to be displayed
    await waitFor(() => {
      expect(getByText('Pikachu #25')).toBeTruthy();
    });
  });
});
