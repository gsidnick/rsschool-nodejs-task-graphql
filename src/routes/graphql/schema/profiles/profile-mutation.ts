import { FastifyInstance } from 'fastify';
import { GraphQLNonNull } from 'graphql';
import { dtoProfile, newProfileInputType, profileType } from './profile-type.js';

export const createProfile = {
  type: profileType,
  args: {
    dto: {
      type: new GraphQLNonNull(newProfileInputType),
    },
  },
  resolve: async (_, { dto }: { dto: dtoProfile }, context: FastifyInstance) => {
    return await context.prisma.profile.create({ data: dto });
  },
};
