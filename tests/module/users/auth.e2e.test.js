const request = require('supertest');

const app = require('../../../src/app');
// const { GenericContainer } = require("testcontainers");

// const databaseContainer = await new GenericContainer("postgres:12-alpine")
//   .withEnv("POSTGRES_USER", "test")
//   .withEnv("POSTGRES_PASSWORD", "test")
//   .withEnv("POSTGRES_DB", "test")
//   .start();


// Decided to go with docker-compose files, to avoid env management in tests & more flexibility
describe("authHandler module", () => {
  describe("/register", () => {
    it("should create new user in database (posititve)", () => {
      request(app)
        .post('/api/auth/register')
        .send({ username: "root", password: "1234", role: "admin" })
        .expect(200)
      request(app)
        .post('/api/auth/sign-in')
        .send({ username: "root", password: "1234" })
        .expect(200)
    })

    it("should not create duplicates (negative)", () => {
      request(app)
        .post('/api/auth/register')
        .send({ username: "root2", password: "1234", role: "admin" })
        .expect(200)
      request(app)
        .post('/api/auth/register')
        .send({ username: "root2", password: "1234", role: "admin" })
        .expect(500)
    })
  })
})
