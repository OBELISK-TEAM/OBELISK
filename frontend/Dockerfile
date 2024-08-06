FROM node:20-alpine3.19

ARG BACKEND_HOST=$BACKEND_HOST
ARG BACKEND_PORT=$BACKEND_PORT

RUN apk add --no-cache python3 make g++ pkgconf cairo-dev pango-dev giflib-dev libjpeg-turbo-dev

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE ${FRONTEND_PORT}

CMD ["npm", "run", "start-docker"]
