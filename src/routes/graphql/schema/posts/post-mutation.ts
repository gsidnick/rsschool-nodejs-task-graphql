import { FastifyInstance } from 'fastify';
import { postType, newPostInputType, dtoPost, changePostInput } from './post-type.js';
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

export const changePost = {
  type: postType,
  args: {
    id: {
      type: new GraphQLNonNull(UUIDType),
    },
    dto: {
      type: new GraphQLNonNull(changePostInput),
    },
  },
  resolve: async (
    _,
    { id, dto }: { id: string; dto: Partial<dtoPost> },
    context: FastifyInstance,
  ) => {
    return await context.prisma.post.update({
      where: { id },
      data: { ...dto },
    });
  },
};
