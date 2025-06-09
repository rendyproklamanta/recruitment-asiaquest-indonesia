const request = require('supertest');
const app = require('../app');
const db = require('../models');

let token = '';
let todoId;
let testEmail = 'userdemo@email.com';
let testPassword = 'password';

beforeAll(async () => {
   await request(app).post('/auth/register').send({
      email: testEmail,
      password: testPassword
   });

   const login = await request(app).post('/auth/login').send({
      email: testEmail,
      password: testPassword
   });
   token = login.body.accessToken;
});

describe('Todo APIs', () => {
   it('should create a todo', async () => {
      const res = await request(app)
         .post('/todos')
         .set('Authorization', `Bearer ${token}`)
         .send({
            title: 'Test Todo',
            description: 'Testing',
            task_order: 0,
            completed: false
         });
      expect(res.statusCode).toBe(200);
      expect(res.body.data).toHaveProperty('id');
      todoId = res.body.data.id;
   });

   it('should get all todos', async () => {
      const res = await request(app)
         .get('/todos')
         .set('Authorization', `Bearer ${token}`);
      expect(res.statusCode).toBe(200);
   });

   it('should get a single todo', async () => {
      const res = await request(app)
         .get(`/todos/${todoId}`)
         .set('Authorization', `Bearer ${token}`);
      expect(res.statusCode).toBe(200);
   });

   it('should update a todo', async () => {
      const res = await request(app)
         .put(`/todos/${todoId}`)
         .set('Authorization', `Bearer ${token}`)
         .send({ title: 'Updated Todo', completed: true });
      expect(res.statusCode).toBe(200);
   });

   it('should delete a todo', async () => {
      const res = await request(app)
         .delete(`/todos/${todoId}`)
         .set('Authorization', `Bearer ${token}`);
      expect(res.statusCode).toBe(200);
   });
});
