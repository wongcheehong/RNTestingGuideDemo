# Maestro E2E Tests

This directory contains Maestro end-to-end tests for the TestingGuideDemo app.

## Available Tests

- `registration_flow.yaml`: Tests the user registration flow in the Testing Demo tab

## Running Tests

To run a specific test:

```bash
maestro test .maestro/registration_flow.yaml
```

To run all tests in the `.maestro` directory:

```bash
maestro test .maestro/
```

## Test Structure

Each test follows a specific flow of user interactions with the app. For example, the registration flow:

1. Opens the app
2. Navigates to the "Testing Demo" tab
3. Scrolls to find the registration form
4. Fills in the form fields
5. Submits the form
6. Verifies successful registration

## Adding New Tests

To add a new test, create a new YAML file in this directory following the Maestro flow format.

## Documentation

For more information on Maestro, visit: https://maestro.mobile.dev/
