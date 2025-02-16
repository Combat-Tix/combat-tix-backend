import mongoose from "mongoose"

export const resolvers = {
  Query: {
    healthCheck: () => ({
      status: 'ok',
      database:
        mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    }),
  },
};
