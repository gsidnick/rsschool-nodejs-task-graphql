import { GraphQLList, GraphQLNonNull, GraphQLResolveInfo } from 'graphql';
import { UUIDType } from '../../types/uuid.js';
import { userType } from './user-type.js';
import { Context, SubscribedToUser, UserSubscribedTo } from '../../types/context.js';
import { parseResolveInfo } from 'graphql-parse-resolve-info';

export const users = {
  type: new GraphQLList(userType),
  resolve: async (
    _,
    __,
    { prisma, userSubscribedToLoader, subscribeToUserLoader }: Context,
    info: GraphQLResolveInfo,
  ) => {
    const parsedInfo = parseResolveInfo(info);
    const fields = parsedInfo?.fieldsByTypeName.User ?? {};
    const subscribedToUser = 'subscribedToUser' in fields;
    const userSubscribedTo = 'userSubscribedTo' in fields;
    const isSubscribersExists = subscribedToUser || userSubscribedTo;

    const users = await prisma.user.findMany({
      include: {
        subscribedToUser,
        userSubscribedTo,
      },
    });

    if (isSubscribersExists) {
      const map = new Map<string, SubscribedToUser | UserSubscribedTo>(
        users.map((user) => [user.id, user]),
      );

      users.forEach((user) => {
        if (subscribedToUser) {
          const subUsers = user.subscribedToUser.map(
            ({ authorId }) => map.get(authorId) as UserSubscribedTo,
          );
          subscribeToUserLoader.prime(user.id, subUsers);
        }

        if (userSubscribedTo) {
          const subUsers = user.userSubscribedTo.map(
            ({ subscriberId }) => map.get(subscriberId) as SubscribedToUser,
          );
          userSubscribedToLoader.prime(user.id, subUsers);
        }
      });
    }

    return users;
  },
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
