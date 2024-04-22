FROM node:20
COPY . .
WORKDIR /app
RUN npm install
EXPOSE 3001

ENV BASE_URL=https://url-simplifier-api-production.up.railway.app

CMD ["npm", "run", "start:dev"]