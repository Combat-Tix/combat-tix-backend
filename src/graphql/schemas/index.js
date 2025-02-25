import { mergeTypeDefs } from "@graphql-tools/merge";
import { mergeResolvers } from "@graphql-tools/merge";
import { resolvers as healthResolvers } from "../resolvers/health.js";
import { typeDefs as healthTypeDefs } from "../types/health.js";
import { typeDefs as eventTypeDefs } from "../types/event.js";
import { resolvers as eventResolvers } from "../resolvers/event.js";

export const typeDefs = mergeTypeDefs([healthTypeDefs, eventTypeDefs]);
export const resolvers = mergeResolvers([healthResolvers, eventResolvers]);
