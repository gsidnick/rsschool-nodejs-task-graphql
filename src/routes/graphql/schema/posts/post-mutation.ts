import { FastifyInstance } from 'fastify';
import { postType, newPostInputType, dtoPost } from './post-type.js';
import { GraphQLNonNull } from 'graphql';

export const createPost = {
  type: postType,
  args: {
    dto: {
      type: new GraphQLNonNull(newPostInputType),
    },
  },
  resolve: async (_, { dto }: { dto: dtoPost }, context: FastifyInstance) => {
    return await context.prisma.post.create({ data: dto });
  },
};
