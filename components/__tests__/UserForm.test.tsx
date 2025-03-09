import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import UserForm, { validateEmail, validatePassword, validateName, FormData } from '../UserForm';

// Unit tests for validation functions
describe('Form Validation Functions', () => {
  // Email validation tests
  test('validateEmail correctly validates email addresses', () => {
    // Valid emails
    expect(validateEmail('test@example.com')).toBe(true);
    expect(validateEmail('user.name@domain.co.uk')).toBe(true);
    expect(validateEmail('user+tag@example.org')).toBe(true);
    
    // Invalid emails
    expect(validateEmail('invalid')).toBe(false);
    expect(validateEmail('invalid@')).toBe(false);
    expect(validateEmail('@example.com')).toBe(false);
    expect(validateEmail('invalid@example')).toBe(false);
    expect(validateEmail('')).toBe(false);
  });

  // Password validation tests
  test('validatePassword correctly validates passwords', () => {
    // Valid passwords (at least 6 characters)
    expect(validatePassword('password')).toBe(true);
    expect(validatePassword('123456')).toBe(true);
    
    // Invalid passwords (less than 6 characters)
    expect(validatePassword('pass')).toBe(false);
    expect(validatePassword('')).toBe(false);
  });

  // Name validation tests
  test('validateName correctly validates names', () => {
    // Valid names (non-empty)
    expect(validateName('John')).toBe(true);
    expect(validateName('J')).toBe(true);
    
    // Invalid names (empty)
    expect(validateName('')).toBe(false);
    expect(validateName('  ')).toBe(false);
  });
});

// Integration tests for the UserForm component
describe('UserForm Component', () => {
  test('renders correctly', () => {
    const { getByText, getByTestId } = render(<UserForm />);
    
    // Check if the title is rendered
    expect(getByText('User Registration')).toBeTruthy();
    
    // Check if form fields are rendered
    expect(getByText('Name')).toBeTruthy();
    expect(getByText('Email')).toBeTruthy();
    expect(getByText('Password')).toBeTruthy();
    
    // Check if submit button is rendered
    expect(getByText('Register')).toBeTruthy();
  });

  test('shows validation errors for empty form submission', async () => {
    const { getByText, getByTestId, findByText } = render(<UserForm />);
    
    // Submit the form without filling any fields
    fireEvent.press(getByText('Register'));
    
    // Check if validation errors are displayed
    expect(await findByText('Name is required')).toBeTruthy();
    expect(await findByText('Please enter a valid email')).toBeTruthy();
    expect(await findByText('Password must be at least 6 characters')).toBeTruthy();
  });

  test('clears errors when user types in fields', async () => {
    const { getByText, getByTestId, queryByText } = render(<UserForm />);
    
    // Submit form to trigger errors
    fireEvent.press(getByText('Register'));
    
    // Verify errors are shown
    expect(getByText('Name is required')).toBeTruthy();
    
    // Type in the name field
    fireEvent.changeText(getByTestId('user-form-name-input'), 'John Doe');
    
    // Verify name error is cleared
    expect(queryByText('Name is required')).toBeNull();
    
    // Errors for other fields should still be present
    expect(getByText('Please enter a valid email')).toBeTruthy();
    expect(getByText('Password must be at least 6 characters')).toBeTruthy();
  });

  test('submits form with valid data', async () => {
    // Mock the onSubmit function
    const mockOnSubmit = jest.fn();
    
    const { getByText, getByTestId, findByText } = render(
      <UserForm onSubmit={mockOnSubmit} />
    );
    
    // Fill in the form with valid data
    fireEvent.changeText(getByTestId('user-form-name-input'), 'John Doe');
    fireEvent.changeText(getByTestId('user-form-email-input'), 'john@example.com');
    fireEvent.changeText(getByTestId('user-form-password-input'), 'password123');
    
    // Submit the form
    fireEvent.press(getByText('Register'));
    
    // Check if success message is displayed
    expect(await findByText('Registration Successful!')).toBeTruthy();
    
    // Check if onSubmit was called with the correct data
    expect(mockOnSubmit).toHaveBeenCalledWith({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123'
    });
  });

  test('can reset form after successful submission', async () => {
    const { getByText, getByTestId, findByText, queryByText } = render(<UserForm />);
    
    // Fill in the form with valid data
    fireEvent.changeText(getByTestId('user-form-name-input'), 'John Doe');
    fireEvent.changeText(getByTestId('user-form-email-input'), 'john@example.com');
    fireEvent.changeText(getByTestId('user-form-password-input'), 'password123');
    
    // Submit the form
    fireEvent.press(getByText('Register'));
    
    // Check if success message is displayed
    expect(await findByText('Registration Successful!')).toBeTruthy();
    
    // Reset the form
    fireEvent.press(getByText('Register Another User'));
    
    // Check if the form is reset
    expect(queryByText('Registration Successful!')).toBeNull();
    expect(getByText('Register')).toBeTruthy();
  });
});
