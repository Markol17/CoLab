import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** The javascript `Date` as string. Type represents date and time as the ISO Date string. */
  DateTime: any;
  /** The `Upload` scalar type represents a file upload. */
  Upload: any;
};

export type Query = {
  __typename?: 'Query';
  paginatedProjects: PaginatedProjects;
  project?: Maybe<Project>;
  currentUser?: Maybe<User>;
  skills?: Maybe<SkillsResponse>;
  categories?: Maybe<CategoriesResponse>;
  schools: SchoolsResponse;
  schoolPrograms: SchoolProgramsResponse;
};


export type QueryPaginatedProjectsArgs = {
  offset: Scalars['Int'];
  limit: Scalars['Int'];
};


export type QueryProjectArgs = {
  id: Scalars['Int'];
};


export type QuerySchoolProgramsArgs = {
  schoolId: Scalars['Int'];
};

export type PaginatedProjects = {
  __typename?: 'PaginatedProjects';
  projects: Array<Project>;
  hasMore: Scalars['Boolean'];
};

export type Project = {
  __typename?: 'Project';
  id: Scalars['Float'];
  name: Scalars['String'];
  desc: Scalars['String'];
  points: Scalars['Int'];
  thumbnail?: Maybe<Scalars['String']>;
  limit: Scalars['Int'];
  creatorId: Scalars['Float'];
  creator: User;
  skills: Array<Skill>;
  categories: Array<Category>;
  members: Array<User>;
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
};

export type User = {
  __typename?: 'User';
  id: Scalars['Float'];
  username: Scalars['String'];
  firstName: Scalars['String'];
  lastName: Scalars['String'];
  email: Scalars['String'];
  yearOfStudy: Scalars['Int'];
  school: School;
  program: Program;
  skills: Array<Skill>;
  projects: Array<Project>;
  avatar?: Maybe<Scalars['String']>;
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
};

export type School = {
  __typename?: 'School';
  id: Scalars['Float'];
  name: Scalars['String'];
};

export type Program = {
  __typename?: 'Program';
  id: Scalars['Float'];
  name: Scalars['String'];
};

export type Skill = {
  __typename?: 'Skill';
  id: Scalars['Float'];
  type: Scalars['String'];
  color: Scalars['String'];
};


export type Category = {
  __typename?: 'Category';
  id: Scalars['Float'];
  name: Scalars['String'];
  color: Scalars['String'];
};

export type SkillsResponse = {
  __typename?: 'SkillsResponse';
  errors?: Maybe<Array<FieldError>>;
  skills?: Maybe<Array<Skill>>;
};

export type FieldError = {
  __typename?: 'FieldError';
  field: Scalars['String'];
  message: Scalars['String'];
};

export type CategoriesResponse = {
  __typename?: 'CategoriesResponse';
  errors?: Maybe<Array<FieldError>>;
  categories?: Maybe<Array<Category>>;
};

export type SchoolsResponse = {
  __typename?: 'SchoolsResponse';
  errors?: Maybe<Array<FieldError>>;
  schools?: Maybe<Array<School>>;
};

export type SchoolProgramsResponse = {
  __typename?: 'SchoolProgramsResponse';
  errors?: Maybe<Array<FieldError>>;
  programs?: Maybe<Array<Program>>;
};

export type Mutation = {
  __typename?: 'Mutation';
  joinProject: JoinProjectResponse;
  createProject: ProjectResponse;
  updateProject?: Maybe<Project>;
  deleteProject: Scalars['Boolean'];
  changePassword: UserResponse;
  forgotPassword: Scalars['Boolean'];
  register: UserResponse;
  login: UserResponse;
  logout: Scalars['Boolean'];
};


export type MutationJoinProjectArgs = {
  projectId: Scalars['Int'];
};


export type MutationCreateProjectArgs = {
  attributes: CreateProjectInput;
};


export type MutationUpdateProjectArgs = {
  desc: Scalars['String'];
  name: Scalars['String'];
  id: Scalars['Int'];
};


export type MutationDeleteProjectArgs = {
  id: Scalars['Int'];
};


export type MutationChangePasswordArgs = {
  attributes: ChangePasswordInput;
};


export type MutationForgotPasswordArgs = {
  email: Scalars['String'];
};


export type MutationRegisterArgs = {
  attributes: RegisterInput;
};


