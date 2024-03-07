import {
  GraphQLEnumType,
  GraphQLFloat,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLObjectType,
} from 'graphql';

export const memberTypeIdType = new GraphQLEnumType({
  name: 'MemberTypeId',
  values: {
    basic: { value: 'basic' },
    business: { value: 'business' },
  },
});

export const newMemberTypeIdType = new GraphQLEnumType({
  name: 'newMemberTypeId',
  values: {
    basic: {
      value: 'basic',
    },
    business: {
      value: 'business',
    },
  },
});

export const memberTypeType = new GraphQLObjectType({
  name: 'MemberType',
  fields: {
    id: {
      type: new GraphQLNonNull(memberTypeIdType),
    },
    discount: {
      type: GraphQLFloat,
    },
    postsLimitPerMonth: {
      type: GraphQLInt,
    },
  },
});

export const newMemberTypeType = new GraphQLObjectType({
  name: 'MemberType',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(newMemberTypeIdType),
    },
    discount: {
      type: new GraphQLNonNull(GraphQLFloat),
    },
    postsLimitPerMonth: {
      type: new GraphQLNonNull(GraphQLInt),
    },
  }),
});
