FROM node:lts-alpine

#creates standard working directory
WORKDIR /usr/src/app

# Install dotenvx
RUN curl -sfS https://dotenvx.sh/install.sh | sh

#copies package.json and package.lock.json for earlier caching
COPY package*.json ./

RUN npm install

#bundles the app source
COPY . .

RUN npx prisma generate

ENV NODE_ENV=${NODE_ENV}

# Builds TypeScript only in production
RUN if [ "$NODE_ENV" = "production" ] ; then npm run build ; fi

#exposing port 8080
EXPOSE 8080

# CMD ["npm", "run", "dev"]
CMD ["npm", "start"]

RUN chmod +x docker-entrypoint.sh
ENTRYPOINT ["sh", "./docker-entrypoint.sh"]