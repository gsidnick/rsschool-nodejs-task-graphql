import { GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql';
import { UUIDType } from '../../types/uuid.js';

export const postType = new GraphQLObjectType({
  name: 'Post',
  fields: {
    id: {
      type: new GraphQLNonNull(UUIDType),
    },
    title: {
      type: GraphQLString,
    },
    content: {
      type: GraphQLString,
    },
    authorId: {
      type: new GraphQLNonNull(UUIDType),
    },
  },
});
