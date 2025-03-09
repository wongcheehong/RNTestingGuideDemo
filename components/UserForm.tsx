import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

// Form validation functions - these will be unit tested
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): boolean => {
  return password.length >= 6;
};

export const validateName = (name: string): boolean => {
  return name.trim().length > 0;
};

interface UserFormProps {
  onSubmit?: (formData: FormData) => void;
  testID?: string;
}

export interface FormData {
  name: string;
  email: string;
  password: string;
}

export const UserForm: React.FC<UserFormProps> = ({ 
  onSubmit,
  testID = 'user-form'
}) => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: ''
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user types
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!validateName(formData.name)) {
      newErrors.name = 'Name is required';
    }
    
    if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!validatePassword(formData.password)) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      setSubmitted(true);
      if (onSubmit) {
        onSubmit(formData);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      password: ''
    });
    setErrors({});
    setSubmitted(false);
  };

  return (
    <ScrollView>
      <View style={styles.container} testID={testID}>
        <Text style={styles.title}>User Registration</Text>
        
        {submitted ? (
          <View style={styles.successContainer} testID={`${testID}-success`}>
            <Text style={styles.successText}>Registration Successful!</Text>
            <Text style={styles.submittedData}>Name: {formData.name}</Text>
            <Text style={styles.submittedData}>Email: {formData.email}</Text>
            <TouchableOpacity 
              style={styles.resetButton} 
              onPress={resetForm}
              testID={`${testID}-reset`}
            >
              <Text style={styles.resetButtonText}>Register Another User</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Name</Text>
              <TextInput
                style={[styles.input, errors.name && styles.inputError]}
                value={formData.name}
                onChangeText={(value) => handleChange('name', value)}
                placeholder="Enter your name"
                testID={`${testID}-name-input`}
              />
              {errors.name && (
                <Text style={styles.errorText} testID={`${testID}-name-error`}>{errors.name}</Text>
              )}
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={[styles.input, errors.email && styles.inputError]}
                value={formData.email}
                onChangeText={(value) => handleChange('email', value)}
                placeholder="Enter your email"
                keyboardType="email-address"
                autoCapitalize="none"
                testID={`${testID}-email-input`}
              />
              {errors.email && (
                <Text style={styles.errorText} testID={`${testID}-email-error`}>{errors.email}</Text>
              )}
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                style={[styles.input, errors.password && styles.inputError]}
                value={formData.password}
                onChangeText={(value) => handleChange('password', value)}
                placeholder="Enter your password"
                secureTextEntry
                testID={`${testID}-password-input`}
              />
              {errors.password && (
                <Text style={styles.errorText} testID={`${testID}-password-error`}>{errors.password}</Text>
              )}
            </View>
            
            <TouchableOpacity 
              style={styles.submitButton} 
              onPress={handleSubmit}
              testID={`${testID}-submit`}
            >
              <Text style={styles.submitButtonText}>Register</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 10,
  },
  inputError: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    marginTop: 4,
    fontSize: 12,
  },
  submitButton: {
    backgroundColor: '#4a90e2',
    padding: 12,
    borderRadius: 4,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  successContainer: {
    alignItems: 'center',
    padding: 16,
  },
  successText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'green',
    marginBottom: 16,
  },
  submittedData: {
    fontSize: 16,
    marginBottom: 8,
  },
  resetButton: {
    backgroundColor: '#4a90e2',
    padding: 12,
    borderRadius: 4,
    alignItems: 'center',
    marginTop: 16,
  },
  resetButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default UserForm;
