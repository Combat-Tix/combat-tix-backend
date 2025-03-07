export const typeDefs = `#graphql
  type HealthCheck {
    status: String!
    database: String!
  }

  type Query {
    healthCheck: HealthCheck!
  }
`;
