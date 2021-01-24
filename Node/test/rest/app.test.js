const app = require('../../src/app');
const request = require('supertest');
const AWS = require('aws-sdk');
const { GenericContainer } = require('testcontainers');
const createTableIfNotExist = require('../../src/db/createTable');

jest.setTimeout(10000)
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

  test('Given a film, when adding it, then post should return the film created.', async () => {
    const response = await request(app)
      .post('/api/films')
      .send(film)
      .expect(201);

    expect(response.body.name).toBe('Dumbo');
  });

  test('Given existing films, when adding a new one, then get should return existing + 1.', async () => {
    const initialFilms = await request(app).get('/api/films').expect(200)

    await request(app).post('/api/films').send(film).expect(201)

    const endingFilms = await request(app).get('/api/films').expect(200)

    expect(endingFilms.body.length).toBe(initialFilms.body.length + 1);
  });
});
