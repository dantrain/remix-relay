import { createId } from "@paralleldrive/cuid2";
import { fromGlobalId, toGlobalId } from "graphql-relay";
import { graphql, useFragment, useMutation } from "react-relay";
import { Button } from "@remix-relay/ui";
import { useSubscribe } from "~/hooks/useSubscribe";
import Counter from "./Counter";
import { CounterListCreateOneCounterMutation } from "./__generated__/CounterListCreateOneCounterMutation.graphql";
import { CounterListFragment$key } from "./__generated__/CounterListFragment.graphql";

const fragment = graphql`
  fragment CounterListFragment on User {
    id
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
  subscription CounterListCounterCreatedSubscription($connections: [ID!]!) {
    counterCreated
      @appendNode(
        connections: $connections
        edgeTypeName: "UserCounterConnectionEdge"
      ) {
      id
      ...CounterFragment
    }
  }
`;

const counterDeletedSubscription = graphql`
  subscription CounterListCounterDeletedSubscription($connections: [ID!]!) {
    counterDeleted {
      id @deleteEdge(connections: $connections)
    }
  }
`;

const mutation = graphql`
  mutation CounterListCreateOneCounterMutation($id: ID!, $connections: [ID!]!) {
    createOneCounter(id: $id)
      @appendNode(
        connections: $connections
        edgeTypeName: "UserCounterConnectionEdge"
      ) {
      id
      ...CounterFragment
    }
  }
`;

type CounterListProps = {
  dataRef: CounterListFragment$key;
};

export default function CounterList({ dataRef }: CounterListProps) {
  const { counterConnection, id: userId } = useFragment(fragment, dataRef);

  useSubscribe({
    subscription: counterCreatedSubscription,
    variables: { connections: [counterConnection.__id] },
  });

  useSubscribe({
    subscription: counterDeletedSubscription,
    variables: { connections: [counterConnection.__id] },
  });

  const [commitCreateOneCounter] =
    useMutation<CounterListCreateOneCounterMutation>(mutation);

  const createCounter = () => {
    const id = `${fromGlobalId(userId).id}:${createId()}`;

    commitCreateOneCounter({
      variables: { id, connections: [counterConnection.__id] },
      optimisticResponse: {
        createOneCounter: {
          id: toGlobalId("Counter", id),
          count: 0,
        },
      },
    });
  };

  return (
    <div className="inline-flex flex-col gap-5">
      <ul className="inline-flex flex-col gap-5">
        {counterConnection.edges.map(({ node }) => (
          <li key={node.id}>
            <Counter connectionId={counterConnection.__id} dataRef={node} />
          </li>
        ))}
      </ul>
      <Button className="pb-2 text-center text-3xl" onPress={createCounter}>
        +
      </Button>
    </div>
  );
}
