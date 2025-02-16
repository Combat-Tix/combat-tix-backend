import { GraphQLError } from "graphql";
import logger from "../config/logger.js";

export const authMiddleware = async ({ req }) => {
    const apiKey = req.headers['x-api-key'];

    if (!apiKey) {
        logger.warn("Unauthorized access attempt: Missing API Key");
        throw new GraphQLError("API key is required", {
            extensions: {
                code: "UNAUTHORIZED",
                http: {
                    status: 401
                }
            }
        });
    }

    if (apiKey !== process.env.API_KEY) {
        logger.warn(`Forbidden access attempt: Invalid API Key - ${apiKey}`);
        throw new GraphQLError("Invalid API key", {
            extensions: {
                code: "FORBIDDEN",
                http: {
                    status: 403
                }
            }
        });
    }

    return { authenticated: true };
};