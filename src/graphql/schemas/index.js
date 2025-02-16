import { resolvers as healthResolvers } from '../resolvers/health.js';
import { typeDefs as healthTypeDefs } from '../types/health.js';

export const typeDefs = [healthTypeDefs];
export const resolvers = [healthResolvers];
