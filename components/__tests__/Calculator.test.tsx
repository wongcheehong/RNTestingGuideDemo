import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Calculator, { add, subtract, multiply, divide } from '../Calculator';

// Unit tests for calculator functions
describe('Calculator Math Functions', () => {
  // Testing the add function
  test('add function correctly adds two numbers', () => {
    expect(add(1, 2)).toBe(3);
    expect(add(-1, 1)).toBe(0);
    expect(add(0, 0)).toBe(0);
    expect(add(5.5, 4.5)).toBe(10);
  });

  // Testing the subtract function
  test('subtract function correctly subtracts two numbers', () => {
    expect(subtract(5, 2)).toBe(3);
    expect(subtract(1, 1)).toBe(0);
    expect(subtract(0, 5)).toBe(-5);
    expect(subtract(10.5, 5.5)).toBe(5);
  });

  // Testing the multiply function
  test('multiply function correctly multiplies two numbers', () => {
    expect(multiply(2, 3)).toBe(6);
    expect(multiply(-2, 3)).toBe(-6);
    expect(multiply(0, 5)).toBe(0);
    expect(multiply(2.5, 2)).toBe(5);
  });

  // Testing the divide function
  test('divide function correctly divides two numbers', () => {
    expect(divide(6, 2)).toBe(3);
    expect(divide(5, 2)).toBe(2.5);
    expect(divide(0, 5)).toBe(0);
  });

  // Testing division by zero error
  test('divide function throws error when dividing by zero', () => {
    expect(() => divide(5, 0)).toThrow('Division by zero');
  });
});

// Integration tests for the Calculator component
describe('Calculator Component', () => {
  test('renders correctly', () => {
    const { getByText, getByTestId } = render(<Calculator />);

    // Check if the title is rendered
    expect(getByText('Simple Calculator')).toBeTruthy();

    // Check if operation buttons are rendered
    expect(getByTestId('calculator-operation-+')).toBeTruthy();
    expect(getByTestId('calculator-operation--')).toBeTruthy();
    expect(getByTestId('calculator-operation-*')).toBeTruthy();
    expect(getByTestId('calculator-operation-/')).toBeTruthy();

    // Check if calculate button is rendered
    expect(getByText('Calculate')).toBeTruthy();
  });

  test('performs addition correctly', () => {
    const { getByTestId, getByText, queryByTestId } = render(<Calculator />);

    // Input values
    fireEvent.changeText(getByTestId('calculator-input1'), '5');
    fireEvent.changeText(getByTestId('calculator-input2'), '3');

    // Ensure + operation is selected (it's the default)
    fireEvent.press(getByTestId('calculator-operation-+'));

    // Press calculate
    fireEvent.press(getByTestId('calculator-calculate'));

    // Check result
    expect(getByTestId('calculator-result')).toBeTruthy();
    expect(getByText('Result: 8')).toBeTruthy();
    expect(queryByTestId('calculator-error')).toBeNull();
  });

  test('shows error for invalid input', () => {
    const { getByTestId, queryByTestId } = render(<Calculator />);

    // Leave inputs empty
    fireEvent.changeText(getByTestId('calculator-input1'), '');
    fireEvent.changeText(getByTestId('calculator-input2'), '');

    // Press calculate
    fireEvent.press(getByTestId('calculator-calculate'));

    // Check error
    expect(getByTestId('calculator-error')).toBeTruthy();
    expect(queryByTestId('calculator-result')).toBeNull();
  });

  test('shows error for division by zero', () => {
    const { getByTestId, queryByTestId, getByText } = render(<Calculator />);

    // Input values
    fireEvent.changeText(getByTestId('calculator-input1'), '5');
    fireEvent.changeText(getByTestId('calculator-input2'), '0');

    // Select division operation
    fireEvent.press(getByTestId('calculator-operation-/'));

    // Press calculate
    fireEvent.press(getByTestId('calculator-calculate'));

    // Check error
    expect(getByText('Division by zero')).toBeTruthy();
    expect(getByTestId('calculator-error')).toBeTruthy();
    expect(queryByTestId('calculator-result')).toBeNull();
  });

  test('can change operations', () => {
    const { getByTestId, getByText } = render(<Calculator />);

    // Input values
    fireEvent.changeText(getByTestId('calculator-input1'), '10');
    fireEvent.changeText(getByTestId('calculator-input2'), '2');

    // Test subtraction
    fireEvent.press(getByTestId('calculator-operation--'));
    fireEvent.press(getByTestId('calculator-calculate'));
    expect(getByText('Result: 8')).toBeTruthy();

    // Test multiplication
    fireEvent.press(getByTestId('calculator-operation-*'));
    fireEvent.press(getByTestId('calculator-calculate'));
    expect(getByText('Result: 20')).toBeTruthy();

    // Test division
    fireEvent.press(getByTestId('calculator-operation-/'));
    fireEvent.press(getByTestId('calculator-calculate'));
    expect(getByText('Result: 5')).toBeTruthy();
  });
});
