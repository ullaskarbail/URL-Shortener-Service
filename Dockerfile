# Use official Node.js lightweight image
FROM node:18-alpine

# Create app directory inside the container
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

# Install only production dependencies
RUN npm install --only=production

# Bundle app source code into the container
COPY . .

# Bind the app to port 3000
EXPOSE 3000

# Command to run the application
CMD [ "node", "app.js" ]
