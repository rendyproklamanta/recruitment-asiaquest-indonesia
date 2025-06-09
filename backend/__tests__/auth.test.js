const request = require('supertest');
const app = require('../app'); // Your Express app
const db = require('../models');

let testUsername = 'user3';
let testPassword = 'user3';

beforeAll(async () => {
   await db.sequelize.sync({ force: true }); // reset db
});

describe('Auth APIs', () => {
   it('should register a user', async () => {
      const res = await request(app).post('/auth/register').send({
         username: testUsername,
         password: testPassword
      });
      expect(res.statusCode).toBe(200);
   });

   it('should login a user and return token', async () => {
      const res = await request(app).post('/auth/login').send({
         username: testUsername,
         password: testPassword
      });
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('accessToken');
   });
});
