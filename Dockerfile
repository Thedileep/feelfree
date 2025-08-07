# Base image
FROM node:18

# Set working directory
WORKDIR /app

# Copy server files
COPY server ./server

# Install server dependencies
WORKDIR /app/server
RUN npm install

# Copy client files
WORKDIR /app
COPY clients ./clients

# Install client dependencies & build
WORKDIR /app/clients
RUN npm install
RUN npm run build

# Serve frontend from backend
# You must move built files into backend's public folder (or set static serve)
RUN mkdir -p /app/server/public
RUN cp -r /app/clients/dist/* /app/server/public

# Back to server and start app
WORKDIR /app/server

# Expose server port
EXPOSE 4000

# Start backend
CMD ["npm", "start"]
