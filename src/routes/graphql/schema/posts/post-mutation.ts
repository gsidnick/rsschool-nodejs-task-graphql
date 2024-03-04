import { FastifyInstance } from 'fastify';
import { postType, newPostInputType, dtoPost } from './post-type.js';
import { GraphQLBoolean, GraphQLNonNull } from 'graphql';
import { UUIDType } from '../../types/uuid.js';

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

export const deletePost = {
  type: GraphQLBoolean,
  args: {
    id: {
      type: new GraphQLNonNull(UUIDType),
    },
  },
  resolve: async (_, { id }: { id: string }, context: FastifyInstance) => {
    await context.prisma.post.delete({
      where: {
        id,
      },
    });
    return null;
  },
};
