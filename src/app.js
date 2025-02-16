import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { typeDefs, resolvers } from './graphql/schemas/index.js';
import { authMiddleware } from "./middleware/auth.js";

dotenv.config();

const app = express();

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Successfully connected to MongoDB.'))
    .catch((error) => console.error('MongoDB connection error:', error));

const server = new ApolloServer({
    typeDefs,
    resolvers,
    introspection: true,
    formatError: (formattedError, error) => {
        // Extract the custom status code from the error's extensions
        const statusCode = error?.extensions?.http?.status || 500;

        return {
            message: formattedError.message,
            extensions: {
                ...formattedError.extensions,
                http: {
                    status: statusCode
                }
            }
        };
    }
});

// Middleware
app.use(helmet({
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: false,
}));
app.use(cors());
app.use(express.json());

await server.start();

// Apply Apollo middleware with CORS options
app.use('/graphql',
    cors(),
    expressMiddleware(server, {
        context: authMiddleware
    })
);

const PORT = process.env.PORT || 4000;

// Only start the server if we're not in a test environment
if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
        console.log(`GraphQL endpoint: http://localhost:${PORT}/graphql`);
    });
}

export default app;