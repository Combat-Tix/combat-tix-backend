import { GraphQLError } from "graphql";
import jwt from "jsonwebtoken";
import logger from "../config/logger.js";
import dotenv from "dotenv";

dotenv.config();

export const authMiddleware = async ({ req }) => {
  const apiKey = req.headers["x-api-key"];
  const authHeader = req.headers.authorization;

  // Check API Key
  if (!apiKey) {
    logger.warn("Unauthorized access attempt: Missing API Key");
    throw new GraphQLError("API key is required", {
      extensions: { code: "UNAUTHORIZED", http: { status: 401 } },
    });
  }

  if (apiKey !== process.env.API_KEY) {
    logger.warn(`Forbidden access attempt: Invalid API Key - ${apiKey}`);
    throw new GraphQLError("Invalid API key", {
      extensions: { code: "FORBIDDEN", http: { status: 403 } },
    });
  }

  // Check JWT Token
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return { authenticated: false, user: null };
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return { authenticated: true, user: decoded };
  } catch (error) {
    logger.warn("Invalid or expired token");
    throw new GraphQLError("Invalid or expired token", {
      extensions: { code: "UNAUTHORIZED", http: { status: 401 } },
    });
  }
};