export type MutationLoginArgs = {
  attributes: LoginInput;
};

export type JoinProjectResponse = {
  __typename?: 'JoinProjectResponse';
  errors?: Maybe<Array<FieldError>>;
  joined?: Maybe<Scalars['Boolean']>;
};

export type ProjectResponse = {
  __typename?: 'ProjectResponse';
  errors?: Maybe<Array<FieldError>>;
  project?: Maybe<Project>;
};

export type CreateProjectInput = {
  name: Scalars['String'];
  desc: Scalars['String'];
  skillIds: Array<Scalars['Int']>;
  categoryIds: Array<Scalars['Int']>;
  thumbnail?: Maybe<Scalars['Upload']>;
};


export type UserResponse = {
  __typename?: 'UserResponse';
  errors?: Maybe<Array<FieldError>>;
  user?: Maybe<User>;
};

export type ChangePasswordInput = {
  token: Scalars['String'];
  newPassword: Scalars['String'];
};

export type RegisterInput = {
  email: Scalars['String'];
  username: Scalars['String'];
  firstName: Scalars['String'];
  lastName: Scalars['String'];
  password: Scalars['String'];
  startDateOfStudy: Scalars['DateTime'];
  expectedGraduationDate: Scalars['DateTime'];
  schoolId: Scalars['Int'];
  programId: Scalars['Int'];
};

export type LoginInput = {
  usernameOrEmail: Scalars['String'];
  password: Scalars['String'];
};

export type CategoriesResponseFragment = (
  { __typename?: 'CategoriesResponse' }
  & { errors?: Maybe<Array<(
    { __typename?: 'FieldError' }
    & ErrorFragment
  )>>, categories?: Maybe<Array<(
    { __typename?: 'Category' }
    & Pick<Category, 'id' | 'name'>
  )>> }
);

export type ErrorFragment = (
  { __typename?: 'FieldError' }
  & Pick<FieldError, 'field' | 'message'>
);

export type JoinProjectResponseFragment = (
  { __typename?: 'JoinProjectResponse' }
  & Pick<JoinProjectResponse, 'joined'>
  & { errors?: Maybe<Array<(
    { __typename?: 'FieldError' }
    & ErrorFragment
  )>> }
);

export type ProjectFragment = (
  { __typename?: 'Project' }
  & Pick<Project, 'id' | 'createdAt' | 'updatedAt' | 'name' | 'desc' | 'points' | 'thumbnail'>
  & { members: Array<(
    { __typename?: 'User' }
    & Pick<User, 'id'>
  )>, skills: Array<(
    { __typename?: 'Skill' }
    & Pick<Skill, 'id' | 'type' | 'color'>
  )>, categories: Array<(
    { __typename?: 'Category' }
    & Pick<Category, 'id' | 'name' | 'color'>
  )>, creator: (
    { __typename?: 'User' }
    & Pick<User, 'id' | 'username'>
  ) }
);

export type ProjectResponseFragment = (
  { __typename?: 'ProjectResponse' }
  & { errors?: Maybe<Array<(
    { __typename?: 'FieldError' }
    & ErrorFragment
  )>>, project?: Maybe<(
    { __typename?: 'Project' }
    & ProjectFragment
  )> }
);

export type SchoolProgramsResponseFragment = (
  { __typename?: 'SchoolProgramsResponse' }
  & { errors?: Maybe<Array<(
    { __typename?: 'FieldError' }
    & ErrorFragment
  )>>, programs?: Maybe<Array<(
    { __typename?: 'Program' }
    & Pick<Program, 'id' | 'name'>
  )>> }
);

export type SchoolsResponseFragment = (
  { __typename?: 'SchoolsResponse' }
  & { errors?: Maybe<Array<(
    { __typename?: 'FieldError' }
    & ErrorFragment
  )>>, schools?: Maybe<Array<(
    { __typename?: 'School' }
    & Pick<School, 'id' | 'name'>
  )>> }
);

export type SkillsResponseFragment = (
  { __typename?: 'SkillsResponse' }
  & { errors?: Maybe<Array<(
    { __typename?: 'FieldError' }
    & ErrorFragment
  )>>, skills?: Maybe<Array<(
    { __typename?: 'Skill' }
    & Pick<Skill, 'id' | 'type'>
  )>> }
);

