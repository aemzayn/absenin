# Step 1: Build the app
FROM node:22 AS builder
WORKDIR /app

# Copy dependencies first (better caching)
COPY package*.json tsconfig.json ./
RUN npm install

# Copy the rest of the code and build it
COPY ./src ./src
RUN npm run build

# Step 2: Run the app
FROM node:22-slim
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY package*.json ./
RUN npm install --omit=dev

CMD ["node", "dist/index.js"]
