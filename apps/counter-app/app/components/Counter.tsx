import { graphql, useFragment, useMutation } from "react-relay";
import { Button } from "@remix-relay/ui";
import { useSubscribe } from "~/hooks/useSubscribe";
import { CounterDeleteOneCounterMutation } from "./__generated__/CounterDeleteOneCounterMutation.graphql";
import { CounterFragment$key } from "./__generated__/CounterFragment.graphql";
import { CounterSetCountMutation } from "./__generated__/CounterSetCountMutation.graphql";

const fragment = graphql`
  fragment CounterFragment on Counter {
    id
    count
  }
`;

const subscription = graphql`
  subscription CounterSubscription($id: ID!) {
    counter(id: $id) {
      ...CounterFragment
    }
  }
`;

const setCountMutation = graphql`
  mutation CounterSetCountMutation($id: ID!, $count: Int!) {
    setCount(id: $id, count: $count) {
      ...CounterFragment
    }
  }
`;

const deleteOneCounterMutation = graphql`
  mutation CounterDeleteOneCounterMutation($id: ID!, $connections: [ID!]!) {
    deleteOneCounter(id: $id) {
      id @deleteEdge(connections: $connections)
    }
  }
`;

type CounterProps = {
  dataRef: CounterFragment$key;
  connectionId: string;
};

export default function Counter({ dataRef, connectionId }: CounterProps) {
  const { id, count } = useFragment(fragment, dataRef);

  useSubscribe({ subscription, variables: { id } });

  const [commitSetCount] =
    useMutation<CounterSetCountMutation>(setCountMutation);

  const [commitDeleteOneCounter] = useMutation<CounterDeleteOneCounterMutation>(
    deleteOneCounterMutation,
  );

  const incrementCounter = () =>
    commitSetCount({
      variables: { id, count: Math.max(0, count - 1) },
      optimisticResponse: {
        setCount: { id, count: Math.max(0, count - 1) },
      },
    });

  const decrementCounter = () =>
    commitSetCount({
      variables: { id, count: count + 1 },
      optimisticResponse: {
        setCount: { id, count: count + 1 },
      },
    });

  const deleteCounter = () =>
    commitDeleteOneCounter({
      variables: { id, connections: [connectionId] },
      optimisticResponse: { deleteOneCounter: { id } },
    });

  return (
    <div className="flex items-center gap-4">
      <Button
        className="px-4 pb-2 text-3xl"
        disabled={!count}
        onPress={incrementCounter}
      >
        -
      </Button>
      <pre className="min-w-[2ch] text-center text-5xl">{count}</pre>
      <Button className="px-4 pb-2 text-3xl" onPress={decrementCounter}>
        +
      </Button>
      <Button className="px-4 pb-2 text-3xl" onPress={deleteCounter}>
        &times;
      </Button>
    </div>
  );
}
