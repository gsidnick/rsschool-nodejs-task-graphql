import { GraphQLList, GraphQLNonNull } from 'graphql';
import { memberTypeIdType, memberTypeType } from './member-type-type.js';
import { Context } from '../../types/context.js';

export const memberTypes = {
  type: new GraphQLList(memberTypeType),
  resolve: async (_, __, context: Context) => await context.prisma.memberType.findMany(),
};

export const memberType = {
  type: memberTypeType,
  args: {
    id: {
      type: new GraphQLNonNull(memberTypeIdType),
    },
  },
  resolve: async (_, { id }: { id: string }, context: Context) => {
    const memberType = await context.prisma.memberType.findUnique({
      where: {
        id,
      },
    });
    if (memberType === null) {
      return null;
    }
    return memberType;
  },
};
