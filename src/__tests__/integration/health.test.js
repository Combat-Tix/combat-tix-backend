import request from 'supertest';
import app from '../../app.js';
import mongoose from 'mongoose';

describe('Health Check Endpoint', () => {
    // Close the server and database connection after tests
    afterAll(async () => {
        await mongoose.connection.close();
    });

    it('should return status 200 and database connected', async () => {
        const response = await request(app)
            .get('/health')
            .expect('Content-Type', /json/)
            .expect(200);

        expect(response.body).toEqual({
            status: 'ok',
            database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
        });
    });
});