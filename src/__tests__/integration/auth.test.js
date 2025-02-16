import request from 'supertest';
import mongoose from 'mongoose';
import app from '../../app.js';

describe('API Authentication', () => {
    beforeAll(async () => {
        await mongoose.connect(process.env.MONGODB_URI);
        await new Promise(resolve => setTimeout(resolve, 1000));
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    const testQuery = `
    query {
      healthCheck {
        status
        database
      }
    }
  `;

    it('should reject requests without API key', async () => {
        const response = await request(app)
            .post('/graphql')
            .send({ query: testQuery })
            .expect(401);

        expect(response.body.errors).toBeDefined();
        expect(response.body.errors[0].message).toBe('API key is required');
        expect(response.body.errors[0].extensions.code).toBe('UNAUTHORIZED');
        expect(response.body.errors[0].extensions.http.status).toBe(401);
    });

    it('should reject requests with an invalid API key', async () => {
        const response = await request(app)
            .post('/graphql')
            .set('x-api-key', 'invalid_key')
            .send({ query: testQuery })
            .expect(403);

        expect(response.body.errors).toBeDefined();
        expect(response.body.errors[0].message).toBe('Invalid API key');
        expect(response.body.errors[0].extensions.code).toBe('FORBIDDEN');
        expect(response.body.errors[0].extensions.http.status).toBe(403);
    });

    it('should accept requests with a valid API key', async () => {
        const response = await request(app)
            .post('/graphql')
            .set('x-api-key', process.env.API_KEY)
            .send({ query: testQuery })
            .expect(200);

        expect(response.body.errors).toBeUndefined();
        expect(response.body.data).toBeDefined();
        expect(response.body.data.healthCheck).toMatchObject({
            status: 'ok',
            database: 'connected',
        });
    });
});

