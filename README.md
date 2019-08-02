# Nodejs Modular Monolith

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

## TODO
- dockerize app
- add test suit