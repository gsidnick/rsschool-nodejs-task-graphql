import { PrismaClient } from '@prisma/client';
import DataLoader from 'dataloader';
import { SubscribedToUser, UserSubscribedTo } from '../../types/context.js';

export const getSubscribeToUserLoader = (prisma: PrismaClient) => {
  return new DataLoader<string, UserSubscribedTo[]>(
    async (ids: readonly string[]): Promise<UserSubscribedTo[][]> => {
      const userSubscribedTo: UserSubscribedTo[] = await prisma.user.findMany({
        where: {
          userSubscribedTo: {
            some: {
              authorId: {
                in: ids as string[],
              },
            },
          },
        },
        include: {
          userSubscribedTo: true,
        },
      });

      const initialMap = new Map<string, UserSubscribedTo[]>();

      const subscribeMap = userSubscribedTo.reduce((map, user) => {
        user.userSubscribedTo.forEach((s) => {
          const users = map.get(s.authorId) || [];
          map.set(s.authorId, [...users, user]);
        });
        return map;
      }, initialMap);

      return ids.map((id) => subscribeMap.get(id) || []);
    },
  );
};

export const getUserSubscribedToLoader = (prisma: PrismaClient) => {
  return new DataLoader<string, SubscribedToUser[]>(
    async (ids: readonly string[]): Promise<SubscribedToUser[][]> => {
      const subscribedToUser: SubscribedToUser[] = await prisma.user.findMany({
        where: {
          subscribedToUser: {
            some: {
              subscriberId: {
                in: ids as string[],
              },
            },
          },
        },
        include: {
          subscribedToUser: true,
        },
      });

      const initialMap = new Map<string, SubscribedToUser[]>();

      const subscribeMap = subscribedToUser.reduce((map, user) => {
        user.subscribedToUser.forEach((s) => {
          const users = map.get(s.subscriberId) || [];
          map.set(s.subscriberId, [...users, user]);
        });
        return map;
      }, initialMap);

      return ids.map((id) => subscribeMap.get(id) || []);
    },
  );
};
