const app = require('../../src/app');
const supertest = require('supertest');
const request = supertest(app);
const AWS = require('aws-sdk');
const { GenericContainer } = require("testcontainers");
const createTableIfNotExist = require("../../src/db/createTable")

let dynamoContainer;

beforeAll(async () => {
    dynamoContainer = await new GenericContainer("amazon/dynamodb-local", "1.13.6")
        .withExposedPorts(8000)
        .start();

    AWS.config.update({
      region: "local",
      endpoint: process.env.AWS_DYNAMO_ENDPOINT || `http://localhost:${dynamoContainer.getMappedPort(8000)}`,
      accessKeyId: "xxxxxx", // No es necesario poner nada aquí
      secretAccessKey: "xxxxxx", // No es necesario poner nada aquí
    });

    // CREATE DYNAMODB TABLE ONLY IF NOT EXIST PREVIOUSLY
    await createTableIfNotExist("films");

    console.log(dynamoContainer)

});



afterAll(async () => {
    await dynamoContainer.stop();
});

const film = { name: 'Dumbo', year: '1997' }

test("Given user, when he creates new film, then the film is saved.", async () => {

    const response = await request.post('/api/films/')
        .send(film)
        .expect(201)

    expect(response.body.name).toBe('Dumbo')
    expect(response.body.year).toBe('1997')
})

test("Given user, when he gets all films, then should return all films.", async () => {

    const response = await request.get('/api/films/')
        .expect(200)

    expect(response.body[0].name).toBe('Los 101 Dalmatas');
    expect(response.body[0].year).toBe('1957');
    expect(response.body[1].name).toBe('El Rey Leon');
    expect(response.body[1].year).toBe('1998');
})
