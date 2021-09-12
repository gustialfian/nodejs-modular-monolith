// node-fetch esm only... so axios
const axios = require('axios');
const { Client } = require("pg")
const { PostgreSqlContainer } = require("testcontainers");
const path = require("path");
const { GenericContainer, TestContainers, Network } = require("testcontainers");
const { DockerComposeEnvironment } = require("testcontainers");

// require('dotenv').config()
// const { app: appConfigs } = require('../../core/configs')


describe("e2e", () => {
    const APP_ENV = "dev";
    const APP_PORT = 3000;
    const DB_HOST = "127.0.0.1";
    const DB_PORT = 6543;
    const DB_USER="sandbox";
    const DB_PASS="sandbox";
    const DB_NAME="sandbox";
    const JWT_SECRET="G5Xky3nwsh";

    let appStartedTestContainer;
    let dbContainer;
    let appStream;
    let dbStream;
    let dbClient;
    let network;
    jest.setTimeout(180000);

    beforeAll(async () => {
        const buildContext = path.resolve(process.cwd());
        network = await new Network("")
            .start();

        dbContainer = await new PostgreSqlContainer()
            .withNetworkMode(network.getName())
            .withDatabase(DB_NAME)
            .withPassword(DB_PASS)
            .withUsername(DB_USER)
            .withExposedPorts(DB_PORT)
            .start();
        // const dbContainerPrep = await GenericContainer
        //     .fromDockerfile(buildContext,"db.Dockerfile")
        //     .build();
        // dbContainer = await dbContainerPrep
        //     .withExposedPorts(DB_PORT)
        //     .withEnv("POSTGRES_DB", DB_NAME)
        //     .withEnv("POSTGRES_USER", DB_USER)
        //     .withEnv("POSTGRES_PASSWORD", DB_PASS)
        //     .start();

        // dbStream = await dbContainer.logs();
        // dbStream
        //     .on("data", line => console.log("[DB] " + line))
        //     .on("err", line => console.error("[DB] " + line))
        //     .on("end", () => console.log("[DB] " + "Stream closed"));

        // dbClient = await new Client({
        //     host: dbContainer.getHost(),
        //     port: dbContainer.getPort(),
        //     database: dbContainer.getDatabase(),
        //     user: dbContainer.getUsername(),
        //     password: dbContainer.getPassword(),
        // }).connect();
        // await dbClient.connect();

        // make db port available for containers
        //await TestContainers.exposeHostPorts(dbContainer.getPort());

        const appContainer = await GenericContainer
            .fromDockerfile(buildContext, "Dockerfile")
            .build();
        appStartedTestContainer = await appContainer
            .withNetworkMode(network.getName())
            .withExposedPorts(APP_PORT)
            .withEnv("APP_ENV", APP_ENV)
            .withEnv("APP_PORT", APP_PORT.toString(10))
            .withEnv("DB_HOST", dbContainer.getHost())
            .withEnv("DB_PORT", dbContainer.getPort().toString(10))
            .withEnv("DB_USER", DB_USER)
            .withEnv("DB_PASS", DB_PASS)
            .withEnv("DB_NAME", DB_NAME)
            .withEnv("JWT_SECRET", JWT_SECRET)
            .start();

        // appStream = await appStartedTestContainer.logs();
        // appStream
        //     .on("data", line => console.log("[APP] " + line))
        //     .on("err", line => console.error("[APP] " + line))
        //     .on("end", () => console.log("[APP] " + "Stream closed"));

    });

    afterAll(async () => {
        await appStartedTestContainer.stop();
        await dbClient.end();
        await dbContainer.stop();
        await network.stop();
    });

    it("app starts up", async () => {
        const url = `http://${appStartedTestContainer.getHost()}:${appStartedTestContainer.getMappedPort(APP_PORT)}`;
        const response = await axios.get(`${url}`)

        expect(response.status).toBe(200);
        expect(response.data).toBe("Safe");
    });

    it("create new user", async () => {
        const url = `http://${appStartedTestContainer.getHost()}:${appStartedTestContainer.getMappedPort(APP_PORT)}`;
        const response = await axios.post(`${url}/api/auth/register`, {
                username: "marius",
                password: "travels",
                role: "creator",
            });
        const result = await dbClient.query("SELECT *");
        expect(response.status).toBe(200);

        console.log(result);
        // expect(response.data).toBe("Safe");
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