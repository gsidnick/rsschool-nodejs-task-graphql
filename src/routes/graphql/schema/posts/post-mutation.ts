import { postType, newPostInputType, dtoPost, changePostInput } from './post-type.js';
import { GraphQLBoolean, GraphQLNonNull } from 'graphql';
import { UUIDType } from '../../types/uuid.js';
import { Context } from '../../types/context.js';

export const createPost = {
  type: postType,
  args: {
    dto: {
      type: new GraphQLNonNull(newPostInputType),
    },
  },
  resolve: async (_, { dto }: { dto: dtoPost }, context: Context) => {
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
  resolve: async (_, { id }: { id: string }, context: Context) => {
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
    context: Context,
  ) => {
    return await context.prisma.post.update({
      where: { id },
      data: { ...dto },
    });
  },
};
