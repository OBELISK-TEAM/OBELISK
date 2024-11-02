# Installation Guide

This document contains information crucial for using and developing the project.

## Env file

An `.env` file with the following content is required at the root of the project (where `docker-compose.yml` is located): 

```
# environment
APP_ENV=development # development/production

# client
CLIENT_HOST=0.0.0.0
CLIENT_PORT=3000
NEXT_GW_SERVER_HOST=localhost

# server
SERVER_HOST=localhost
SERVER_PORT=4000

RABBITMQ_HOST=localhost
RABBITMQ_PORT=5672
RABBITMQ_QUEUE=mailing-queue

RABBITMQ_MANAGEMENT_PORT=15672
RABBITMQ_USER=guest
RABBITMQ_PASS='guest

SOCKET_GW_PORT=4003

CORS_ORIGIN=http://localhost:3000

JWT_SECRET=secret
JWT_EXPIRES_IN=7d

SLIDE_LIMIT_PER_BOARD=15
MAX_BOARD_SIZE_IN_BYTES=15728640

GOOGLE_CLIENT_ID=id
GOOGLE_CLIENT_SECRET=secret
GOOGLE_CALLBACK_URL=http://localhost:4000/auth/google/callback

# database
DB_NAME=mongo_obelisk
DB_USER=admin
DB_PASSWORD=password
DB_HOST=localhost
DB_PORT=27017
DB_VOLUME_LOCATION = mongo_data:/data/db

```
## Running with docker compose

First, install `docker` and `docker compose`.

Run the following commands at the root of the project (where `docker-compose.yml` is located):

```
docker compose up --build -d
```

In order to stop the app, run the following command:

```
docker compose down
```
