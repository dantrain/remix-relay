import { useLoaderQuery } from "@remix-relay/react";
import { Button } from "@remix-relay/ui";
import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { useMemo } from "react";
import { graphql, useMutation, useSubscription } from "react-relay";
import { v4 as uuidv4 } from "uuid";
import Counter from "~/components/Counter";
import useWindowVisible from "~/hooks/useWindowVisible";
import { clientLoaderQuery } from "~/lib/client-loader-query";
import { loaderQuery } from "~/lib/loader-query.server";
import { IndexCreateOneCounterMutation } from "./__generated__/IndexCreateOneCounterMutation.graphql";
import indexQueryNode, { IndexQuery } from "./__generated__/IndexQuery.graphql";

const query = graphql`
  query IndexQuery {
    counterConnection {
      __id
      edges {
        node {
          id
          ...CounterFragment
        }
      }
    }
  }
`;

const counterCreatedSubscription = graphql`
  subscription IndexCounterCreatedSubscription($connections: [ID!]!) {
    counterCreated
      @appendNode(
        connections: $connections
        edgeTypeName: "CounterConnectionEdge"
      ) {
      id
      ...CounterFragment
    }
  }
`;

const counterDeletedSubscription = graphql`
  subscription IndexCounterDeletedSubscription($connections: [ID!]!) {
    counterDeleted {
      id @deleteEdge(connections: $connections)
    }
  }
`;

const mutation = graphql`
  mutation IndexCreateOneCounterMutation($id: ID!, $connections: [ID!]!) {
    createOneCounter(id: $id)
      @appendNode(
        connections: $connections
        edgeTypeName: "CounterConnectionEdge"
      ) {
      id
      ...CounterFragment
    }
  }
`;

export const meta: MetaFunction = () => [{ title: "Counter App" }];

export const loader = ({ context }: LoaderFunctionArgs) =>
  loaderQuery<IndexQuery>(context, indexQueryNode, {});

export const clientLoader = () => clientLoaderQuery<IndexQuery>(query, {});

export default function Index() {
  const [{ counterConnection }, reload] = useLoaderQuery<IndexQuery>(query);

  useWindowVisible(() => reload({}));

  useSubscription(
    useMemo(
      () => ({
        subscription: counterCreatedSubscription,
        variables: { connections: [counterConnection.__id] },
      }),
      [counterConnection.__id],
    ),
  );

  useSubscription(
    useMemo(
      () => ({
        subscription: counterDeletedSubscription,
        variables: { connections: [counterConnection.__id] },
      }),
      [counterConnection.__id],
    ),
  );

  const [commitCreateOneCounter] =
    useMutation<IndexCreateOneCounterMutation>(mutation);

  return (
    <main>
      <h1 className="mb-8 mt-2 text-2xl font-bold">Counter App</h1>
      <div className="inline-flex flex-col gap-5">
        <ul className="inline-flex flex-col gap-5">
          {counterConnection.edges.map(({ node }) => (
            <li key={node.id}>
              <Counter connectionId={counterConnection.__id} dataRef={node} />
            </li>
          ))}
        </ul>
        <Button
          className="pb-2 text-center text-3xl"
          onClick={() => {
            const id = uuidv4();

            commitCreateOneCounter({
              variables: { id, connections: [counterConnection.__id] },
              // optimisticResponse: {
              //   createOneCounter: {
              //     id: encodeGlobalID("Counter", id),
              //     count: 0,
              //   },
              // },
            });
          }}
        >
          +
        </Button>
      </div>
    </main>
  );
}
