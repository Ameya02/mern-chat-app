FROM node:18-alpine

WORKDIR /app

COPY package*.json .

RUN npm install

COPY . .

RUN npm install -g nodemon


EXPOSE 3001

WORKDIR /app/frontend

RUN npm install

EXPOSE 3000 

WORKDIR /app
CMD ["npm", "run", "dev"]
