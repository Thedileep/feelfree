# server/Dockerfile

FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Use appropriate entry file (e.g., index.js or server.js)
CMD ["node", "index.js"]

EXPOSE 4000
