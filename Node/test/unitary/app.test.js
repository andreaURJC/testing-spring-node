const app = require('../../src/app');
const supertest = require('supertest');
const request = supertest(app);
const AWS = require('aws-sdk');

jest.mock('aws-sdk')

const setDocumentClientAWS = mockedImplementation => {
  AWS.DynamoDB.DocumentClient.mockImplementation(() => mockedImplementation)
}

const film = { name: 'Dumbo', year: '1997' }
describe("Test create a new film: ", () => {
  test("Given user, when he creates new film, then the film is saved.", async () => {

    const documentClient = {
      put: (params, cb) => cb(null, film)
    }

    setDocumentClientAWS(documentClient)

    const response = await request.post('/api/films/')
      .send(film)
      .expect(201)

    expect(response.body.name).toBe('Dumbo')
    expect(response.body.year).toBe('1997')
  })

  test("Given user, when he creates new film, then return error.", async () => {
    
    const documentClient = {
      put: (params, cb) => cb(new Error(), null)
    }

    setDocumentClientAWS(documentClient)

    const response = await request.post('/api/films/')
      .send(film)
      .expect(400)

  })
})

describe("Get all films: ", () => {
  test("Given user, when he gets all films, then should return all films.", async () => {

    const films = { Items: [{ name: 'Los 101 Dalmatas', year: '1957' }, { name: 'El Rey Leon', year: '1998' }] };
    const documentClient = {
      scan: (params, cb) => cb(null, films)
    }

    setDocumentClientAWS(documentClient)

    const response = await request.get('/api/films/')
      .expect(200)

    expect(response.body[0].name).toBe('Los 101 Dalmatas');
    expect(response.body[0].year).toBe('1957');
    expect(response.body[1].name).toBe('El Rey Leon');
    expect(response.body[1].year).toBe('1998');
  })
})