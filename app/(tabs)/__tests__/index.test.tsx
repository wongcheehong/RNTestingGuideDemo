import React from 'react';
import { render, cleanup } from '@testing-library/react-native';
import HomeScreen from '../index';
import * as Battery from 'expo-battery';

// Create a mock for the expo-battery module
jest.mock('expo-battery', () => ({
  getBatteryLevelAsync: jest.fn(),
  addBatteryLevelListener: jest.fn().mockReturnValue({
    remove: jest.fn()
  }),
}));

describe('HomeScreen', () => {
  // Clean up after each test
  afterEach(() => {
    cleanup();
    jest.clearAllMocks();
  });

  test('displays correct battery description when battery is at 15%', async () => {
    // Mock battery level to 15%
    (Battery.getBatteryLevelAsync as jest.Mock).mockResolvedValue(0.15);

    // Render the component
    const { findByText } = render(<HomeScreen />);

    // Wait for the battery level to be fetched and displayed
    const batteryDescription = await findByText(
      'Your battery is at 15%. Please charge your device soon!',
    );

    // Verify the low battery warning message is displayed
    expect(batteryDescription).toBeTruthy();
  });

  test('displays correct battery description when battery is at 40%', async () => {
    // Mock battery level to 40%
    (Battery.getBatteryLevelAsync as jest.Mock).mockResolvedValue(0.4);

    // Render the component
    const { findByText } = render(<HomeScreen />);

    // Wait for the battery level to be fetched and displayed
    const batteryDescription = await findByText(
      'Your battery is at 40%. You have enough power for now.',
    );

    // Verify the medium battery message is displayed
    expect(batteryDescription).toBeTruthy();
  });

  test('displays correct battery description when battery is at 80%', async () => {
    // Mock battery level to 80%
    (Battery.getBatteryLevelAsync as jest.Mock).mockResolvedValue(0.8);

    // Render the component
    const { findByText } = render(<HomeScreen />);

    // Wait for the battery level to be fetched and displayed
    const batteryDescription = await findByText(
      'Your battery is at 80%. You have plenty of power!',
    );

    // Verify the high battery message is displayed
    expect(batteryDescription).toBeTruthy();
  });
});
