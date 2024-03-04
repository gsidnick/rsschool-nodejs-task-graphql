import DataLoader from 'dataloader';
import {
  GraphQLFloat,
  GraphQLInputObjectType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import { Post, Profile } from '@prisma/client';
import { UUIDType } from '../../types/uuid.js';
import { profileType } from '../profiles/profile-type.js';
import { postType } from '../posts/post-type.js';
import { UserSubscribedTo, SubscribedToUser, Context } from '../../types/context.js';

export interface dtoUser {
  name: string;
  balance: number;
}

export const userType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(UUIDType),
    },
    name: {
      type: new GraphQLNonNull(GraphQLString),
    },
    balance: {
      type: GraphQLFloat,
    },
    profile: {
      type: profileType,
      resolve: async (
        source: { id: string },
        _,
        { prisma, dataloaders }: Context,
        info,
      ) => {
        let dl = dataloaders.get(info.fieldNodes) as DataLoader<
          string,
          Profile | undefined
        >;

        if (!dl) {
          const batchProfile = async (ids: ReadonlyArray<string>) => {
            const profiles: Profile[] = await prisma.profile.findMany({
              where: {
                userId: {
                  in: ids as Array<string>,
                },
              },
            });

            const map = new Map(profiles.map((profile) => [profile.userId, profile]));
            return ids.map((id) => map.get(id));
          };

          dl = new DataLoader(batchProfile);
          dataloaders.set(info.fieldNodes, dl);
        }

        return dl.load(source.id);
      },
    },
    posts: {
      type: new GraphQLList(postType),
      resolve: async (
        source: { id: string },
        _,
        { prisma, dataloaders }: Context,
        info,
      ) => {
        let dl = dataloaders.get(info.fieldNodes) as DataLoader<
          string,
          Post[] | undefined
        >;

        if (!dl) {
          const batchPost = async (ids: ReadonlyArray<string>) => {
            const posts: Post[] = await prisma.post.findMany({
              where: {
                authorId: {
                  in: ids as Array<string>,
                },
              },
            });

            const map = new Map<string, Post[]>();

            posts.forEach((post) => {
              const userPosts = map.get(post.authorId) || [];
              map.set(post.authorId, [...userPosts, post]);
            });

            return ids.map((id) => map.get(id) || []);
          };

          dl = new DataLoader(batchPost);
          dataloaders.set(info.fieldNodes, dl);
        }

        return dl.load(source.id);
      },
    },
    userSubscribedTo: {
      type: new GraphQLList(userType),
      resolve: async (
        source: { id: string },
        _,
        { prisma, dataloaders }: Context,
        info,
      ) => {
        let dl = dataloaders.get(info.fieldNodes) as DataLoader<
          string,
          SubscribedToUser[] | undefined
        >;

        if (!dl) {
          const batchSubscribedToUser = async (ids: readonly string[]) => {
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

            const result: SubscribedToUser[][] = ids.map(
              (id) => subscribeMap.get(id) || [],
            );

            return result;
          };

          dl = new DataLoader(batchSubscribedToUser);
          dataloaders.set(info.fieldNodes, dl);
        }

        return dl.load(source.id);
      },
    },
    subscribedToUser: {
      type: new GraphQLList(userType),
      resolve: async (
        source: { id: string },
        _,
        { prisma, dataloaders }: Context,
        info,
      ) => {
        let dl = dataloaders.get(info.fieldNodes) as DataLoader<
          string,
          UserSubscribedTo[] | undefined
        >;

        if (!dl) {
          const batchUserSubscribedTo = async (ids: readonly string[]) => {
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

            const result: UserSubscribedTo[][] = ids.map(
              (id) => subscribeMap.get(id) || [],
            );

            return result;
          };

          dl = new DataLoader(batchUserSubscribedTo);
          dataloaders.set(info.fieldNodes, dl);
        }

        return dl.load(source.id);
      },
    },
  }),
});

export const newUserInputType = new GraphQLInputObjectType({
  name: 'CreateUserInput',
  fields: {
    name: {
      type: new GraphQLNonNull(GraphQLString),
    },
    balance: {
      type: new GraphQLNonNull(GraphQLFloat),
    },
  },
});

export const changeUserInput = new GraphQLInputObjectType({
  name: 'ChangeUserInput',
  fields: {
    name: {
      type: GraphQLString,
    },
    balance: {
      type: GraphQLFloat,
    },
  },
});