export type UserFragment = (
  { __typename?: 'User' }
  & Pick<User, 'id' | 'username' | 'firstName' | 'lastName' | 'yearOfStudy' | 'email'>
  & { school: (
    { __typename?: 'School' }
    & Pick<School, 'id' | 'name'>
  ), program: (
    { __typename?: 'Program' }
    & Pick<Program, 'id' | 'name'>
  ), projects: Array<(
    { __typename?: 'Project' }
    & Pick<Project, 'id' | 'name' | 'thumbnail'>
  )>, skills: Array<(
    { __typename?: 'Skill' }
    & Pick<Skill, 'type'>
  )> }
);

export type UserResponseFragment = (
  { __typename?: 'UserResponse' }
  & { errors?: Maybe<Array<(
    { __typename?: 'FieldError' }
    & ErrorFragment
  )>>, user?: Maybe<(
    { __typename?: 'User' }
    & UserFragment
  )> }
);

export type ChangePasswordMutationVariables = Exact<{
  attributes: ChangePasswordInput;
}>;


export type ChangePasswordMutation = (
  { __typename?: 'Mutation' }
  & { changePassword: (
    { __typename?: 'UserResponse' }
    & UserResponseFragment
  ) }
);

export type CreateProjectMutationVariables = Exact<{
  attributes: CreateProjectInput;
}>;


export type CreateProjectMutation = (
  { __typename?: 'Mutation' }
  & { createProject: (
    { __typename?: 'ProjectResponse' }
    & ProjectResponseFragment
  ) }
);

export type DeleteProjectMutationVariables = Exact<{
  id: Scalars['Int'];
}>;


export type DeleteProjectMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'deleteProject'>
);

export type ForgotPasswordMutationVariables = Exact<{
  email: Scalars['String'];
}>;


export type ForgotPasswordMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'forgotPassword'>
);

export type JoinProjectMutationVariables = Exact<{
  projectId: Scalars['Int'];
}>;


export type JoinProjectMutation = (
  { __typename?: 'Mutation' }
  & { joinProject: (
    { __typename?: 'JoinProjectResponse' }
    & JoinProjectResponseFragment
  ) }
);

export type LoginMutationVariables = Exact<{
  attributes: LoginInput;
}>;


export type LoginMutation = (
  { __typename?: 'Mutation' }
  & { login: (
    { __typename?: 'UserResponse' }
    & UserResponseFragment
  ) }
);

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'logout'>
);

export type RegisterMutationVariables = Exact<{
  attributes: RegisterInput;
}>;


export type RegisterMutation = (
  { __typename?: 'Mutation' }
  & { register: (
    { __typename?: 'UserResponse' }
    & UserResponseFragment
  ) }
);

export type CategoriesQueryVariables = Exact<{ [key: string]: never; }>;


export type CategoriesQuery = (
  { __typename?: 'Query' }
  & { categories?: Maybe<(
    { __typename?: 'CategoriesResponse' }
    & CategoriesResponseFragment
  )> }
);

export type CurrentUserQueryVariables = Exact<{ [key: string]: never; }>;


export type CurrentUserQuery = (
  { __typename?: 'Query' }
  & { currentUser?: Maybe<(
    { __typename?: 'User' }
    & UserFragment
  )> }
);

export type PaginatedProjectsQueryVariables = Exact<{
  offset: Scalars['Int'];
  limit: Scalars['Int'];
}>;


export type PaginatedProjectsQuery = (
  { __typename?: 'Query' }
  & { paginatedProjects: (
    { __typename?: 'PaginatedProjects' }
    & Pick<PaginatedProjects, 'hasMore'>
    & { projects: Array<(
      { __typename?: 'Project' }
      & ProjectFragment
    )> }
  ) }
);

export type ProjectQueryVariables = Exact<{
  id: Scalars['Int'];
}>;


export type ProjectQuery = (
  { __typename?: 'Query' }
  & { project?: Maybe<(
    { __typename?: 'Project' }
    & ProjectFragment
  )> }
);

export type SchoolProgramsQueryVariables = Exact<{
  schoolId: Scalars['Int'];
}>;


export type SchoolProgramsQuery = (
  { __typename?: 'Query' }
  & { schoolPrograms: (
    { __typename?: 'SchoolProgramsResponse' }
    & SchoolProgramsResponseFragment
  ) }
);

