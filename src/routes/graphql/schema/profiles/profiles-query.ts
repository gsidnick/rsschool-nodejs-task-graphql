import { FastifyInstance } from 'fastify';
import { GraphQLList } from 'graphql';
import { profileType } from './profile-type.js';

export const profiles = {
  type: new GraphQLList(profileType),
  resolve: async (_, __, context: FastifyInstance) =>
    await context.prisma.profile.findMany(),
};
