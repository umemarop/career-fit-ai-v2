FROM node:20-slim

WORKDIR /app

RUN apt-get update -y && apt-get install -y openssl

COPY package*.json ./

RUN npm install

COPY . .

ENV DATABASE_URL="postgresql://postgres:postgres@localhost:5432/dummy?schema=public"

RUN npm run build

EXPOSE 4000

CMD ["npm", "run", "start"]