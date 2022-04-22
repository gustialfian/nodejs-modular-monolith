const { Pool } = require('pg');

const { logger } = require('../logger');
const {
  db: { host, port, user, password, database },
} = require('../configs');

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const config = {
  user,
  host,
  database,
  password,
  port,
};

let client;

async function connect() {
  if (client) {
    return client;
  }

  const pool = new Pool(config);

  while (true) {
    try {
      client = await pool.connect();

      await client.query('SELECT NOW()');
      break;
    } catch (err) {
      logger.error(
        `Failed to connect to db, retrying in 3 seconds. Error : ${err.message}`,
      );
      await delay(5000);
    }
  }

  return client;
}

module.exports = {
  connect,
};
