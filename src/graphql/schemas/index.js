const { typeDefs: healthTypeDefs } = require("../types/health.js");
const { resolvers: healthResolvers } = require("../resolvers/health.js");

export const typeDefs = [healthTypeDefs];
export const resolvers = [healthResolvers];
