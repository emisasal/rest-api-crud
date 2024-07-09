FROM node:lts-alpine

#sets NODE_ENV to "development"
ENV NODE_ENV development

#creates standard working directory
WORKDIR /usr/src/app

#copies package.json and package.lock.json for earlier caching
COPY package*.json ./

RUN npm install

#bundles the app source
COPY . .

# #builds the typescript
# RUN yarn build

#exposing port 8080
EXPOSE 8080

CMD ["npm", "run", "dev"]