export type SchoolsQueryVariables = Exact<{ [key: string]: never; }>;


export type SchoolsQuery = (
  { __typename?: 'Query' }
  & { schools: (
    { __typename?: 'SchoolsResponse' }
    & SchoolsResponseFragment
  ) }
);

export type SkillsQueryVariables = Exact<{ [key: string]: never; }>;


export type SkillsQuery = (
  { __typename?: 'Query' }
  & { skills?: Maybe<(
    { __typename?: 'SkillsResponse' }
    & SkillsResponseFragment
  )> }
);

export const ErrorFragmentDoc = gql`
    fragment Error on FieldError {
  field
  message
}
    `;
export const CategoriesResponseFragmentDoc = gql`
    fragment CategoriesResponse on CategoriesResponse {
  errors {
    ...Error
  }
  categories {
    id
    name
  }
}
    ${ErrorFragmentDoc}`;
export const JoinProjectResponseFragmentDoc = gql`
    fragment JoinProjectResponse on JoinProjectResponse {
  errors {
    ...Error
  }
  joined
}
    ${ErrorFragmentDoc}`;
export const ProjectFragmentDoc = gql`
    fragment Project on Project {
  id
  createdAt
  updatedAt
  name
  desc
  points
  thumbnail
  members {
    id
  }
  skills {
    id
    type
    color
  }
  categories {
    id
    name
    color
  }
  creator {
    id
    username
  }
}
    `;
export const ProjectResponseFragmentDoc = gql`
    fragment ProjectResponse on ProjectResponse {
  errors {
    ...Error
  }
  project {
    ...Project
  }
}
    ${ErrorFragmentDoc}
${ProjectFragmentDoc}`;
export const SchoolProgramsResponseFragmentDoc = gql`
    fragment SchoolProgramsResponse on SchoolProgramsResponse {
  errors {
    ...Error
  }
  programs {
    id
    name
  }
}
    ${ErrorFragmentDoc}`;
export const SchoolsResponseFragmentDoc = gql`
    fragment SchoolsResponse on SchoolsResponse {
  errors {
    ...Error
  }
  schools {
    id
    name
  }
}
    ${ErrorFragmentDoc}`;
export const SkillsResponseFragmentDoc = gql`
    fragment SkillsResponse on SkillsResponse {
  errors {
    ...Error
  }
  skills {
    id
    type
  }
}
    ${ErrorFragmentDoc}`;
export const UserFragmentDoc = gql`
    fragment User on User {
  id
  username
  firstName
  lastName
  yearOfStudy
  school {
    id
    name
  }
  program {
    id
    name
  }
  email
  projects {
    id
    name
    thumbnail
  }
  skills {
    type
  }
}
    `;
export const UserResponseFragmentDoc = gql`
    fragment UserResponse on UserResponse {
  errors {
    ...Error
  }
  user {
    ...User
  }
}
    ${ErrorFragmentDoc}
${UserFragmentDoc}`;
export const ChangePasswordDocument = gql`
    mutation ChangePassword($attributes: ChangePasswordInput!) {
  changePassword(attributes: $attributes) {
    ...UserResponse
  }
}
    ${UserResponseFragmentDoc}`;
export type ChangePasswordMutationFn = Apollo.MutationFunction<ChangePasswordMutation, ChangePasswordMutationVariables>;

/**
 * __useChangePasswordMutation__
 *
 * To run a mutation, you first call `useChangePasswordMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useChangePasswordMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [changePasswordMutation, { data, loading, error }] = useChangePasswordMutation({
 *   variables: {
 *      attributes: // value for 'attributes'
 *   },
 * });
 */
export function useChangePasswordMutation(baseOptions?: Apollo.MutationHookOptions<ChangePasswordMutation, ChangePasswordMutationVariables>) {
        return Apollo.useMutation<ChangePasswordMutation, ChangePasswordMutationVariables>(ChangePasswordDocument, baseOptions);
      }
export type ChangePasswordMutationHookResult = ReturnType<typeof useChangePasswordMutation>;
export type ChangePasswordMutationResult = Apollo.MutationResult<ChangePasswordMutation>;
export type ChangePasswordMutationOptions = Apollo.BaseMutationOptions<ChangePasswordMutation, ChangePasswordMutationVariables>;
export const CreateProjectDocument = gql`
    mutation CreateProject($attributes: CreateProjectInput!) {
  createProject(attributes: $attributes) {
    ...ProjectResponse
  }
}
    ${ProjectResponseFragmentDoc}`;
