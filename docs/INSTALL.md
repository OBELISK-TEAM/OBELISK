# Installation Guide

This document contains information crucial for using and developing the project.

## Env file

An `.env` file with the following content is required at the root of the project (where `docker-compose.yml` is located): 

```
# frontend
FRONTEND_HOST = 'localhost'
FRONTEND_PORT = '4000'

# backend
BACKEND_HOST = 'localhost'
BACKEND_PORT = '8080'
JWT_SECRET = 'secret'
JWT_EXPIRES_IN = '7d'

# database
DB_NAME = 'mongo_obelisk'
DB_USER = 'admin'
DB_PASSWORD = 'password'
DB_HOST = 'localhost'
DB_PORT = '27017'
```
