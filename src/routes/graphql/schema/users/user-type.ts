import {
  GraphQLFloat,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import { UUIDType } from '../../types/uuid.js';
import { profileType } from '../profiles/profile-type.js';
import { postType } from '../posts/post-type.js';
import { FastifyInstance } from 'fastify';

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
      resolve: async ({ id }: { id: string }, _, context: FastifyInstance) => {
        const profile = await context.prisma.profile.findUnique({
          where: {
            userId: id,
          },
        });
        if (profile === null) {
          return null;
        }
        return profile;
      },
    },
    posts: {
      type: new GraphQLList(postType),
      resolve: async ({ id }: { id: string }, _, context: FastifyInstance) => {
        const post = await context.prisma.post.findMany({
          where: {
            authorId: id,
          },
        });
        if (post === null) {
          return null;
        }
        return post;
      },
    },
    userSubscribedTo: {
      type: new GraphQLList(userType),
      resolve: async ({ id }: { id: string }, _, context: FastifyInstance) => {
        return context.prisma.user.findMany({
          where: {
            subscribedToUser: {
              some: {
                subscriberId: id,
              },
            },
          },
        });
      },
    },
    subscribedToUser: {
      type: new GraphQLList(userType),
      resolve: async ({ id }: { id: string }, _, context: FastifyInstance) => {
        return context.prisma.user.findMany({
          where: {
            userSubscribedTo: {
              some: {
                authorId: id,
              },
            },
          },
        });
      },
    },
  }),
});