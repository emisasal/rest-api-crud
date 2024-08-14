#!/bin/bash

# Apply migrations
# npx prisma migrate deploy
npm run seed

exec "$@"