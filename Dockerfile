FROM node:16.15.1-alpine

WORKDIR /server

COPY ./package.json .

RUN npm install

COPY . .

EXPOSE 8080

CMD npm start