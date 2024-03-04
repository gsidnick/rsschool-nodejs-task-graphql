import DataLoader from 'dataloader';
import {
  Post,
  Profile,
  MemberType,
  PrismaClient,
  User,
  SubscribersOnAuthors,
} from '@prisma/client';

export type SubscribedToUser = {
  subscribedToUser: SubscribersOnAuthors[];
} & User;

export type UserSubscribedTo = {
  userSubscribedTo: SubscribersOnAuthors[];
} & User;

type DataLoaderType =
  | MemberType
  | Profile
  | Post[]
  | SubscribedToUser[]
  | UserSubscribedTo[];

export type Context = {
  prisma: PrismaClient;
  dataloaders: WeakMap<WeakKey, DataLoader<string, DataLoaderType | undefined, string>>;
};
