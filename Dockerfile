# Base image
FROM node:latest as build

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire app
COPY . .

# Build the app
RUN npm run build:prod

# ----------------------
# Production image
FROM node:latest

# Set the working directory
WORKDIR /app

# Copy the built app from the build stage
COPY --from=build /app/dist /app/dist

# Install serve globally
RUN npm install -g serve

# Expose port 80
EXPOSE 80

# Serve the app using serve
CMD ["serve", "-s", "dist", "-l", "80"]

