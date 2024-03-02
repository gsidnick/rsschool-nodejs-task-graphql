import { GraphQLObjectType, GraphQLSchema } from 'graphql';
import { memberTypes, memberType } from './member-types/member-types-query.js';
import { posts, post } from './posts/posts-query.js';
import { users, user } from './users/users-query.js';
import { profiles, profile } from './profiles/profiles-query.js';

const rootQuery = new GraphQLObjectType({
  name: 'Query',
  fields: {
    memberTypes,
    memberType,
    posts,
    post,
    users,
    user,
    profiles,
    profile,
  },
});

export default new GraphQLSchema({ query: rootQuery });