export type CreateProjectMutationFn = Apollo.MutationFunction<CreateProjectMutation, CreateProjectMutationVariables>;

/**
 * __useCreateProjectMutation__
 *
 * To run a mutation, you first call `useCreateProjectMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateProjectMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createProjectMutation, { data, loading, error }] = useCreateProjectMutation({
 *   variables: {
 *      attributes: // value for 'attributes'
 *   },
 * });
 */
export function useCreateProjectMutation(baseOptions?: Apollo.MutationHookOptions<CreateProjectMutation, CreateProjectMutationVariables>) {
        return Apollo.useMutation<CreateProjectMutation, CreateProjectMutationVariables>(CreateProjectDocument, baseOptions);
      }
export type CreateProjectMutationHookResult = ReturnType<typeof useCreateProjectMutation>;
export type CreateProjectMutationResult = Apollo.MutationResult<CreateProjectMutation>;
export type CreateProjectMutationOptions = Apollo.BaseMutationOptions<CreateProjectMutation, CreateProjectMutationVariables>;
export const DeleteProjectDocument = gql`
    mutation DeleteProject($id: Int!) {
  deleteProject(id: $id)
}
    `;
export type DeleteProjectMutationFn = Apollo.MutationFunction<DeleteProjectMutation, DeleteProjectMutationVariables>;

/**
 * __useDeleteProjectMutation__
 *
 * To run a mutation, you first call `useDeleteProjectMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteProjectMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteProjectMutation, { data, loading, error }] = useDeleteProjectMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteProjectMutation(baseOptions?: Apollo.MutationHookOptions<DeleteProjectMutation, DeleteProjectMutationVariables>) {
        return Apollo.useMutation<DeleteProjectMutation, DeleteProjectMutationVariables>(DeleteProjectDocument, baseOptions);
      }
export type DeleteProjectMutationHookResult = ReturnType<typeof useDeleteProjectMutation>;
export type DeleteProjectMutationResult = Apollo.MutationResult<DeleteProjectMutation>;
export type DeleteProjectMutationOptions = Apollo.BaseMutationOptions<DeleteProjectMutation, DeleteProjectMutationVariables>;
export const ForgotPasswordDocument = gql`
    mutation ForgotPassword($email: String!) {
  forgotPassword(email: $email)
}
    `;
export type ForgotPasswordMutationFn = Apollo.MutationFunction<ForgotPasswordMutation, ForgotPasswordMutationVariables>;

/**
 * __useForgotPasswordMutation__
 *
 * To run a mutation, you first call `useForgotPasswordMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useForgotPasswordMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [forgotPasswordMutation, { data, loading, error }] = useForgotPasswordMutation({
 *   variables: {
 *      email: // value for 'email'
 *   },
 * });
 */
export function useForgotPasswordMutation(baseOptions?: Apollo.MutationHookOptions<ForgotPasswordMutation, ForgotPasswordMutationVariables>) {
        return Apollo.useMutation<ForgotPasswordMutation, ForgotPasswordMutationVariables>(ForgotPasswordDocument, baseOptions);
      }
export type ForgotPasswordMutationHookResult = ReturnType<typeof useForgotPasswordMutation>;
export type ForgotPasswordMutationResult = Apollo.MutationResult<ForgotPasswordMutation>;
export type ForgotPasswordMutationOptions = Apollo.BaseMutationOptions<ForgotPasswordMutation, ForgotPasswordMutationVariables>;
export const JoinProjectDocument = gql`
    mutation joinProject($projectId: Int!) {
  joinProject(projectId: $projectId) {
    ...JoinProjectResponse
  }
}
    ${JoinProjectResponseFragmentDoc}`;
export type JoinProjectMutationFn = Apollo.MutationFunction<JoinProjectMutation, JoinProjectMutationVariables>;

/**
 * __useJoinProjectMutation__
 *
 * To run a mutation, you first call `useJoinProjectMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useJoinProjectMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [joinProjectMutation, { data, loading, error }] = useJoinProjectMutation({
 *   variables: {
 *      projectId: // value for 'projectId'
 *   },
 * });
 */
