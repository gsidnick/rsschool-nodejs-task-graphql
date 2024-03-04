import {
  GraphQLInputObjectType,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import { UUIDType } from '../../types/uuid.js';

export interface dtoPost {
  title: string;
  content: string;
  authorId: string;
}

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

export const newPostInputType = new GraphQLInputObjectType({
  name: 'CreatePostInput',
  fields: {
    title: {
      type: new GraphQLNonNull(GraphQLString),
    },
    content: {
      type: new GraphQLNonNull(GraphQLString),
    },
    authorId: {
      type: new GraphQLNonNull(UUIDType),
    },
  },
});
