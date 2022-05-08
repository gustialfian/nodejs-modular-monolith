require('dotenv').config()
const { Client } = require('pg');
const { PostgreSqlContainer } = require('testcontainers');
const {
  db: {
    port,
    user,
    password,
    database,
  }
} = require('../../src/core/configs/index')

describe('GenericContainer', () => {
  let container;

  beforeAll(async () => {
    container = await new PostgreSqlContainer('postgres:13.3-alpine')
      .withExposedPorts(+port)
      .withDatabase(database)
      .withUsername(user)
      .withPassword(password)
      .withStartupTimeout(120000)
      .start();
  }, 120000);

  it('should work', async () => {
    const client = new Client({
      host: container.getHost(),
      port: container.getPort(),
      database: container.getDatabase(),
      user: container.getUsername(),
      password: container.getPassword(),
    });
    await client.connect();
    const result = await client.query('SELECT 1');
    expect(result.rows[0]).toEqual({ '?column?': 1 });

    await client.end();

  }, 120000);

  afterAll(async () => {
    await container.stop();
  });
});