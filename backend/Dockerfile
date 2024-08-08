FROM node:22-alpine3.19 AS deps

WORKDIR /app

COPY package*.json ./

RUN npm install --omit dev

FROM node:22-alpine3.19 AS build

WORKDIR /app

COPY --from=deps /app/node_modules /app/node_modules
COPY . .

RUN npm run build

FROM node:22-alpine3.19 AS run

WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./
COPY --from=deps /app/node_modules /app/node_modules
COPY --from=build /app/dist /app/dist

RUN npm prune --omit dev

EXPOSE ${BACKEND_PORT}

CMD ["npm", "start"]
