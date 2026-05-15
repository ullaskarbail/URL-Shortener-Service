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

  it('should track clicks correctly', async () => {
    // 1. Create a short URL
    const createRes = await request(app)
      .post('/api/shorten')
      .send({ originalUrl: 'https://www.github.com' });
    
    const shortId = createRes.body.shortId;

    // 2. Access the URL twice to simulate clicks
    await request(app).get(`/${shortId}`);
    await request(app).get(`/${shortId}`);

    // 3. Fetch stats and verify clicks
    const statsRes = await request(app).get('/api/stats');
    expect(statsRes.statusCode).toEqual(200);
    
    const ourLink = statsRes.body.find(item => item.shortId === shortId);
    expect(ourLink).toBeDefined();
    expect(ourLink.clicks).toEqual(2);
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
