# Build stage
FROM node:lts-alpine AS build

#creates standard working directory
WORKDIR /usr/src/app

#copies package.json and package.lock.json for earlier caching
COPY package*.json ./

RUN npm install

#bundles the app source
COPY . .

RUN npx prisma generate

# db seeds
RUN if [ "$BUILD" = "1" ] ; then chmod +x docker-entrypoint.sh ; fi
ENTRYPOINT ["sh", "./docker-entrypoint.sh"]

# Production stage
FROM node:lts-alpine AS production

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci --only=production

RUN npm run build

COPY --from=build /usr/src/app/dist/ ./dist/

CMD ["npm", "start"]





# FROM node:lts-alpine

# #creates standard working directory
# WORKDIR /usr/src/app

# # Install dotenvx
# RUN curl -sfS https://dotenvx.sh/install.sh | sh

# #copies package.json and package.lock.json for earlier caching
# COPY package*.json ./

# RUN npm install

# #bundles the app source
# COPY . .

# ARG BUILD

# RUN if [ "$BUILD" = "1" ] ; then npx prisma generate ; fi

# ENV NODE_ENV=${NODE_ENV}

# # Builds TypeScript only in production
# RUN if [ "$NODE_ENV" = "production" ] ; then npm run build ; fi

# #exposing port 8080
# EXPOSE 8080

# CMD ["npm", "start"]

# RUN if [ "$BUILD" = "1" ] ; then chmod +x docker-entrypoint.sh ; fi
# ENTRYPOINT ["sh", "./docker-entrypoint.sh"]