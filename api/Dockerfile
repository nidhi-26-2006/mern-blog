FROM node:20.9.0
RUN npm install -g nodemon
WORKDIR /app

COPY . . 
RUN npm install
EXPOSE 3000
CMD ["npm","run","dev"]