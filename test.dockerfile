FROM node:14.17.4

WORKDIR /workspace

RUN mkdir ./logs

COPY ./package.json ./
COPY ./package-lock.json ./

ENV NODE_ENV=test

RUN npm ci --no-optional

COPY src ./src/
COPY tests ./tests

CMD ["npm", "run", "test"]
