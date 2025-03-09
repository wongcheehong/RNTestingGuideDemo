import { StyleSheet, View, Text } from 'react-native';
import * as Battery from 'expo-battery';
import { useEffect, useState } from 'react';

export default function BatteryScreen() {
  const [batteryLevel, setBatteryLevel] = useState<number | null>(null);
  const [isLowBattery, setIsLowBattery] = useState(false);

  useEffect(() => {
    // Function to get the battery level
    async function getBatteryLevel() {
      const level = await Battery.getBatteryLevelAsync();
      setBatteryLevel(level);
      setIsLowBattery(level < 0.2); // Check if battery is less than 20%
    }

    // Initial battery level check
    getBatteryLevel();

    // Set up a listener for battery level changes
    const subscription = Battery.addBatteryLevelListener(({ batteryLevel }) => {
      setBatteryLevel(batteryLevel);
      setIsLowBattery(batteryLevel < 0.2);
    });

    // Clean up the listener when component unmounts
    return () => {
      subscription.remove();
    };
  }, []);

  // Function to get battery description
  const getBatteryDescription = () => {
    if (batteryLevel === null) return 'Checking battery level...';

    const percentage = Math.round(batteryLevel * 100);

    if (isLowBattery) {
      return `Your battery is at ${percentage}%. Please charge your device soon!`;
    } else if (percentage <= 50) {
      return `Your battery is at ${percentage}%. You have enough power for now.`;
    } else {
      return `Your battery is at ${percentage}%. You have plenty of power!`;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.batteryContainer}>
        <Text style={styles.title}>Battery Status</Text>

        {batteryLevel !== null && (
          <View style={styles.batteryIndicator}>
            <View
              style={[
                styles.batteryLevel,
                {
                  width: `${Math.round(batteryLevel * 100)}%`,
                  backgroundColor: isLowBattery ? '#FF6B6B' : '#4CAF50',
                },
              ]}
            />
          </View>
        )}

        <Text style={[styles.percentage, isLowBattery && styles.lowBattery]}>
          {batteryLevel !== null
            ? `${Math.round(batteryLevel * 100)}%`
            : 'Loading...'}
        </Text>

        <Text style={styles.description}>{getBatteryDescription()}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#121212',
  },
  batteryContainer: {
    width: '100%',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#1E1E1E',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 30,
    textAlign: 'center',
  },
  batteryIndicator: {
    width: '100%',
    height: 30,
    backgroundColor: '#333',
    borderRadius: 15,
    overflow: 'hidden',
    marginBottom: 15,
  },
  batteryLevel: {
    height: '100%',
  },
  percentage: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  lowBattery: {
    color: '#FF6B6B',
  },
  description: {
    fontSize: 18,
    color: '#ccc',
    textAlign: 'center',
    lineHeight: 24,
  },
});
