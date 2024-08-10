FROM node:lts-alpine

#sets NODE_ENV to "development"
# ENV NODE_ENV development

#creates standard working directory
WORKDIR /usr/src/app

# Install dotenvx
RUN curl -sfS https://dotenvx.sh/install.sh | sh

#copies package.json and package.lock.json for earlier caching
COPY package*.json ./

RUN npm install

#bundles the app source
COPY . .

# #builds the typescript
# RUN npm run build

#exposing port 8080
EXPOSE 8080

# CMD ["npm", "run", "dev"]
# CMD ["npm", "run", "exp"]