jest.setTimeout(25000);

const supertest = require('supertest');
const { randomUUID } = require('crypto');
const { startContainers } = require('../../utils/server-test');
const {
  app: { port },
} = require('../../../src/core/configs');

describe('DockerComposeEnvironment', () => {
  let appUrl;
  let request;

  beforeAll(async () => {
    const containers = await startContainers();

    const appContainer = containers.getContainer('app_1');

    appUrl = `http://${appContainer.getHost()}:${appContainer.getMappedPort(
      port,
    )}`;
    request = supertest(appUrl);
  });

  afterAll(async () => {
    await containers.down();
  });

  describe('register', () => {
    it('must register user when the input is valid', async () => {
      const userDto = {
        username: randomUUID().slice(0, 15),
        password: randomUUID(),
        role: 'user',
      };
      await request
        .post('/api/auth/register')
        .send(userDto)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200, { status: 'SUCCESS' });

      const resUsers = await request
        .get('/api/users/')
        .send(userDto)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(resUsers.body.data).toEqual([
        {
          created_at: expect.any(String),
          id: expect.any(String),
          role: userDto.role,
          updated_at: null,
          username: userDto.username,
        },
      ]);
    });

    it.each([
      {
        password: 'test_pass1',
        role: 'user',
      },
      {
        username: 'test_user2',
        role: 'user',
      },
      {
        username: 'test_user3',
        password: 'test_pass3',
      },
    ])(
      'must fail if one of the required fields is missing',
      async (userDto) => {
        await request
          .post('/api/auth/register')
          .send(userDto)
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(400, { status: 'BAD_REQUEST' });
      },
    );
  });
});
