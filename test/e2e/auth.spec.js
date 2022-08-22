require('dotenv').config();

const path = require("path");
const { request } = require('undici');
const { DockerComposeEnvironment } = require('testcontainers');
const { app } = require('../../src/core/configs/index')

const composeFilePath = path.resolve(__dirname, "../../");
const composeFile = "docker-compose.yml";
describe('Auth module', () => {
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

  describe('GET /guarded', () => {
    it('Should fail without token', async () => {
      const url = `http://${host}:${port}/api/auth/guarded`;

      const { statusCode, body } = await request(url);
      const resp = await body.json();

      // assert
      expect(statusCode).toEqual(401);
    });

    it('Should fail with wrong token', async () => {
      const url = `http://${host}:${port}/api/auth/guarded`;

      const { statusCode, body } = await request(url, {
        headers: {
          "Authorization": "Bearer wrong token"
        },
      });
      const resp = await body.json();

      // assert
      expect(statusCode).toEqual(401);
    });

    it('Should success with correct token', async () => {
      const res = await request(`http://${host}:${port}/api/auth/sign-in`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: 'root',
          password: 'password-hash'
        }),
      });
      const { data : token }  = await res.body.json();


      const url = `http://${host}:${port}/api/auth/guarded`;

      const { statusCode, body } = await request(url, {
        headers: {
          "Authorization": `${token}`
        },
      });
      const resp = await body.json();

      expect(statusCode).toEqual(200);
    });
  });

  afterAll(async () => {
    await environment.down();
  });
});
