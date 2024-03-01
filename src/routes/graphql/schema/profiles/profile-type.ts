import { GraphQLBoolean, GraphQLInt, GraphQLNonNull, GraphQLObjectType } from 'graphql';
import { UUIDType } from '../../types/uuid.js';
import { memberTypeType } from '../member-types/member-type-type.js';

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
      type: new GraphQLNonNull(memberTypeType),
    },
  },
});
