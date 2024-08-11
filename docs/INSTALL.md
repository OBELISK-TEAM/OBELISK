# Installation Guide

This document contains information crucial for using and developing the project.

## Env file

An `.env` file with the following content is required at the root of the project (where `docker-compose.yml` is located): 

```
# frontend - for docker only
FRONTEND_HOST=0.0.0.0
FRONTEND_PORT=5000

# backend
BACKEND_HOST=localhost
BACKEND_PORT=4000
JWT_SECRET=secret
JWT_EXPIRES_IN=7d
GOOGLE_CLIENT_ID=id
GOOGLE_CLIENT_SECRET=secret
GOOGLE_CALLBACK_URL=http://localhost:4000/auth/google/callback

# database
DB_NAME=mongo_obelisk
DB_USER=admin
DB_PASSWORD=password
DB_HOST=localhost
DB_PORT=27017 # must be set to 27017
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