export function useJoinProjectMutation(baseOptions?: Apollo.MutationHookOptions<JoinProjectMutation, JoinProjectMutationVariables>) {
        return Apollo.useMutation<JoinProjectMutation, JoinProjectMutationVariables>(JoinProjectDocument, baseOptions);
      }
export type JoinProjectMutationHookResult = ReturnType<typeof useJoinProjectMutation>;
export type JoinProjectMutationResult = Apollo.MutationResult<JoinProjectMutation>;
export type JoinProjectMutationOptions = Apollo.BaseMutationOptions<JoinProjectMutation, JoinProjectMutationVariables>;
export const LoginDocument = gql`
    mutation Login($attributes: LoginInput!) {
  login(attributes: $attributes) {
    ...UserResponse
  }
}
    ${UserResponseFragmentDoc}`;
export type LoginMutationFn = Apollo.MutationFunction<LoginMutation, LoginMutationVariables>;

/**
 * __useLoginMutation__
 *
 * To run a mutation, you first call `useLoginMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLoginMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [loginMutation, { data, loading, error }] = useLoginMutation({
 *   variables: {
 *      attributes: // value for 'attributes'
 *   },
 * });
 */
export function useLoginMutation(baseOptions?: Apollo.MutationHookOptions<LoginMutation, LoginMutationVariables>) {
        return Apollo.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument, baseOptions);
      }
export type LoginMutationHookResult = ReturnType<typeof useLoginMutation>;
export type LoginMutationResult = Apollo.MutationResult<LoginMutation>;
export type LoginMutationOptions = Apollo.BaseMutationOptions<LoginMutation, LoginMutationVariables>;
export const LogoutDocument = gql`
    mutation Logout {
  logout
}
    `;
export type LogoutMutationFn = Apollo.MutationFunction<LogoutMutation, LogoutMutationVariables>;

/**
 * __useLogoutMutation__
 *
 * To run a mutation, you first call `useLogoutMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLogoutMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [logoutMutation, { data, loading, error }] = useLogoutMutation({
 *   variables: {
 *   },
 * });
 */
export function useLogoutMutation(baseOptions?: Apollo.MutationHookOptions<LogoutMutation, LogoutMutationVariables>) {
        return Apollo.useMutation<LogoutMutation, LogoutMutationVariables>(LogoutDocument, baseOptions);
      }
export type LogoutMutationHookResult = ReturnType<typeof useLogoutMutation>;
export type LogoutMutationResult = Apollo.MutationResult<LogoutMutation>;
export type LogoutMutationOptions = Apollo.BaseMutationOptions<LogoutMutation, LogoutMutationVariables>;
export const RegisterDocument = gql`
    mutation Register($attributes: RegisterInput!) {
  register(attributes: $attributes) {
    ...UserResponse
  }
}
    ${UserResponseFragmentDoc}`;
export type RegisterMutationFn = Apollo.MutationFunction<RegisterMutation, RegisterMutationVariables>;

/**
 * __useRegisterMutation__
 *
 * To run a mutation, you first call `useRegisterMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRegisterMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [registerMutation, { data, loading, error }] = useRegisterMutation({
 *   variables: {
 *      attributes: // value for 'attributes'
 *   },
 * });
 */
export function useRegisterMutation(baseOptions?: Apollo.MutationHookOptions<RegisterMutation, RegisterMutationVariables>) {
        return Apollo.useMutation<RegisterMutation, RegisterMutationVariables>(RegisterDocument, baseOptions);
      }
export type RegisterMutationHookResult = ReturnType<typeof useRegisterMutation>;
export type RegisterMutationResult = Apollo.MutationResult<RegisterMutation>;
export type RegisterMutationOptions = Apollo.BaseMutationOptions<RegisterMutation, RegisterMutationVariables>;
export const CategoriesDocument = gql`
    query Categories {
  categories {
    ...CategoriesResponse
  }
}
    ${CategoriesResponseFragmentDoc}`;

/**
 * __useCategoriesQuery__
 *
 * To run a query within a React component, call `useCategoriesQuery` and pass it any options that fit your needs.
 * When your component renders, `useCategoriesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCategoriesQuery({
 *   variables: {
 *   },
 * });
 */
export function useCategoriesQuery(baseOptions?: Apollo.QueryHookOptions<CategoriesQuery, CategoriesQueryVariables>) {
        return Apollo.useQuery<CategoriesQuery, CategoriesQueryVariables>(CategoriesDocument, baseOptions);
      }
