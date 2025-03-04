import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { typeDefs, resolvers } from "./graphql/schemas/index.js";
import { authMiddleware } from "./middleware/auth.js";
import connectDB from "./config/database.js";

dotenv.config();

const app = express();

let server;

// Initialize server
const startServer = async () => {
  // MongoDB Connection
  await connectDB();
  server = new ApolloServer({
    typeDefs,
    resolvers,
    introspection: true,
    formatError: (formattedError, error) => {
      const statusCode = error?.extensions?.http?.status || 500;
      return {
        message: formattedError.message,
        extensions: {
          ...formattedError.extensions,
          http: { status: statusCode },
        },
      };
    },
  });

  // Middleware
  app.use(
    helmet({
      crossOriginEmbedderPolicy: false,
      contentSecurityPolicy: false,
    })
  );
  app.use(cors());
  app.use(express.json());

  await server.start();

  // Apply Apollo middleware
  app.use(
    "/graphql",
    cors(),
    expressMiddleware(server, {
      context: authMiddleware,
    })
  );

  if (process.env.NODE_ENV !== "test") {
    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`GraphQL endpoint: http://localhost:${PORT}/graphql`);
    });
  }
};

// Cleanup function for tests
const stopServer = async () => {
  if (server) {
    await server.stop();
  }
};

// Start server if not in test environment
if (process.env.NODE_ENV !== "test") {
  startServer().catch((error) => {
    console.error("Failed to start server:", error);
    process.exit(1);
  });
}

export { app, startServer, stopServer };
