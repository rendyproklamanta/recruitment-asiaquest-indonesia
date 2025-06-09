const request = require('supertest');
const app = require('../app'); // Your Express app
const db = require('../models');

let testEmail = 'userdemo@email.com';
let testPassword = 'password';

describe('Auth APIs', () => {
   it('should login a user and return token', async () => {
      const res = await request(app).post('/auth/login').send({
         email: testEmail,
         password: testPassword
      });
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('accessToken');
   });
});
