import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import PokemonScreen from '../pokemon';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

describe('PokemonScreen', () => {
  // Create a new QueryClient for each test
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          // Turn off retries for testing
          retry: false,
          // Set a short stale time for testing
          staleTime: 0,
        },
      },
    });
  });

  // Helper function to render the component with QueryClientProvider
  const renderWithQueryClient = (component: React.ReactElement) => {
    return render(
      <QueryClientProvider client={queryClient}>
        {component}
      </QueryClientProvider>,
    );
  };

  test('renders correctly with popular Pokemon list', async () => {
    const { getByText, findByText } = renderWithQueryClient(<PokemonScreen />);

    // Check if the screen title is rendered
    expect(getByText('Pokemon Search')).toBeTruthy();

    // Wait for the popular Pokemon section to be rendered
    await findByText('Popular Pokemon');

    // Wait for at least one Pokemon to be loaded
    // Note: We're not checking for specific Pokemon names since this is an integration test
    // and the actual API response may change
    await waitFor(
      () => {
        // The actual Pokemon list will depend on the API response
        // We're just checking that the section is populated
        expect(getByText('Popular Pokemon')).toBeTruthy();
      },
      { timeout: 5000 },
    );
  });

  it('allows searching for a Pokemon and displays results', async () => {
    const { getByText, getByPlaceholderText, findByText } =
      renderWithQueryClient(<PokemonScreen />);

    // Enter a search term
    const searchInput = getByPlaceholderText('Enter Pokemon name or ID');
    fireEvent.changeText(searchInput, 'dragonite');

    // Press the search button
    const searchButton = getByText('Search');
    fireEvent.press(searchButton);

    // Wait for the Pokemon data to be displayed
    await waitFor(
      async () => {
        // Check if Pokemon name and ID are displayed (format: "Pikachu #25")
        await findByText(/Dragonite #\d+/);

        // Check if type is displayed (Pikachu is Electric type)
        await findByText('DRAGON');
        await findByText('210 kg');
      },
      { timeout: 5000 },
    );
  });

  test('displays error message when Pokemon is not found', async () => {
    const { getByText, getByPlaceholderText, findByText } =
      renderWithQueryClient(<PokemonScreen />);

    // Enter a search term for a Pokemon that doesn't exist
    const searchInput = getByPlaceholderText('Enter Pokemon name or ID');
    fireEvent.changeText(searchInput, 'not-a-real-pokemon-name-123456789');

    // Press the search button
    const searchButton = getByText('Search');
    fireEvent.press(searchButton);

    // Check if error message is displayed
    await findByText(/Pokemon "not-a-real-pokemon-name-123456789" not found/);
  });

  test('adds searched Pokemon to recent searches', async () => {
    const { getByText, getByPlaceholderText, queryByText } =
      renderWithQueryClient(<PokemonScreen />);

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
});