export function useCategoriesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CategoriesQuery, CategoriesQueryVariables>) {
          return Apollo.useLazyQuery<CategoriesQuery, CategoriesQueryVariables>(CategoriesDocument, baseOptions);
        }
export type CategoriesQueryHookResult = ReturnType<typeof useCategoriesQuery>;
export type CategoriesLazyQueryHookResult = ReturnType<typeof useCategoriesLazyQuery>;
export type CategoriesQueryResult = Apollo.QueryResult<CategoriesQuery, CategoriesQueryVariables>;
export const CurrentUserDocument = gql`
    query CurrentUser {
  currentUser {
    ...User
  }
}
    ${UserFragmentDoc}`;

/**
 * __useCurrentUserQuery__
 *
 * To run a query within a React component, call `useCurrentUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useCurrentUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCurrentUserQuery({
 *   variables: {
 *   },
 * });
 */
export function useCurrentUserQuery(baseOptions?: Apollo.QueryHookOptions<CurrentUserQuery, CurrentUserQueryVariables>) {
        return Apollo.useQuery<CurrentUserQuery, CurrentUserQueryVariables>(CurrentUserDocument, baseOptions);
      }
export function useCurrentUserLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CurrentUserQuery, CurrentUserQueryVariables>) {
          return Apollo.useLazyQuery<CurrentUserQuery, CurrentUserQueryVariables>(CurrentUserDocument, baseOptions);
        }
export type CurrentUserQueryHookResult = ReturnType<typeof useCurrentUserQuery>;
export type CurrentUserLazyQueryHookResult = ReturnType<typeof useCurrentUserLazyQuery>;
export type CurrentUserQueryResult = Apollo.QueryResult<CurrentUserQuery, CurrentUserQueryVariables>;
export const PaginatedProjectsDocument = gql`
    query PaginatedProjects($offset: Int!, $limit: Int!) {
  paginatedProjects(limit: $limit, offset: $offset) {
    hasMore
    projects {
      ...Project
    }
  }
}
    ${ProjectFragmentDoc}`;

/**
 * __usePaginatedProjectsQuery__
 *
 * To run a query within a React component, call `usePaginatedProjectsQuery` and pass it any options that fit your needs.
 * When your component renders, `usePaginatedProjectsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePaginatedProjectsQuery({
 *   variables: {
 *      offset: // value for 'offset'
 *      limit: // value for 'limit'
 *   },
 * });
 */
export function usePaginatedProjectsQuery(baseOptions?: Apollo.QueryHookOptions<PaginatedProjectsQuery, PaginatedProjectsQueryVariables>) {
        return Apollo.useQuery<PaginatedProjectsQuery, PaginatedProjectsQueryVariables>(PaginatedProjectsDocument, baseOptions);
      }
export function usePaginatedProjectsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<PaginatedProjectsQuery, PaginatedProjectsQueryVariables>) {
          return Apollo.useLazyQuery<PaginatedProjectsQuery, PaginatedProjectsQueryVariables>(PaginatedProjectsDocument, baseOptions);
        }
export type PaginatedProjectsQueryHookResult = ReturnType<typeof usePaginatedProjectsQuery>;
export type PaginatedProjectsLazyQueryHookResult = ReturnType<typeof usePaginatedProjectsLazyQuery>;
export type PaginatedProjectsQueryResult = Apollo.QueryResult<PaginatedProjectsQuery, PaginatedProjectsQueryVariables>;
export const ProjectDocument = gql`
    query Project($id: Int!) {
  project(id: $id) {
    ...Project
  }
}
    ${ProjectFragmentDoc}`;

