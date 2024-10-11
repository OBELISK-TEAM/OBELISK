FROM node:21-alpine3.19 AS deps

RUN apk add --no-cache python3 make g++ pango-dev

WORKDIR /app

COPY package*.json ./

RUN npm install

FROM node:21-alpine3.19 AS build

ARG APP_ENV
ARG SERVER_HOST
ARG SERVER_PORT
ARG SERVER_GW_PORT
ARG GOOGLE_CLIENT_ID
ARG GOOGLE_CLIENT_SECRET
ARG GOOGLE_CALLBACK_URL

RUN apk add --no-cache python3 make g++ pango-dev

WORKDIR /app

COPY --from=deps /app/node_modules /app/node_modules
COPY . .

RUN npm run build

FROM node:21-alpine3.19 AS run

WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./
COPY --from=build /app/node_modules /app/node_modules
COPY --from=build /app/.next /app/.next

RUN npm prune --omit dev

EXPOSE ${CLIENT_PORT}

CMD ["npm", "run", "start-docker"]
