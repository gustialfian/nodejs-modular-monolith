const path = require("path");
const { DockerComposeEnvironment } = require("testcontainers");
const axios = require('axios').default;
const { expect } = require("chai");

describe("DockerComposeEnvironment", () => {

  let environment;
  let container;

  beforeAll(async () => {
    const composeFilePath = path.resolve(__dirname, "../");
    const composeFile = "docker-compose.yml";
    jest.setTimeout(60000);
    environment = await new DockerComposeEnvironment(composeFilePath, composeFile)
    .up();

    container = environment.getContainer("nodejs-modular-monolith");
  });

  afterAll(async () => {
    await environment.down();
  });

  it("works", async () => {

  const  response  = await axios.get(`http://localhost:3000`,{timeout: 1000 * 60});
  console.log(response?.data);
  expect(response.data === "safe");
    });
  
});
