FROM node:alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# EXPOSE PORT

ENV VITE_API_URL=http://localhost:3000

CMD ["npm", "run", "dev"]
