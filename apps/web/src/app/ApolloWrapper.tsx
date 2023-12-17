"use client";

import { ApolloLink, HttpLink } from "@apollo/client";
import {
  ApolloNextAppProvider,
  NextSSRInMemoryCache,
  NextSSRApolloClient,
  SSRMultipartLink,
} from "@apollo/experimental-nextjs-app-support/ssr";
import { MessagesData } from "@tf/codegen/__generated__/graphql";

export function makeClient() {
  const httpLink = new HttpLink({
    uri: process.env.NEXT_PUBLIC_GRAPHQL_URL,
    fetchOptions: { cache: "no-store" },
  });

  return new NextSSRApolloClient({
    cache: new NextSSRInMemoryCache({
      typePolicies: {
        Query: {
          fields: {
            getMessages: {
              keyArgs: false,

              merge(
                existing: MessagesData,
                incoming: MessagesData,
                { readField }
              ) {
                const messages = existing ? { ...existing.data } : {};

                incoming.data.forEach((msg) => {
                  // @ts-ignore
                  messages[readField("id", msg)] = msg;
                });

                return {
                  cursorId: incoming.cursorId,
                  data: messages,
                };
              },

              read(existing) {
                if (existing) {
                  return {
                    cursorId: existing.cursorId,
                    data: Object.values(existing.data),
                  };
                }
              },
            },
          },
        },
      },
    }),
    link:
      typeof window === "undefined"
        ? ApolloLink.from([
            new SSRMultipartLink({
              stripDefer: true,
            }),
            httpLink,
          ])
        : httpLink,
  });
}

export function ApolloWrapper({ children }: React.PropsWithChildren) {
  return (
    <ApolloNextAppProvider makeClient={makeClient}>
      {children}
    </ApolloNextAppProvider>
  );
}
