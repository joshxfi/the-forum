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
    "\nquery GetMessages($cursorId: ID) {\n  getMessages(cursorId: $cursorId) {\n    cursorId\n    data {\n      id\n      content\n      createdAt\n      isAnonymous\n      user {\n        id\n        username\n      }\n      upvotes {\n        userId\n      }\n      replies {\n        id\n        content\n        createdAt\n        isAnonymous\n        user {\n          id\n          username\n        }\n        upvotes {\n          userId\n        }\n      }\n    }\n  }\n}\n": types.GetMessagesDocument,
    "\nquery GetCurrentUser {\n  getCurrentUser {\n    id\n    username\n    createdAt\n  }\n}\n": types.GetCurrentUserDocument,
    "\nmutation CreateUser($password: String!, $username: String!) {\n  createUser(password: $password, username: $username) {\n    id\n    username\n  }\n}\n": types.CreateUserDocument,
    "\nmutation WriteMessage($isAnonymous: Boolean!, $content: String!) {\n  writeMessage(isAnonymous: $isAnonymous, content: $content) {\n    id\n    content\n    createdAt\n    isAnonymous\n    user {\n      id\n      username\n    }\n    user {\n      id\n      username\n    }\n  }\n}\n": types.WriteMessageDocument,
    "\nmutation WriteReply(\n  $messageId: ID!\n  $isAnonymous: Boolean!\n  $content: String!\n) {\n  writeReply(\n    messageId: $messageId\n    isAnonymous: $isAnonymous\n    content: $content\n  ) {\n    id\n    content\n    createdAt\n    isAnonymous\n    user {\n      id\n      username\n    }\n  }\n}\n\n": types.WriteReplyDocument,
    "\nmutation AddUpvote($type: String!, $messageId: String!) {\n  addUpvote(type: $type, messageId: $messageId) {\n    id\n  }\n}\n": types.AddUpvoteDocument,
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
export function gql(source: "\nquery GetMessages($cursorId: ID) {\n  getMessages(cursorId: $cursorId) {\n    cursorId\n    data {\n      id\n      content\n      createdAt\n      isAnonymous\n      user {\n        id\n        username\n      }\n      upvotes {\n        userId\n      }\n      replies {\n        id\n        content\n        createdAt\n        isAnonymous\n        user {\n          id\n          username\n        }\n        upvotes {\n          userId\n        }\n      }\n    }\n  }\n}\n"): (typeof documents)["\nquery GetMessages($cursorId: ID) {\n  getMessages(cursorId: $cursorId) {\n    cursorId\n    data {\n      id\n      content\n      createdAt\n      isAnonymous\n      user {\n        id\n        username\n      }\n      upvotes {\n        userId\n      }\n      replies {\n        id\n        content\n        createdAt\n        isAnonymous\n        user {\n          id\n          username\n        }\n        upvotes {\n          userId\n        }\n      }\n    }\n  }\n}\n"];
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
export function gql(source: "\nmutation WriteMessage($isAnonymous: Boolean!, $content: String!) {\n  writeMessage(isAnonymous: $isAnonymous, content: $content) {\n    id\n    content\n    createdAt\n    isAnonymous\n    user {\n      id\n      username\n    }\n    user {\n      id\n      username\n    }\n  }\n}\n"): (typeof documents)["\nmutation WriteMessage($isAnonymous: Boolean!, $content: String!) {\n  writeMessage(isAnonymous: $isAnonymous, content: $content) {\n    id\n    content\n    createdAt\n    isAnonymous\n    user {\n      id\n      username\n    }\n    user {\n      id\n      username\n    }\n  }\n}\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\nmutation WriteReply(\n  $messageId: ID!\n  $isAnonymous: Boolean!\n  $content: String!\n) {\n  writeReply(\n    messageId: $messageId\n    isAnonymous: $isAnonymous\n    content: $content\n  ) {\n    id\n    content\n    createdAt\n    isAnonymous\n    user {\n      id\n      username\n    }\n  }\n}\n\n"): (typeof documents)["\nmutation WriteReply(\n  $messageId: ID!\n  $isAnonymous: Boolean!\n  $content: String!\n) {\n  writeReply(\n    messageId: $messageId\n    isAnonymous: $isAnonymous\n    content: $content\n  ) {\n    id\n    content\n    createdAt\n    isAnonymous\n    user {\n      id\n      username\n    }\n  }\n}\n\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\nmutation AddUpvote($type: String!, $messageId: String!) {\n  addUpvote(type: $type, messageId: $messageId) {\n    id\n  }\n}\n"): (typeof documents)["\nmutation AddUpvote($type: String!, $messageId: String!) {\n  addUpvote(type: $type, messageId: $messageId) {\n    id\n  }\n}\n"];

export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;