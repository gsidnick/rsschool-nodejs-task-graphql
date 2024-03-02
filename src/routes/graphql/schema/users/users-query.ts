import { FastifyInstance } from 'fastify';
import { GraphQLList } from 'graphql';
import { userType } from './user-type.js';

export const users = {
  type: new GraphQLList(userType),
  resolve: async (_, __, context: FastifyInstance) =>
    await context.prisma.user.findMany(),
};
