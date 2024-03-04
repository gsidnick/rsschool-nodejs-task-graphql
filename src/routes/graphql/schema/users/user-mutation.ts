import { FastifyInstance } from 'fastify';
import { GraphQLNonNull } from 'graphql';
import { dtoUser, newUserInputType, userType } from './user-type.js';

export const createUser = {
  type: userType,
  args: {
    dto: {
      type: new GraphQLNonNull(newUserInputType),
    },
  },
  resolve: async (_, { dto }: { dto: dtoUser }, context: FastifyInstance) => {
    return await context.prisma.user.create({ data: dto });
  },
};
