const app = require('../../src/app');
const request = require('supertest');
const AWS = require('aws-sdk');
const { GenericContainer } = require('testcontainers');
const createTableIfNotExist = require('../../src/db/createTable');

describe('Integration tests', () => {
  
  let dynamoContainer;
  
  beforeAll(async () => {
    dynamoContainer = await new GenericContainer(
      'amazon/dynamodb-local',
      '1.13.6'
    )
      .withExposedPorts(8000)
      .start();

    AWS.config.update({
      region: process.env.AWS_REGION || 'local',
      endpoint: process.env.AWS_DYNAMO_ENDPOINT || `http://localhost:${dynamoContainer.getMappedPort(8000)}`,
      accessKeyId: 'xxxxxx', // No es necesario poner nada aquí
      secretAccessKey: 'xxxxxx', // No es necesario poner nada aquí
    });

    // CREATE DYNAMODB TABLE ONLY IF NOT EXIST PREVIOUSLY
    await createTableIfNotExist('films');
  });

  afterAll(async () => {
    await dynamoContainer.stop();
  });

  const film = { name: 'Dumbo' };

  test('Given user, when he creates new film, then the film is saved.', async () => {
    const response = await request(app)
      .post('/api/films')
      .send(film)
      .expect(201);

    expect(response.body.name).toBe('Dumbo');
  }, 10000);

  test('Given user, when he gets all films, then should return all films.', async () => {
    const response = await request(app).get('/api/films').expect(200);

    //TODO: Comprobar el numero de peliculas antes y después de insertar una
    expect(response.body[0].name).toBe('Dumbo');
  }, 10000);
});
