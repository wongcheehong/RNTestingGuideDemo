import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

interface PokemonStatsProps {
  stats: Array<{
    base_stat: number;
    stat: {
      name: string;
    };
  }>;
}

export const PokemonStats: React.FC<PokemonStatsProps> = ({ stats }) => {
  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionHeader}>Base Stats</Text>
      {stats.map((statInfo, index) => (
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
  );
};

// Format stat name for display
const formatStatName = (name: string) => {
  return name
    .replace(/-/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
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
});
