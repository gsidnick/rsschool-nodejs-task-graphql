import DataLoader from 'dataloader';
import {
  GraphQLBoolean,
  GraphQLInputObjectType,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import { MemberType } from '@prisma/client';
import { UUIDType } from '../../types/uuid.js';
import { memberTypeType, newMemberTypeIdType } from '../member-types/member-type-type.js';
import { Context } from '../../types/context.js';

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
        source: { memberTypeId: string },
        _,
        { prisma, dataloaders }: Context,
        info,
      ) => {
        let dl = dataloaders.get(info.fieldNodes) as DataLoader<
          string,
          MemberType | undefined
        >;

        if (!dl) {
          const batchMemberType = async (ids: ReadonlyArray<string>) => {
            const memberTypes: MemberType[] = await prisma.memberType.findMany({
              where: {
                id: {
                  in: ids as Array<string>,
                },
              },
            });

            const map = new Map(
              memberTypes.map((memberType) => [memberType.id, memberType]),
            );

            return ids.map((id) => map.get(id));
          };

          dl = new DataLoader(batchMemberType);
          dataloaders.set(info.fieldNodes, dl);
        }

        return dl.load(source.memberTypeId);
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
