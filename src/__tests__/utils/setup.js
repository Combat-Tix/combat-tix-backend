import { app, startServer, stopServer } from '../../app.js';
import mongoose from 'mongoose';

beforeAll(async () => {
  await startServer();
});

afterAll(async () => {
  await stopServer();
  await mongoose.connection.close(); // Ensure DB connection is closed
  await new Promise((resolve) => setTimeout(resolve, 500)); // Give time for cleanup
});

export { app };
