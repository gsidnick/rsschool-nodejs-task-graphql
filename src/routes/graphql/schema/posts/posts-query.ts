import { FastifyInstance } from 'fastify';
import { GraphQLList } from 'graphql';
import { postType } from './post-type.js';

export const posts = {
  type: new GraphQLList(postType),
  resolve: async (_, __, context: FastifyInstance) =>
    await context.prisma.post.findMany(),
};
