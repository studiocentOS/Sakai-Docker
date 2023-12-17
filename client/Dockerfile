FROM node:21.1.0

WORKDIR /app

COPY package.json .

COPY . .

RUN npm install 

EXPOSE 3000

CMD ["npm", "run", "dev"]