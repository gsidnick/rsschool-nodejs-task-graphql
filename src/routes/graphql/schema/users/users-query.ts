import { GraphQLList, GraphQLNonNull } from 'graphql';
import { UUIDType } from '../../types/uuid.js';
import { userType } from './user-type.js';
import { Context } from '../../types/context.js';

export const users = {
  type: new GraphQLList(userType),
  resolve: async (_parent, _args, { prisma }: Context) => await prisma.user.findMany(),
};

export const user = {
  type: userType,
  args: {
    id: {
      type: new GraphQLNonNull(UUIDType),
    },
  },
  resolve: async (_, { id }: { id: string }, { prisma }: Context) => {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    });
    if (user === null) {
      return null;
    }
    return user;
  },
};
