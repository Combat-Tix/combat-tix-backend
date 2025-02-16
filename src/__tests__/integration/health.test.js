import request from 'supertest';
import { app } from '../utils/setup.js';

describe('Health Check', () => {
  it('should return health check data via GraphQL', async () => {
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
      .set('x-api-key', process.env.API_KEY)
      .send({
        query: query,
      })
      .expect(200);

    expect(response.body.data.healthCheck).toEqual({
      status: 'ok',
      database: 'connected',
    });
  });
});
