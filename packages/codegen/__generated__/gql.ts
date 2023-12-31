/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
    "\nquery GetPosts($cursorId: ID) {\n  getPosts(cursorId: $cursorId) {\n    cursorId\n    data {\n      id\n      content\n      createdAt\n      isAnonymous\n      author {\n        id\n        username\n      }\n      upvotes {\n        id\n        userId\n      }\n      comments {\n        id\n        content\n        createdAt\n        isAnonymous\n        author {\n          id\n          username\n        }\n        upvotes {\n          id\n          userId\n        }\n      }\n    }\n  }\n}\n": types.GetPostsDocument,
    "\nquery GetCurrentUser {\n  getCurrentUser {\n    id\n    username\n    createdAt\n  }\n}\n": types.GetCurrentUserDocument,
    "\nmutation CreateUser($password: String!, $username: String!) {\n  createUser(password: $password, username: $username) {\n    id\n    username\n  }\n}\n": types.CreateUserDocument,
    "\nmutation AddPost($isAnonymous: Boolean!, $content: String!) {\n  addPost(isAnonymous: $isAnonymous, content: $content) {\n    id\n    content\n    createdAt\n    isAnonymous\n    author {\n      id\n      username\n    }\n  }\n}\n": types.AddPostDocument,
    "\nmutation AddComment($postId: ID!, $isAnonymous: Boolean!, $content: String!) {\n  addComment(postId: $postId, isAnonymous: $isAnonymous, content: $content) {\n    id\n    content\n    createdAt\n    isAnonymous\n    author {\n      id\n      username\n    }\n  }\n}\n": types.AddCommentDocument,
    "\nmutation AddUpvote($postId: ID!) {\n  addUpvote(postId: $postId) {\n    id\n  }\n}\n": types.AddUpvoteDocument,
    "\nmutation RemoveUpvote($upvoteId: ID!) {\n  removeUpvote(id: $upvoteId) \n}\n": types.RemoveUpvoteDocument,
};

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = gql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function gql(source: string): unknown;

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\nquery GetPosts($cursorId: ID) {\n  getPosts(cursorId: $cursorId) {\n    cursorId\n    data {\n      id\n      content\n      createdAt\n      isAnonymous\n      author {\n        id\n        username\n      }\n      upvotes {\n        id\n        userId\n      }\n      comments {\n        id\n        content\n        createdAt\n        isAnonymous\n        author {\n          id\n          username\n        }\n        upvotes {\n          id\n          userId\n        }\n      }\n    }\n  }\n}\n"): (typeof documents)["\nquery GetPosts($cursorId: ID) {\n  getPosts(cursorId: $cursorId) {\n    cursorId\n    data {\n      id\n      content\n      createdAt\n      isAnonymous\n      author {\n        id\n        username\n      }\n      upvotes {\n        id\n        userId\n      }\n      comments {\n        id\n        content\n        createdAt\n        isAnonymous\n        author {\n          id\n          username\n        }\n        upvotes {\n          id\n          userId\n        }\n      }\n    }\n  }\n}\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\nquery GetCurrentUser {\n  getCurrentUser {\n    id\n    username\n    createdAt\n  }\n}\n"): (typeof documents)["\nquery GetCurrentUser {\n  getCurrentUser {\n    id\n    username\n    createdAt\n  }\n}\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\nmutation CreateUser($password: String!, $username: String!) {\n  createUser(password: $password, username: $username) {\n    id\n    username\n  }\n}\n"): (typeof documents)["\nmutation CreateUser($password: String!, $username: String!) {\n  createUser(password: $password, username: $username) {\n    id\n    username\n  }\n}\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\nmutation AddPost($isAnonymous: Boolean!, $content: String!) {\n  addPost(isAnonymous: $isAnonymous, content: $content) {\n    id\n    content\n    createdAt\n    isAnonymous\n    author {\n      id\n      username\n    }\n  }\n}\n"): (typeof documents)["\nmutation AddPost($isAnonymous: Boolean!, $content: String!) {\n  addPost(isAnonymous: $isAnonymous, content: $content) {\n    id\n    content\n    createdAt\n    isAnonymous\n    author {\n      id\n      username\n    }\n  }\n}\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\nmutation AddComment($postId: ID!, $isAnonymous: Boolean!, $content: String!) {\n  addComment(postId: $postId, isAnonymous: $isAnonymous, content: $content) {\n    id\n    content\n    createdAt\n    isAnonymous\n    author {\n      id\n      username\n    }\n  }\n}\n"): (typeof documents)["\nmutation AddComment($postId: ID!, $isAnonymous: Boolean!, $content: String!) {\n  addComment(postId: $postId, isAnonymous: $isAnonymous, content: $content) {\n    id\n    content\n    createdAt\n    isAnonymous\n    author {\n      id\n      username\n    }\n  }\n}\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\nmutation AddUpvote($postId: ID!) {\n  addUpvote(postId: $postId) {\n    id\n  }\n}\n"): (typeof documents)["\nmutation AddUpvote($postId: ID!) {\n  addUpvote(postId: $postId) {\n    id\n  }\n}\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\nmutation RemoveUpvote($upvoteId: ID!) {\n  removeUpvote(id: $upvoteId) \n}\n"): (typeof documents)["\nmutation RemoveUpvote($upvoteId: ID!) {\n  removeUpvote(id: $upvoteId) \n}\n"];

export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;