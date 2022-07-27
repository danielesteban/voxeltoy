FROM node:gallium

ENV NODE_ENV=production

RUN mkdir -p /usr/src/server
WORKDIR /usr/src/server

COPY package.json package.json
COPY package-lock.json package-lock.json
RUN npm ci

COPY . .

USER node

CMD [ "node", "main.mjs" ]
