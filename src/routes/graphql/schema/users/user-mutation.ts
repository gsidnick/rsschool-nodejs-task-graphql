import { FastifyInstance } from 'fastify';
import { GraphQLBoolean, GraphQLNonNull } from 'graphql';
import { dtoUser, newUserInputType, userType } from './user-type.js';
import { UUIDType } from '../../types/uuid.js';

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

export const deleteUser = {
  type: GraphQLBoolean,
  args: {
    id: {
      type: new GraphQLNonNull(UUIDType),
    },
  },
  resolve: async (_, { id }: { id: string }, context: FastifyInstance) => {
    await context.prisma.user.delete({
      where: {
        id,
      },
    });
    return null;
  },
};
