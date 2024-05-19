# Stage 1
FROM node:20 as build
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build


FROM node:20 as api
# Stage 2 - the production environment
COPY --from=build /app/dist /app/dist
COPY package*.json ./
EXPOSE 3001
CMD ["npm", "run", "start:prod"]