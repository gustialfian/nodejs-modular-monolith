const path = require('path');
const { DockerComposeEnvironment, Wait } = require('testcontainers');
const { randomUUID } = require('crypto');

const ROOT_PATH = path.resolve(__dirname, '../', '../');
const DOCKER_COMPOSE_FILE_NAME = 'docker-compose.yml';

const startContainers = async () => {
  try {
    const dbContainerName = randomUUID();
    return await new DockerComposeEnvironment(
      ROOT_PATH,
      DOCKER_COMPOSE_FILE_NAME,
    )
      .withEnv('DB_CONTAINER_NAME', dbContainerName)
      .withWaitStrategy(
        `db${dbContainerName}`,
        Wait.forLogMessage(/database system is ready to accept connections/),
      )

      .up();
  } catch (err) {
    console.error('Failed to start containers : ', err);
    throw err;
  }
};

module.exports = { startContainers };
