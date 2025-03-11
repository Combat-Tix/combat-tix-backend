import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { typeDefs, resolvers } from "./graphql/schemas/index.js";
import { authMiddleware } from "./middleware/auth.js";
import connectDB from "./config/database.js";
import winston from "winston";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();

app.use(cookieParser());

// Configure Winston logger
const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: "error.log", level: "error" }),
    new winston.transports.File({ filename: "combined.log" }),
  ],
});

if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    })
  );
}

// Security headers
app.use(
  helmet({
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: false,
  })
);

let server;

// Initialize server
const startServer = async () => {
  // MongoDB Connection
  await connectDB();

  server = new ApolloServer({
    typeDefs,
    resolvers,
    introspection: true,

    formatError: (formattedError) => {
      const statusCode = formattedError?.extensions?.http?.status || 500;
      return {
        message: formattedError.message,
        extensions: {
          code: formattedError.extensions.code || "INTERNAL_SERVER_ERROR",
          http: { status: statusCode },
        },
      };
    },
  });

  app.use(cors());
  app.use(express.json());

  await server.start();

  // Apply Apollo middleware with authentication context
  app.use(
    "/graphql",
    cors(),
    expressMiddleware(server, {
      context: async ({ req, res }) => {
        const auth = await authMiddleware({ req });
        return { req, res, ...auth };
      },
    })
  );

  if (process.env.NODE_ENV !== "test") {
    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
      logger.info(`GraphQL endpoint: http://localhost:${PORT}/graphql`);
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
    logger.error("Failed to start server:", error);
    process.exit(1);
  });
}

export { app, startServer, stopServer };
