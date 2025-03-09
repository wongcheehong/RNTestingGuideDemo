import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

// Calculator logic functions - these will be unit tested
export const add = (a: number, b: number): number => a + b;
export const subtract = (a: number, b: number): number => a - b;
export const multiply = (a: number, b: number): number => a * b;
export const divide = (a: number, b: number): number => {
  if (b === 0) throw new Error('Division by zero');
  return a / b;
};

interface CalculatorProps {
  testID?: string;
}

export const Calculator: React.FC<CalculatorProps> = ({ testID = 'calculator' }) => {
  const [num1, setNum1] = useState<string>('');
  const [num2, setNum2] = useState<string>('');
  const [operation, setOperation] = useState<string>('+');
  const [result, setResult] = useState<string>('');
  const [error, setError] = useState<string>('');

  const calculate = () => {
    setError('');
    
    const a = parseFloat(num1);
    const b = parseFloat(num2);
    
    if (isNaN(a) || isNaN(b)) {
      setError('Please enter valid numbers');
      return;
    }
    
    try {
      let calculatedResult: number;
      switch (operation) {
        case '+':
          calculatedResult = add(a, b);
          break;
        case '-':
          calculatedResult = subtract(a, b);
          break;
        case '*':
          calculatedResult = multiply(a, b);
          break;
        case '/':
          calculatedResult = divide(a, b);
          break;
        default:
          setError('Invalid operation');
          return;
      }
      setResult(calculatedResult.toString());
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An error occurred');
      }
    }
  };

  return (
    <View style={styles.container} testID={testID}>
      <Text style={styles.title}>Simple Calculator</Text>
      
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={num1}
          onChangeText={setNum1}
          keyboardType="numeric"
          placeholder="Enter first number"
          testID={`${testID}-input1`}
        />
        
        <View style={styles.operationContainer}>
          {['+', '-', '*', '/'].map((op) => (
            <TouchableOpacity
              key={op}
              style={[
                styles.operationButton,
                operation === op && styles.selectedOperation,
              ]}
              onPress={() => setOperation(op)}
              testID={`${testID}-operation-${op}`}
            >
              <Text style={styles.operationText}>{op}</Text>
            </TouchableOpacity>
          ))}
        </View>
        
        <TextInput
          style={styles.input}
          value={num2}
          onChangeText={setNum2}
          keyboardType="numeric"
          placeholder="Enter second number"
          testID={`${testID}-input2`}
        />
      </View>
      
      <TouchableOpacity
        style={styles.calculateButton}
        onPress={calculate}
        testID={`${testID}-calculate`}
      >
        <Text style={styles.calculateButtonText}>Calculate</Text>
      </TouchableOpacity>
      
      {error ? (
        <Text style={styles.error} testID={`${testID}-error`}>{error}</Text>
      ) : result ? (
        <Text style={styles.result} testID={`${testID}-result`}>Result: {result}</Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 16,
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 8,
    marginBottom: 8,
  },
  operationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 8,
  },
  operationButton: {
    padding: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    backgroundColor: 'white',
    width: 40,
    alignItems: 'center',
  },
  selectedOperation: {
    backgroundColor: '#e0e0ff',
    borderColor: '#6666ff',
  },
  operationText: {
    fontSize: 18,
  },
  calculateButton: {
    backgroundColor: '#4a90e2',
    padding: 12,
    borderRadius: 4,
    alignItems: 'center',
  },
  calculateButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  result: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  error: {
    marginTop: 16,
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
  },
});

export default Calculator;
