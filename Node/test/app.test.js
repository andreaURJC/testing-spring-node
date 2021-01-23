const app = require('../src/app');
const supertest = require('supertest');
const request = supertest(app);

const createTableIfNotExist = require("../src/db/createTable");

const film = { name: 'Film 2', year: '1997'}

test("Given user, when he creates new film, then the film is saved.", async() => {
 
    const response = await request.post('/api/films/')
        .send(film)
        .expect(201)
    
    expect(response.body.name).toBe('Film 2')
})
