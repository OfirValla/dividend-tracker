# Use Node.js as the base image
FROM node:18

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json tsconfig.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Compile TypeScript
RUN npm run build

# Expose the app port
EXPOSE 3001

WORKDIR /app/dist

# Start the compiled application
CMD ["node", "server.js"]
