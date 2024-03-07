import { GraphQLBoolean, GraphQLNonNull } from 'graphql';
import { changeUserInput, dtoUser, newUserInputType, userType } from './user-type.js';
import { UUIDType } from '../../types/uuid.js';
import { Context } from '../../types/context.js';

export const createUser = {
  type: userType,
  args: {
    dto: {
      type: new GraphQLNonNull(newUserInputType),
    },
  },
  resolve: async (_, { dto }: { dto: dtoUser }, context: Context) => {
    return await context.prisma.user.create({ data: dto });
  },
};

export const deleteUser = {
  type: GraphQLBoolean,
  args: {
    id: {
      type: new GraphQLNonNull(UUIDType),
    },
  },
  resolve: async (_, { id }: { id: string }, context: Context) => {
    await context.prisma.user.delete({
      where: {
        id,
      },
    });
    return null;
  },
};

export const changeUser = {
  type: userType,
  args: {
    id: {
      type: new GraphQLNonNull(UUIDType),
    },
    dto: {
      type: new GraphQLNonNull(changeUserInput),
    },
  },
  resolve: async (
    _,
    { id, dto }: { id: string; dto: Partial<dtoUser> },
    context: Context,
  ) => {
    return await context.prisma.user.update({
      where: { id },
      data: { ...dto },
    });
  },
};

export const subscribeTo = {
  type: userType,
  args: {
    userId: {
      type: new GraphQLNonNull(UUIDType),
    },
    authorId: {
      type: new GraphQLNonNull(UUIDType),
    },
  },
  resolve: async (
    _,
    { userId, authorId }: { userId: string; authorId: string },
    context: Context,
  ) => {
    return await context.prisma.user.update({
      where: { id: userId },
      data: {
        userSubscribedTo: {
          create: {
            authorId: authorId,
          },
        },
      },
    });
  },
};

export const unsubscribeFrom = {
  type: GraphQLBoolean,
  args: {
    userId: {
      type: new GraphQLNonNull(UUIDType),
    },
    authorId: {
      type: new GraphQLNonNull(UUIDType),
    },
  },
  resolve: async (
    _,
    { userId, authorId }: { userId: string; authorId: string },
    context: Context,
  ) => {
    await context.prisma.subscribersOnAuthors.delete({
      where: {
        subscriberId_authorId: {
          subscriberId: userId,
          authorId: authorId,
        },
      },
    });
    return true;
  },
};
