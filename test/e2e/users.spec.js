require('dotenv').config();

const path = require("path");
const { request } = require('undici');
const { DockerComposeEnvironment } = require('testcontainers');
const { app } = require('../../src/core/configs/index')

const composeFilePath = path.resolve(__dirname, "../../");
const composeFile = "docker-compose.yml";
describe('Users module', () => {
  let environment, appContainer, host, port;

  beforeAll(async () => {
    environment = await new DockerComposeEnvironment(composeFilePath, composeFile)
      .withEnvFile(path.resolve(__dirname, "../../") + '/.env')
      .withEnv("MODULE", "users")
      .withBuild()
      .up();
    appContainer = environment.getContainer("nodejs-modular-monolith");
    host = appContainer.getHost()
    port = appContainer.boundPorts.ports.get(+app.port)
  }, 180000);

  describe('GET /api/users', () => {
    it('Success path', async () => {
      // arrange
      const url = `http://${host}:${port}/api/users`;

      // act
      const { statusCode, body } = await request(url);
      const resp = await body.json();

      // assert
      expect(statusCode).toEqual(200);
      expect(resp).toHaveLength(4);
    });
  });

  describe('GET /api/users/:userId', () => {
    it('should respond with an existing user', async () => {
      // arrange
      const userId = '2c36e3f9-55cb-4aae-a642-5409c3a7dc17';
      const url = `http://${host}:${port}/api/users/${userId}`;

      // act
      const { statusCode, body } = await request(url);
      const resp = await body.json();

      // assert
      expect(statusCode).toEqual(200);
      expect(resp).toMatchObject({
        id: '2c36e3f9-55cb-4aae-a642-5409c3a7dc17',
        username: 'well-known-user'
      });
    });

    it('should respond with error when there is no such user', async () => {
      // arrange
      const userId = 'bad-user-id';
      const url = `http://${host}:${port}/api/users/${userId}`;

      // act
      const { statusCode, body } = await request(url);
      const resp = await body.json();

      // assert
      expect(statusCode).toEqual(500);
      expect(resp).toMatchObject({
        error: 'invalid input syntax for type uuid: "bad-user-id"'
      });
    });
  });

  afterAll(async () => {
    await environment.down();
  });
});
