#!/bin/bash

# Navigate to the frontend directory and run tests
echo "Running frontend tests..."
cd CarerConnect_frontend 
npm run test -- --runInBand
echo "Running end-to-end tests..."
npm run e2e 
cd ..

# Navigate to the backend directory and run tests
echo "Running backend tests..."
cd CarerConnect_backend 
npm run test -- --runInBand
cd ..

echo "All tests completed successfully!"
