import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, ExecuteQueryOptions, MutationRef, MutationPromise, DataConnectSettings } from 'firebase/data-connect';

export const connectorConfig: ConnectorConfig;
export const dataConnectSettings: DataConnectSettings;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;




export interface Category_Key {
  id: UUIDString;
  __typename?: 'Category_Key';
}

export interface Comment_Key {
  id: UUIDString;
  __typename?: 'Comment_Key';
}

export interface CreateCommentData {
  comment_insert: Comment_Key;
}

export interface CreateCommentVariables {
  reportId: UUIDString;
  content: string;
}

export interface CreateReportData {
  report_insert: Report_Key;
}

export interface CreateReportVariables {
  title: string;
  description: string;
  lat: number;
  lon: number;
  catId?: UUIDString | null;
}

export interface CreateVoteData {
  vote_insert: Vote_Key;
}

export interface CreateVoteVariables {
  reportId: UUIDString;
}

export interface GetCurrentUserProfileData {
  user?: {
    fullName: string;
    email: string;
    role: string;
    phoneNumber?: string | null;
    avatarUrl?: string | null;
  };
}

export interface Report_Key {
  id: UUIDString;
  __typename?: 'Report_Key';
}

export interface User_Key {
  id: UUIDString;
  __typename?: 'User_Key';
}

export interface Vote_Key {
  id: UUIDString;
  __typename?: 'Vote_Key';
}

interface CreateReportRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateReportVariables): MutationRef<CreateReportData, CreateReportVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateReportVariables): MutationRef<CreateReportData, CreateReportVariables>;
  operationName: string;
}
export const createReportRef: CreateReportRef;

export function createReport(vars: CreateReportVariables): MutationPromise<CreateReportData, CreateReportVariables>;
export function createReport(dc: DataConnect, vars: CreateReportVariables): MutationPromise<CreateReportData, CreateReportVariables>;

interface CreateCommentRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateCommentVariables): MutationRef<CreateCommentData, CreateCommentVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateCommentVariables): MutationRef<CreateCommentData, CreateCommentVariables>;
  operationName: string;
}
export const createCommentRef: CreateCommentRef;

export function createComment(vars: CreateCommentVariables): MutationPromise<CreateCommentData, CreateCommentVariables>;
export function createComment(dc: DataConnect, vars: CreateCommentVariables): MutationPromise<CreateCommentData, CreateCommentVariables>;

interface CreateVoteRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateVoteVariables): MutationRef<CreateVoteData, CreateVoteVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateVoteVariables): MutationRef<CreateVoteData, CreateVoteVariables>;
  operationName: string;
}
export const createVoteRef: CreateVoteRef;

export function createVote(vars: CreateVoteVariables): MutationPromise<CreateVoteData, CreateVoteVariables>;
export function createVote(dc: DataConnect, vars: CreateVoteVariables): MutationPromise<CreateVoteData, CreateVoteVariables>;

interface GetCurrentUserProfileRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetCurrentUserProfileData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<GetCurrentUserProfileData, undefined>;
  operationName: string;
}
export const getCurrentUserProfileRef: GetCurrentUserProfileRef;

export function getCurrentUserProfile(options?: ExecuteQueryOptions): QueryPromise<GetCurrentUserProfileData, undefined>;
export function getCurrentUserProfile(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<GetCurrentUserProfileData, undefined>;

