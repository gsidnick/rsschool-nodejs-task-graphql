import { GraphQLBoolean, GraphQLInt, GraphQLNonNull, GraphQLObjectType } from 'graphql';
import { UUIDType } from '../../types/uuid.js';
import { memberTypeType } from '../member-types/member-type-type.js';
import { FastifyInstance } from 'fastify';

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
