#!/usr/bin/env python
"""
Comprehensive Test Runner Script

This script runs all the comprehensive test suites for the Neo Sales Dashboard API.
It provides a convenient way to execute all tests or specific test categories.

Usage:
    python run_comprehensive_tests.py [options]

Options:
    --all           Run all comprehensive tests (default if no option is specified)
    --models        Run only model tests
    --services      Run only service tests
    --api-users     Run only user API tests
    --api-collections Run only collections API tests
    --api-cards     Run only cards API tests
    --api-orders    Run only orders API tests
    --api-dashboard Run only dashboard API tests
    --api-auth      Run only authentication API tests
    --verbose       Run tests with verbose output
"""

import sys
import os
import django
from django.test.runner import DiscoverRunner

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'neo_sales_dashboard_backend.settings')
django.setup()

def run_tests(test_labels, verbosity=1):
    """Run the specified tests with the given verbosity level."""
    test_runner = DiscoverRunner(verbosity=verbosity)
    failures = test_runner.run_tests(test_labels)
    return failures

def main():
    """Parse command line arguments and run the appropriate tests."""
    verbosity = 1
    if '--verbose' in sys.argv:
        verbosity = 2
        sys.argv.remove('--verbose')
    
    # Define test modules
    test_modules = {
        '--models': ['sales_api.tests.test_models_comprehensive'],
        '--services': ['sales_api.tests.test_services'],
        '--api-users': ['sales_api.tests.test_api_users_comprehensive'],
        '--api-collections': ['sales_api.tests.test_api_collections_comprehensive'],
        '--api-cards': ['sales_api.tests.test_api_cards_comprehensive'],
        '--api-orders': ['sales_api.tests.test_api_orders_comprehensive'],
        '--api-dashboard': ['sales_api.tests.test_api_dashboard_comprehensive'],
        '--api-auth': ['sales_api.tests.test_api_auth_comprehensive'],
    }
    
    # All comprehensive tests
    all_tests = []
    for tests in test_modules.values():
        all_tests.extend(tests)
    
    # Determine which tests to run
    if len(sys.argv) == 1 or '--all' in sys.argv:
        # Run all tests if no specific option is provided or --all is specified
        test_labels = all_tests
    else:
        # Run specific test categories based on command line arguments
        test_labels = []
        for arg in sys.argv[1:]:
            if arg in test_modules:
                test_labels.extend(test_modules[arg])
    
    # Run the tests
    if test_labels:
        print(f"Running tests: {', '.join(test_labels)}")
        failures = run_tests(test_labels, verbosity=verbosity)
        sys.exit(bool(failures))
    else:
        print("No valid test options specified. Use --all to run all tests or specify test categories.")
        print("Available options:")
        for option in test_modules.keys():
            print(f"  {option}")
        print("  --all")
        print("  --verbose")
        sys.exit(1)

if __name__ == '__main__':
    main()