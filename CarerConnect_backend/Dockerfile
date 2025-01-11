FROM node:lts-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json first to install dependencies
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application code
COPY . .

# Expose the port your app runs on
EXPOSE 3000

# Run the app
ENTRYPOINT [ "npm", "run", "dev" ]
