FROM mhart/alpine-node:16.4.2

ENV APP_ENV ${APP_ENV}
ENV APP_PORT ${APP_PORT}

WORKDIR /app
COPY package.json package-lock.json .env ./
RUN npm ci

FROM mhart/alpine-node:16.4.2

WORKDIR /app

ENV APP_ENV ${APP_ENV}
ENV APP_PORT ${APP_PORT}

COPY --from=0 /app .
COPY ./src .

EXPOSE ${APP_PORT}
CMD ["node", "./app.js"]