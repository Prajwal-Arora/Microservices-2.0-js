FROM node:16.18.0 as node-image

WORKDIR /app
COPY package.json .
RUN npm install
COPY . .

CMD ["npm", "start"]