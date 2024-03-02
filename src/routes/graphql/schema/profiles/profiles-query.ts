import { FastifyInstance } from 'fastify';
import { GraphQLList, GraphQLNonNull } from 'graphql';
import { profileType } from './profile-type.js';
import { UUIDType } from '../../types/uuid.js';

export const profiles = {
  type: new GraphQLList(profileType),
  resolve: async (_, __, context: FastifyInstance) =>
    await context.prisma.profile.findMany(),
};

export const profile = {
  type: profileType,
  args: {
    id: {
      type: new GraphQLNonNull(UUIDType),
    },
  },
  resolve: async (_, { id }: { id: string }, context: FastifyInstance) => {
    const profile = await context.prisma.profile.findUnique({
      where: {
        id,
      },
    });
    if (profile === null) {
      return null;
    }
    return profile;
  },
};
