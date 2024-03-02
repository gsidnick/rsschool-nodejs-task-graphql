import { FastifyInstance } from 'fastify';
import { GraphQLList } from 'graphql';
import { memberTypeType } from './member-type-type.js';

export const memberTypes = {
  type: new GraphQLList(memberTypeType),
  resolve: async (_, __, context: FastifyInstance) =>
    await context.prisma.memberType.findMany(),
};
