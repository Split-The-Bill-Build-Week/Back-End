const server = require('../api/server.js');
const request = require('supertest');

const Users = require('./usersModel.js');
const db = require('../data/dbConfig.js');

describe('users model', () => {
  beforeEach(async () => {
    await db('users').truncate();
  })

  it('should set envrionment to testing', () => {
    expect(process.env.DB_ENV).toBe('testing');
  });

  describe('insert user', () => {
    it('should insert a single user into the db', async () => {
      // insert a record
      await Users.insert({
        firstName: 'trevor',
        lastName: 'von bruenchenhein',
        email: 'tjvonbr@gmail.com',
        username: 'tjvonbr',
        password: 'test123'
      })

      const newUser = await db('users');

      // assert the record
      expect(newUser).toHaveLength(1);
    });

    it('should insert user into users db', async () => {
      // insert record
      const [id] = await Users.insert({
        firstName: 'trevor',
        lastName: 'von bruenchenhein',
        email: 'tjvonbr@gmail.com',
        username: 'tjvonbr',
        password: 'test123'
      });

      let user = await db('users')
        .where({ id })
        .first()

      // assert the record
      expect(user.firstName).toBe('trevor')
    });
  });
});

describe('POST /login', () => {
  it('responds with json', () => {
    request(server)
      .post('/login')
      .auth('tjvonbr', 'test123')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
  });

  it('responds with a 401', () => {
    request(server)
      .post('/login')
      .auth('tjvonbr', '123test')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(401)
  })
})

describe('POST /register', () => {
  it('responds with a 201', () => {
    request(server)
      .post('/register')
      .send('username=jschne', 'password=test123')
      .set('Accept', 'application/json')
      .expect(201, {
        username: 'jschne',
        password: 'test123'
      })
  })
})
