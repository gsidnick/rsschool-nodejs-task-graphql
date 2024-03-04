import {
  GraphQLBoolean,
  GraphQLInputObjectType,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import { UUIDType } from '../../types/uuid.js';
import { memberTypeType, newMemberTypeIdType } from '../member-types/member-type-type.js';
import { FastifyInstance } from 'fastify';

export interface dtoProfile {
  userId: string;
  memberTypeId: string;
  isMale: boolean;
  yearOfBirth: number;
}

export const profileType = new GraphQLObjectType({
  name: 'Profile',
  fields: {
    id: {
      type: new GraphQLNonNull(UUIDType),
    },
    isMale: {
      type: GraphQLBoolean,
    },
    yearOfBirth: {
      type: GraphQLInt,
    },
    userId: {
      type: new GraphQLNonNull(UUIDType),
    },
    memberType: {
      type: memberTypeType,
      resolve: async (
        { memberTypeId }: { memberTypeId: string },
        _,
        context: FastifyInstance,
      ) => {
        const memberType = await context.prisma.memberType.findUnique({
          where: {
            id: memberTypeId,
          },
        });
        if (memberType === null) {
          return null;
        }
        return memberType;
      },
    },
  },
});

export const newProfileInputType = new GraphQLInputObjectType({
  name: 'CreateProfileInput',
  fields: () => ({
    isMale: {
      type: new GraphQLNonNull(GraphQLBoolean),
    },
    yearOfBirth: {
      type: new GraphQLNonNull(GraphQLInt),
    },
    userId: {
      type: new GraphQLNonNull(UUIDType),
    },
    memberTypeId: {
      type: new GraphQLNonNull(newMemberTypeIdType),
    },
  }),
});

export const changeProfileInput = new GraphQLInputObjectType({
  name: 'ChangeProfileInput',
  fields: {
    userId: {
      type: GraphQLString,
    },
    memberTypeId: {
      type: GraphQLString,
    },
    isMale: {
      type: GraphQLBoolean,
    },
    yearOfBirth: {
      type: GraphQLInt,
    },
  },
});
