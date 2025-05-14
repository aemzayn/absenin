FROM node:24-alpine

WORKDIR /usr/src/app

COPY . .

RUN npm install

# Generate Prisma client
RUN npm run db:generate

# Build the TypeScript code
RUN npm run build

EXPOSE 5000

CMD ["node", "dist/index.js"]