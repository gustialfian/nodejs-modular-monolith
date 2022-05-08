require('dotenv').config();
const path = require("path");
const { request } = require('undici');
const { DockerComposeEnvironment } = require('testcontainers');
const { app } = require('../../src/core/configs/index')

const composeFilePath = path.resolve(__dirname, "../../");
const composeFile = "docker-compose.yml";
describe('GenericContainer', () => {
  let environment, appContainer;

  beforeAll(async () => {
    environment = await new DockerComposeEnvironment(composeFilePath, composeFile)
      .withEnvFile(path.resolve(__dirname, "../../") + '/.env')
      .withBuild()
      .up();
    appContainer = environment.getContainer("nodejs-modular-monolith");
  }, 180000);

  it('start app', async () => {
    const { statusCode, body } = await request(
      `http://localhost:3000/api/users`,
      { method: 'GET' }
    );
    expect(await body.json()).toEqual({ data: [] });
    expect(statusCode).toEqual(200);
  }, 20000);

  afterAll(async () => {
    await environment.down();
  });
});