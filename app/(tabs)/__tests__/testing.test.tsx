import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import TestingDemoScreen from '../testing-demo';

// Mock the components to isolate the screen test
jest.mock('@/components/Calculator', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  return {
    __esModule: true,
    default: ({ testID }: { testID: string }) => (
      <View testID={testID}>
        <Text>Calculator Mock</Text>
      </View>
    ),
  };
});

jest.mock('@/components/UserForm', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  return {
    __esModule: true,
    default: ({ testID }: { testID: string }) => (
      <View testID={testID}>
        <Text>UserForm Mock</Text>
      </View>
    ),
  };
});

describe('TestingDemoScreen', () => {
  test('renders correctly with all sections', () => {
    const { getByText, getByTestId } = render(<TestingDemoScreen />);

    // Check if the screen title is rendered
    expect(getByText('Testing Demo')).toBeTruthy();
    expect(
      getByText(
        'This screen demonstrates components with unit and integration tests',
      ),
    ).toBeTruthy();

    // Check if section titles are rendered
    expect(getByText('Calculator Component')).toBeTruthy();
    expect(getByText('User Form Component')).toBeTruthy();

    // Check if the components are rendered with correct testIDs
    expect(getByTestId('demo-calculator')).toBeTruthy();
    expect(getByTestId('demo-user-form')).toBeTruthy();
  });
});
