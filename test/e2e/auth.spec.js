const path = require("path");

const { request } = require('undici');
const { DockerComposeEnvironment } = require("testcontainers");

const { app } = require('../../src/core/configs');
const { users } = require('../../__fixtures__/testData');

const projectPath = path.resolve(__dirname, "..", "..");

describe("auth", () => {
  let environment, baseUrl;

  const sendGET = async (path, headers = {}) => {
    const url = new URL(path, baseUrl);
    const options = {
      method: 'GET',
      headers,
    };

    return request(url, options);
  };

  const sendPOST = async (path, body = {}) => {
    const url = new URL(path, baseUrl);
    const options = {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    };

    return request(url, options);
  };

  const signIn = async (user) => {
    const res = await sendPOST("/api/auth/sign-in", user);
    const { data: token } = await res.body.json();

    return token;
  }

  beforeAll(async () => {
    environment = await new DockerComposeEnvironment(projectPath, "docker-compose.yml")
      .withEnvFile(path.resolve(projectPath, ".env"))
      .withEnv("MODULE", "users")
      .withBuild()
      .up();

    const appContainer = environment.getContainer("nodejs-modular-monolith");

    baseUrl = new URL(`http://${appContainer.getHost()}:${app.port}`);
  }, 180000);

  describe("POST /api/auth/register", () => {
    const pathname = "/api/auth/register";

    it('validation', async () => {
      const { username } = users.new;
      const res = await sendPOST(pathname, {
        username,
      });

      expect(res.statusCode).toBe(500);

      const body = await res.body.json();

      expect(body).toEqual({
        status: "INTERNAL_SERVER_ERROR",
      });
    });

    it('empty role', async () => {
      const { username, password } = users.new;
      const res = await sendPOST(pathname, {
        username,
        password,
      });

      expect(res.statusCode).toBe(200);

      const body = await res.body.json();

      expect(body).toEqual({
        status: "SUCCESS",
      });
    });

    it('success', async () => {
      const res = await sendPOST(pathname, users.new);

      expect(res.statusCode).toBe(200);

      const body = await res.body.json();

      expect(body).toEqual({
        status: "SUCCESS",
      });
    });

    it('same username', async () => {
      const res1 = await sendPOST(pathname, users.new);
      const res2 = await sendPOST(pathname, users.new);

      expect(res2.statusCode).toBe(200);

      const body = await res2.body.json();

      expect(body).toEqual({
        status: "SUCCESS",
      });
    });
  });

  describe("POST /api/auth/sign-in", () => {
    const pathname = "/api/auth/sign-in";

    it('empty username', async () => {
      const { password } = users.existing;
      const res = await sendPOST(pathname, {
        password,
      });

      expect(res.statusCode).toBe(200);

      const body = await res.body.json();

      expect(body).toEqual({
        status: "ERROR",
        message: "username not found.",
      });
    });

    it('empty password', async () => {
      const { username } = users.existing;
      const res = await sendPOST(pathname, {
        username,
      });

      expect(res.statusCode).toBe(500);

      const body = await res.body.json();

      expect(body).toEqual({
        status: "INTERNAL_SERVER_ERROR",
      });
    });

    it('not found', async () => {
      const res = await sendPOST(pathname, users.unexisting);

      expect(res.statusCode).toBe(200);

      const body = await res.body.json();

      expect(body).toEqual({
        status: "ERROR",
        message: "username not found.",
      });
    });

    it('incorrect password', async () => {
      const { username } = users.existing;
      const { password } = users.unexisting;
      const res = await sendPOST(pathname, {
        username,
        password,
      });

      expect(res.statusCode).toBe(200);

      const body = await res.body.json();

      expect(body).toEqual({
        status: "ERROR",
        message: "incorrect password.",
      });
    });

    it('success', async () => {
      const res = await sendPOST(pathname, users.existing);

      expect(res.statusCode).toBe(200);

      const body = await res.body.json();

      expect(body).toMatchObject({
        status: "SUCCESS",
        data: expect.stringMatching(/^Bearer\s/),
      });
    });
  });

  describe("GET /api/auth/guarded", () => {
    const pathname = "/api/auth/guarded";

    it('unauthorized', async () => {
      const res = await sendGET(pathname);

      expect(res.statusCode).toBe(401);

      const body = await res.body.json();

      expect(body).toStrictEqual({
        msg: "No token, authorization denied",
      });
    });

    it('wrong token', async () => {
      const res = await sendGET(pathname, {
        Authorization: `Bearer ${users.existing.password}`,
      });

      expect(res.statusCode).toBe(401);

      const body = await res.body.json();

      expect(body).toStrictEqual({
        msg: "Token is not valid",
      });
    });

    it('forbidden', async () => {
      const token = await signIn(users.new);
      const res = await sendGET(pathname, {
        Authorization: token,
      });

      expect(res.statusCode).toBe(401);

      const body = await res.body.json();

      expect(body).toStrictEqual({
        msg: "Your role can not access this endpoint, authorization denied",
      });
    });

    it('success', async () => {
      const token = await signIn(users.existing);
      const res = await sendGET(pathname, {
        Authorization: token,
      });

      expect(res.statusCode).toBe(200);

      const body = await res.body.json();

      expect(body).toBe("access granted");
    });
  });

  afterAll(async () => {
    await environment.down();
  });
});
