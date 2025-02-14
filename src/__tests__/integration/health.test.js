import request from 'supertest';
import mongoose from 'mongoose';
import app from '../../app.js';

describe('Health Check', () => {
    // Before all tests
    beforeAll(async () => {
        await mongoose.connect(process.env.MONGODB_URI);
        // Wait for the connection to be ready
        await new Promise(resolve => setTimeout(resolve, 1000));
    });

    // After all tests
    afterAll(async () => {
        await mongoose.connection.close();
    });

    it('should return health check data via GraphQL', async () => {
        // Verify database connection before test
        expect(mongoose.connection.readyState).toBe(1);

        const query = `
      query {
        healthCheck {
          status
          database
        }
      }
    `;

        const response = await request(app)
            .post('/graphql')
            .send({
                query: query
            })
            .expect(200);

        expect(response.body.data.healthCheck).toEqual({
            status: 'ok',
            database: 'connected'
        });
    });
});