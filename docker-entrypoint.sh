#!/bin/bash

# Apply migrations
npm run seed

exec "$@"