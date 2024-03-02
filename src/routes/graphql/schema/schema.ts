import { GraphQLObjectType, GraphQLSchema } from 'graphql';
import { memberTypes } from './member-types/member-types-query.js';
import { posts } from './posts/posts-query.js';
import { users } from './users/users-query.js';
import { profiles } from './profiles/profiles-query.js';

const rootQuery = new GraphQLObjectType({
  name: 'Query',
  fields: {
    memberTypes,
    posts,
    users,
    profiles,
  },
});

export default new GraphQLSchema({ query: rootQuery });
