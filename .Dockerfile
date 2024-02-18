FROM node:latest
WORKDIR /app

COPY package*.json ./
RUN npm install
ENV NODE_ENV production
RUN npm run build

COPY . .


EXPOSE 8080

CMD ["npm", "run", "start:prod"]