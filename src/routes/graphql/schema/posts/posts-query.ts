import { FastifyInstance } from 'fastify';
import { GraphQLList, GraphQLNonNull } from 'graphql';
import { UUIDType } from '../../types/uuid.js';
import { postType } from './post-type.js';

export const posts = {
  type: new GraphQLList(postType),
  resolve: async (_, __, context: FastifyInstance) =>
    await context.prisma.post.findMany(),
};

export const post = {
  type: postType,
  args: {
    id: {
      type: new GraphQLNonNull(UUIDType),
    },
  },
  resolve: async (_, { id }: { id: string }, context: FastifyInstance) => {
    const post = await context.prisma.post.findUnique({
      where: {
        id,
      },
    });

    return post;
  },
};
