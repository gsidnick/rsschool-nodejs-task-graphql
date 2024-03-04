import { FastifyInstance } from 'fastify';
import { GraphQLBoolean, GraphQLNonNull } from 'graphql';
import {
  changeProfileInput,
  dtoProfile,
  newProfileInputType,
  profileType,
} from './profile-type.js';
import { UUIDType } from '../../types/uuid.js';

export const createProfile = {
  type: profileType,
  args: {
    dto: {
      type: new GraphQLNonNull(newProfileInputType),
    },
  },
  resolve: async (_, { dto }: { dto: dtoProfile }, context: FastifyInstance) => {
    return await context.prisma.profile.create({ data: dto });
  },
};

export const deleteProfile = {
  type: GraphQLBoolean,
  args: {
    id: {
      type: new GraphQLNonNull(UUIDType),
    },
  },
  resolve: async (_, { id }: { id: string }, context: FastifyInstance) => {
    await context.prisma.profile.delete({
      where: {
        id,
      },
    });
    return null;
  },
};

export const changeProfile = {
  type: profileType,
  args: {
    id: {
      type: new GraphQLNonNull(UUIDType),
    },
    dto: {
      type: new GraphQLNonNull(changeProfileInput),
    },
  },
  resolve: async (
    _,
    { id, dto }: { id: string; dto: Omit<dtoProfile, 'userId'> },
    context: FastifyInstance,
  ) => {
    return await context.prisma.profile.update({
      where: { id },
      data: { ...dto },
    });
  },
};
