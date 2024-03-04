import { GraphQLList, GraphQLNonNull } from 'graphql';
import { UUIDType } from '../../types/uuid.js';
import { postType } from './post-type.js';
import { Context } from '../../types/context.js';

export const posts = {
  type: new GraphQLList(postType),
  resolve: async (_, __, context: Context) => await context.prisma.post.findMany(),
};

export const post = {
  type: postType,
  args: {
    id: {
      type: new GraphQLNonNull(UUIDType),
    },
  },
  resolve: async (_, { id }: { id: string }, context: Context) => {
    const post = await context.prisma.post.findUnique({
      where: {
        id,
      },
    });
    if (post === null) {
      return null;
    }
    return post;
  },
};
