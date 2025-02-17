#!/bin/bash

# Navigate to the frontend directory and run tests
echo "Running frontend tests..."
cd CarerConnect_frontend || { echo "Frontend directory not found"; exit 1; }
npm run test -- --runInBand
npm run e2e 
cd ..

# Navigate to the backend directory and run tests
echo "Running backend tests..."
cd CarerConnect_backend || { echo "Backend directory not found"; exit 1; }
npm run test -- --runInBand
 || { echo "Backend tests failed"; exit 1; }
cd ..

echo "All tests completed successfully!"
