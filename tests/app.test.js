const request = require('supertest');
const app = require('../app');

describe('URL Shortener API', () => {
  
  it('should shorten a valid URL and return 201', async () => {
    const res = await request(app)
      .post('/api/shorten')
      .send({ originalUrl: 'https://www.google.com' });
      
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('shortUrl');
    expect(res.body).toHaveProperty('shortId');
    expect(res.body.originalUrl).toEqual('https://www.google.com');
  });

  it('should reject an invalid URL and return 400', async () => {
    const res = await request(app)
      .post('/api/shorten')
      .send({ originalUrl: 'not-a-valid-url' });
      
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('error');
  });

  it('should return 404 for a non-existent short ID', async () => {
    const res = await request(app).get('/doesnotexist123');
    expect(res.statusCode).toEqual(404);
  });
});
