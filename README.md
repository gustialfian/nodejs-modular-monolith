# Nodejs Modular Monolith

## Getting Started
```bash
npm install

cp .env.example .env

docker run --name db --rm \
  -e POSTGRES_PASSWORD=sandbox \
  -e POSTGRES_USER=sandbox \
  -e POSTGRES_DB=sandbox \
  -p 6543:5432 \
  postgres:13-alpine

# manualy run schema

npm run dev
```

## production
```bash
npm install -g pm2

pm2 start ecosystem.config.js
pm2 restart ecosystem.config.js
pm2 stop ecosystem.config.js
pm2 delete ecosystem.config.js
```

## test
```bash
docker-compose -f test.docker-compose.yaml up --build
```

## Component
- domain module: modul yang berhubungan dengan bisnis proses
  - controller: melakukan request, response, validation
  - service: bisnis logic.
  - repository: satu2nya component yang secara langsung mengakses DB
  - plain function
  - plain object
- shared module
  - plain function
  - plain object
  - constant
- infastructure module
  - configs
  - database
  - logger
- router.js: list route
- server.js: bootstraping all module
- app.js: entry point