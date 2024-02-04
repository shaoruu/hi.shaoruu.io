# Use an official Node.js runtime as the base image
FROM node:18

# Set the working directory in the container to /app
WORKDIR /app

# Copy package.json and package-lock.json into the directory
COPY package*.json ./

# Install any needed packages specified in package.json
RUN npm install --legacy-peer-deps

# Bundle the app source inside the Docker image
COPY . .

RUN npm run build

# Get Rust
RUN curl https://sh.rustup.rs -sSf | bash -s -- -y
ENV PATH=/root/.cargo/bin:$PATH
ENV USER root

# Get Protoc
RUN apt-get update \
  && DEBIAN_FRONTEND=noninteractive \
  apt-get install --no-install-recommends --assume-yes \
  protobuf-compiler

# Make port 4000 available to the world outside the Docker container
EXPOSE 4000

# Define the command to run the app
CMD [ "npm", "start" ]