# Neo Sales Dashboard Testing Documentation

## Overview

This document outlines the comprehensive testing approach for the Neo Sales Dashboard API. The testing suite includes:

1. **Unit Tests** for models and business logic
2. **Integration Tests** for API endpoints

## Test Structure

The tests are organized into the following categories:

### Unit Tests

- `test_models_comprehensive.py`: Tests for all model classes, validating creation, constraints, and field validations
- `test_services.py`: Tests for service layer classes that implement business logic

### Integration Tests

- `test_api_users_comprehensive.py`: Tests for user-related API endpoints
- `test_api_collections_comprehensive.py`: Tests for collection-related API endpoints
- `test_api_cards_comprehensive.py`: Tests for card-related API endpoints
- `test_api_orders_comprehensive.py`: Tests for order-related API endpoints
- `test_api_dashboard_comprehensive.py`: Tests for dashboard KPI endpoints
- `test_api_auth_comprehensive.py`: Tests for authentication endpoints

### Base Test Classes

- `test_api_base.py`: Contains the `APIBaseTest` class that provides common setup for API tests

## Running Tests

### Using the Test Runner Script

A convenient test runner script is provided to execute the tests. The script can be found at `sales_api/tests/run_comprehensive_tests.py`.

```bash
# Make the script executable (if not already)
chmod +x sales_api/tests/run_comprehensive_tests.py

# Run all comprehensive tests
./sales_api/tests/run_comprehensive_tests.py --all

# Run specific test categories
./sales_api/tests/run_comprehensive_tests.py --models --services
./sales_api/tests/run_comprehensive_tests.py --api-users --api-collections

# Run with verbose output
./sales_api/tests/run_comprehensive_tests.py --all --verbose
```

### Using Django's Test Command

Alternatively, you can use Django's built-in test command:

```bash
# Run all tests
python manage.py test sales_api.tests

# Run specific test modules
python manage.py test sales_api.tests.test_models_comprehensive
python manage.py test sales_api.tests.test_api_users_comprehensive

# Run with verbose output
python manage.py test sales_api.tests -v 2
```

## Test Coverage

### Models

The model tests cover:

- Object creation with valid data
- Field validations and constraints
- Choice field validations
- Unique constraints
- Default values
- Model relationships

### Services

The service tests cover:

- Business logic implementation
- Data aggregation and calculations
- Error handling
- Edge cases

### API Endpoints

The API tests cover:

- Authentication and authorization
- Response status codes
- Response data structure and content
- Query parameters and filtering
- Pagination
- Error responses
- Data validation

## Test Data

Each test suite creates its own test data during the `setUp` phase. This ensures that tests are isolated and can be run independently.

## Mocking

Where appropriate, external dependencies are mocked to ensure tests are focused on the specific functionality being tested.

## Continuous Integration

It's recommended to integrate these tests into your CI/CD pipeline to ensure code quality is maintained with each commit.

## Extending the Test Suite

When adding new features to the application:

1. Add unit tests for any new models or business logic
2. Add integration tests for any new API endpoints
3. Update existing tests if the behavior of existing features changes

## Best Practices

- Keep tests isolated and independent
- Use descriptive test method names
- Test both positive and negative scenarios
- Test edge cases and boundary conditions
- Maintain test data that is representative of real-world scenarios
- Regularly run the full test suite to catch regressions