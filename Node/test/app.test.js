const app = require('../src/app');
const supertest = require('supertest');

const request = supertest(app);

const AWS= require('aws-sdk');
const createTableIfNotExist = require("../src/db/createTable")

const film = { name: 'Film 1', year: '1997' }

beforeAll(async () => {

// CONFIGURE AWS TO USE LOCAL REGION AND DEFAULT ENDPOINT (LOCALHOST) FOR DYNAMODB
AWS.config.update({
    region: process.env.AWS_REGION || 'local',
    endpoint: process.env.AWS_DYNAMO_ENDPOINT || 'http://localhost:8000',
    accessKeyId: "xxxxxx", // No es necesario poner nada aquí
    secretAccessKey: "xxxxxx" // No es necesario poner nada aquí
  });
  
  // CREATE DYNAMODB TABLE ONLY IF NOT EXIST PREVIOUSLY
  (async() => { 
    await createTableIfNotExist("films");
  })();

    const awsSdkPromiseResponse = jest.fn().mockReturnValue(Promise.resolve(true));

    const putFn = jest.fn().mockImplementation(() => ({ promise: awsSdkPromiseResponse }));
    
    const DynamoDB = {
        put: putFn
    };
})

test("Given user, when he creates new film, then the film is saved.", async() => {

    
    const response = await request.post('/api/films/')
        .send(film)
        .expect(201)
    
    expect(db.put).toHaveBeenCalledWith({ TableName: 'films', Item: film });
    expect(response.body['name']).toBe('Film 1')

})