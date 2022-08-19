const path = require("path");
const { request } = require('undici');
const { DockerComposeEnvironment } = require('testcontainers');
const { app } = require('../../src/core/configs/index');

const composeFilePath = path.resolve(__dirname, "../../");
const composeFile = "docker-compose.yml";
describe('Sync module', () => {
  let environment, appContainer;

  beforeAll(async () => {
    environment = await new DockerComposeEnvironment(composeFilePath, composeFile)
      .withEnvFile(path.resolve(__dirname, "../../") + '/.env')
      .withEnv("MODULE", "syncing")
      .withBuild()
      .up();
    appContainer = environment.getContainer("nodejs-modular-monolith");
  }, 180000);

  describe('POST /api/sync', () => {
    it('Success path', async () => {
      const currentDateTime = (new Date()).toISOString();
      const { statusCode, body } = await request(
        `http://${appContainer.getHost()}:${appContainer.boundPorts.ports.get(+app.port)}/api/sync`,
        { method: 'POST' }
      );
      const resp = await body.json();
      expect(resp).toHaveLength(5);
      expect(resp[0].type).toEqual("CREATE");
      expect(resp[0].payload.created_at < currentDateTime).toBe(true);
      expect(resp[4].payload.created_at >= resp[0].payload.created_at).toBe(true);
      expect(statusCode).toEqual(200);
    });

    it('Fail path with incorrect last_sync_at', async () => {
      const { statusCode, body } = await request(
        `http://${appContainer.getHost()}:${appContainer.boundPorts.ports.get(+app.port)}/api/sync`,
        {
          method: 'POST',
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ "last_sync_at": " " })
        }
      );
      expect(await body.json()).toEqual({ status: 'fail' });
      expect(statusCode).toEqual(200);
    });
  });

  afterAll(async () => {
    await environment.down();
  });
});
