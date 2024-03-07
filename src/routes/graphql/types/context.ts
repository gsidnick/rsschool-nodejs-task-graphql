import DataLoader from 'dataloader';
import {
  Post,
  Profile,
  MemberType,
  PrismaClient,
  User,
  SubscribersOnAuthors,
} from '@prisma/client';

export type UserSubscribedTo = {
  userSubscribedTo: SubscribersOnAuthors[];
} & User;

export type SubscribedToUser = {
  subscribedToUser: SubscribersOnAuthors[];
} & User;

type DataLoaderType =
  | MemberType
  | Profile
  | Post[]
  | User[]
  | SubscribedToUser[]
  | UserSubscribedTo[];

export type Context = {
  prisma: PrismaClient;
  dataloaders: WeakMap<WeakKey, DataLoader<string, DataLoaderType | undefined, string>>;
  subscribeToUserLoader: DataLoader<string, UserSubscribedTo[]>;
  userSubscribedToLoader: DataLoader<string, SubscribedToUser[]>;
};