/**
 * __useProjectQuery__
 *
 * To run a query within a React component, call `useProjectQuery` and pass it any options that fit your needs.
 * When your component renders, `useProjectQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useProjectQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useProjectQuery(baseOptions?: Apollo.QueryHookOptions<ProjectQuery, ProjectQueryVariables>) {
        return Apollo.useQuery<ProjectQuery, ProjectQueryVariables>(ProjectDocument, baseOptions);
      }
export function useProjectLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ProjectQuery, ProjectQueryVariables>) {
          return Apollo.useLazyQuery<ProjectQuery, ProjectQueryVariables>(ProjectDocument, baseOptions);
        }
export type ProjectQueryHookResult = ReturnType<typeof useProjectQuery>;
export type ProjectLazyQueryHookResult = ReturnType<typeof useProjectLazyQuery>;
export type ProjectQueryResult = Apollo.QueryResult<ProjectQuery, ProjectQueryVariables>;
export const SchoolProgramsDocument = gql`
    query SchoolPrograms($schoolId: Int!) {
  schoolPrograms(schoolId: $schoolId) {
    ...SchoolProgramsResponse
  }
}
    ${SchoolProgramsResponseFragmentDoc}`;

/**
 * __useSchoolProgramsQuery__
 *
 * To run a query within a React component, call `useSchoolProgramsQuery` and pass it any options that fit your needs.
 * When your component renders, `useSchoolProgramsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSchoolProgramsQuery({
 *   variables: {
 *      schoolId: // value for 'schoolId'
 *   },
 * });
 */
export function useSchoolProgramsQuery(baseOptions?: Apollo.QueryHookOptions<SchoolProgramsQuery, SchoolProgramsQueryVariables>) {
        return Apollo.useQuery<SchoolProgramsQuery, SchoolProgramsQueryVariables>(SchoolProgramsDocument, baseOptions);
      }
export function useSchoolProgramsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SchoolProgramsQuery, SchoolProgramsQueryVariables>) {
          return Apollo.useLazyQuery<SchoolProgramsQuery, SchoolProgramsQueryVariables>(SchoolProgramsDocument, baseOptions);
        }
export type SchoolProgramsQueryHookResult = ReturnType<typeof useSchoolProgramsQuery>;
export type SchoolProgramsLazyQueryHookResult = ReturnType<typeof useSchoolProgramsLazyQuery>;
export type SchoolProgramsQueryResult = Apollo.QueryResult<SchoolProgramsQuery, SchoolProgramsQueryVariables>;
export const SchoolsDocument = gql`
    query Schools {
  schools {
    ...SchoolsResponse
  }
}
    ${SchoolsResponseFragmentDoc}`;

/**
 * __useSchoolsQuery__
 *
 * To run a query within a React component, call `useSchoolsQuery` and pass it any options that fit your needs.
 * When your component renders, `useSchoolsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSchoolsQuery({
 *   variables: {
 *   },
 * });
 */
export function useSchoolsQuery(baseOptions?: Apollo.QueryHookOptions<SchoolsQuery, SchoolsQueryVariables>) {
        return Apollo.useQuery<SchoolsQuery, SchoolsQueryVariables>(SchoolsDocument, baseOptions);
      }
export function useSchoolsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SchoolsQuery, SchoolsQueryVariables>) {
          return Apollo.useLazyQuery<SchoolsQuery, SchoolsQueryVariables>(SchoolsDocument, baseOptions);
        }
export type SchoolsQueryHookResult = ReturnType<typeof useSchoolsQuery>;
export type SchoolsLazyQueryHookResult = ReturnType<typeof useSchoolsLazyQuery>;
export type SchoolsQueryResult = Apollo.QueryResult<SchoolsQuery, SchoolsQueryVariables>;
export const SkillsDocument = gql`
    query Skills {
  skills {
    ...SkillsResponse
  }
}
    ${SkillsResponseFragmentDoc}`;

/**
 * __useSkillsQuery__
 *
 * To run a query within a React component, call `useSkillsQuery` and pass it any options that fit your needs.
 * When your component renders, `useSkillsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSkillsQuery({
 *   variables: {
 *   },
 * });
 */
export function useSkillsQuery(baseOptions?: Apollo.QueryHookOptions<SkillsQuery, SkillsQueryVariables>) {
        return Apollo.useQuery<SkillsQuery, SkillsQueryVariables>(SkillsDocument, baseOptions);
      }
export function useSkillsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SkillsQuery, SkillsQueryVariables>) {
          return Apollo.useLazyQuery<SkillsQuery, SkillsQueryVariables>(SkillsDocument, baseOptions);
        }
export type SkillsQueryHookResult = ReturnType<typeof useSkillsQuery>;
export type SkillsLazyQueryHookResult = ReturnType<typeof useSkillsLazyQuery>;
export type SkillsQueryResult = Apollo.QueryResult<SkillsQuery, SkillsQueryVariables>;