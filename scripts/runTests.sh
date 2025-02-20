#!/bin/bash

# Exit script if any command fails
set -e

# Function to install dependencies and run tests
run_tests() {
  local dir=$1
  echo "Navigating to $dir..."
  cd "$dir"

  # Install dependencies
  echo "Installing dependencies in $dir..."
  npm install

  # Run unit tests
  echo "Running unit tests in $dir..."
  npm run test -- --runInBand

  # Run E2E tests (only in frontend)
  if [[ "$dir" == "CarerConnect_frontend" ]]; then
    echo "Running end-to-end tests..."
    npm run e2e
  fi

  # Return to root directory
  cd ..
}

# Run tests in frontend and backend
run_tests "CarerConnect_frontend"
run_tests "CarerConnect_backend"

echo "All tests completed successfully!"
