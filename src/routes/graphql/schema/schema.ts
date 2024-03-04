import { GraphQLObjectType, GraphQLSchema } from 'graphql';
import { memberTypes, memberType } from './member-types/member-types-query.js';
import { posts, post } from './posts/posts-query.js';
import { users, user } from './users/users-query.js';
import { profiles, profile } from './profiles/profiles-query.js';
import { createPost, deletePost } from './posts/post-mutation.js';
import { createUser, deleteUser } from './users/user-mutation.js';
import { createProfile, deleteProfile } from './profiles/profile-mutation.js';

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

const rootMutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    createUser,
    createPost,
    createProfile,
    deleteUser,
    deletePost,
    deleteProfile,
  },
});

export default new GraphQLSchema({ query: rootQuery, mutation: rootMutation });
