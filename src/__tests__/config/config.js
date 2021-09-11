// node-fetch esm only... so axios
const axios = require('axios');
const { Client } = require("pg")
const { PostgreSqlContainer } = require("testcontainers");
const path = require("path");
const { GenericContainer } = require("testcontainers");
const { DockerComposeEnvironment } = require("testcontainers");

// require('dotenv').config()
// const { app: appConfigs } = require('../../core/configs')


describe("e2e", () => {
    const APP_ENV = "dev";
    const APP_PORT = 3000;
    const DB_HOST = "127.0.0.1";
    const DB_PORT = "6543";
    const DB_USER="sandbox";
    const DB_PASS="sandbox";
    const DB_NAME="sandbox";
    const JWT_SECRET="G5Xky3nwsh";

    let appStartedTestContainer;
    let dbContainer;
    jest.setTimeout(180000);

    beforeAll(async () => {
        const buildContext = path.resolve(process.cwd(), ".");
        const appContainer = await GenericContainer.fromDockerfile(buildContext)
            .build();

        dbContainer = await new PostgreSqlContainer()
            .withDatabase(DB_NAME)
            .withPassword(DB_PASS)
            .withUsername(DB_USER)
            .withExposedPorts(DB_PORT)
            .start();

        appStartedTestContainer = await appContainer
            .withExposedPorts(APP_PORT)
            .withEnv("APP_ENV", APP_ENV)
            .withEnv("APP_PORT", APP_PORT.toString(10))
            .withEnv("DB_HOST", DB_HOST)
            .withEnv("DB_PORT", DB_PORT)
            .withEnv("DB_USER", DB_USER)
            .withEnv("DB_PASS", DB_PASS)
            .withEnv("DB_NAME", DB_NAME)
            .withEnv("JWT_SECRET", JWT_SECRET)
            .start();

    });

    afterAll(async () => {
        await appStartedTestContainer.stop();
        await dbContainer.stop();
    });

    it("app starts up", async () => {
        const url = `http://${appStartedTestContainer.getHost()}:${appStartedTestContainer.getMappedPort(APP_PORT)}`;
        const response = await axios.get(`${url}`)

        expect(response.status).toBe(200);
        expect(response.data).toBe("Safe");
    });
    //
    // it("app with database work toghether", async () => {
    //     const buildContext = path.resolve(__dirname, ".");
    //     const environment = await new DockerComposeEnvironment(buildContext, "docker-compose.yml")
    //         .up();
    //     const container = environment.getContainer("postgres_1");
    //     const client = new Client({
    //         host: container.getHost(),
    //         port: container.getPort(),
    //         database: container.getDatabase(),
    //         user: container.getUsername(),
    //         password: container.getPassword(),
    //     });
    //     await client.connect();
    //
    //     const result = await client.query("SELECT 1");
    //     expect(result.rows[0]).toEqual({ "?column?": 1 });
    //
    //     await client.end();
    //     await container.stop();
    //
    // });
    // it("db should work", async () => {
    //     const container = await new PostgreSqlContainer().start();
    //
    //     const client = new Client({
    //         host: container.getHost(),
    //         port: container.getPort(),
    //         database: container.getDatabase(),
    //         user: container.getUsername(),
    //         password: container.getPassword(),
    //     });
    //     await client.connect();
    //
    //     const result = await client.query("SELECT 1");
    //     expect(result.rows[0]).toEqual({ "?column?": 1 });
    //
    //     await client.end();
    //     await container.stop();
    // });
    //
    // it("should set database", async () => {
    //     const container = await new PostgreSqlContainer().withDatabase("customDatabase").start();
    //
    //     const client = new Client({
    //         host: container.getHost(),
    //         port: container.getPort(),
    //         database: container.getDatabase(),
    //         user: container.getUsername(),
    //         password: container.getPassword(),
    //     });
    //     await client.connect();
    //
    //     const result = await client.query("SELECT current_database()");
    //     expect(result.rows[0]).toEqual({ current_database: "customDatabase" });
    //
    //     await client.end();
    //     await container.stop();
    // });
    //
    // it("should set username", async () => {
    //     const container = await new PostgreSqlContainer().withUsername("customUsername").start();
    //
    //     const client = new Client({
    //         host: container.getHost(),
    //         port: container.getPort(),
    //         database: container.getDatabase(),
    //         user: container.getUsername(),
    //         password: container.getPassword(),
    //     });
    //     await client.connect();
    //
    //     const result = await client.query("SELECT current_user");
    //     expect(result.rows[0]).toEqual({ current_user: "customUsername" });
    //
    //     await client.end();
    //     await container.stop();
    // });
});