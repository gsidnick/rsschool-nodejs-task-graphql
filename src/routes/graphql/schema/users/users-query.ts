import { FastifyInstance } from 'fastify';
import { GraphQLList, GraphQLNonNull } from 'graphql';
import { UUIDType } from '../../types/uuid.js';
import { userType } from './user-type.js';

export const users = {
  type: new GraphQLList(userType),
  resolve: async (_, __, context: FastifyInstance) =>
    await context.prisma.user.findMany(),
};

export const user = {
  type: userType,
  args: {
    id: {
      type: new GraphQLNonNull(UUIDType),
    },
  },
  resolve: async (_, { id }: { id: string }, context: FastifyInstance) => {
    const user = await context.prisma.user.findUnique({
      where: {
        id,
      },
    });
    if (user === null) {
      return null;
    }
    return user;
  },
};
