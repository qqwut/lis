FROM node:10.16.0-alpine as builder
WORKDIR /workspace 

COPY package.json .

RUN npm install

COPY . .

CMD ["npm", "run", "start"]