import { FastifyInstance } from 'fastify';
import { GraphQLList, GraphQLNonNull } from 'graphql';
import { memberTypeIdType, memberTypeType } from './member-type-type.js';

export const memberTypes = {
  type: new GraphQLList(memberTypeType),
  resolve: async (_, __, context: FastifyInstance) =>
    await context.prisma.memberType.findMany(),
};

export const memberType = {
  type: memberTypeType,
  args: {
    id: {
      type: new GraphQLNonNull(memberTypeIdType),
    },
  },
  resolve: async (_, { id }: { id: string }, context: FastifyInstance) => {
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
