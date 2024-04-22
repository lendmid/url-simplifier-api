FROM node:20
COPY . .
WORKDIR /app
RUN npm install
EXPOSE 3001
CMD ["npm", "run", "start:dev"]