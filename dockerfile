# Use an official Node.js runtime as a parent image
FROM node:16

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install the application dependencies
RUN npm install

# Copy the rest of your application source code to the container
COPY . .

# Expose a port (if your Node.js application listens on a specific port)
EXPOSE 3001

# Define the command to start your Node.js application
CMD ["node", "index.js"]
