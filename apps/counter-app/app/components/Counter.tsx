import { Button } from "@remix-relay/ui";
import { useMemo } from "react";
import {
  graphql,
  useFragment,
  useMutation,
  useSubscription,
} from "react-relay";
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

const mutation = graphql`
  mutation CounterSetCountMutation($id: ID!, $count: Int!) {
    setCount(id: $id, count: $count) {
      ...CounterFragment
    }
  }
`;

type CounterProps = {
  dataRef: CounterFragment$key;
};

export default function Counter({ dataRef }: CounterProps) {
  const { id, count } = useFragment(fragment, dataRef);

  useSubscription(
    useMemo(
      () => ({
        subscription,
        variables: { id },
      }),
      [id],
    ),
  );

  const [commit] = useMutation<CounterSetCountMutation>(mutation);

  return (
    <div className="flex items-center gap-4">
      <Button
        className="px-4 pb-2 text-3xl"
        disabled={!count}
        onClick={() =>
          commit({
            variables: { id, count: Math.max(0, count - 1) },
            optimisticResponse: {
              setCount: { id, count: Math.max(0, count - 1) },
            },
          })
        }
      >
        -
      </Button>
      <pre className="min-w-[2ch] text-center text-5xl">{count}</pre>
      <Button
        className="px-4 pb-2 text-3xl"
        onClick={() =>
          commit({
            variables: { id, count: count + 1 },
            optimisticResponse: {
              setCount: { id, count: count + 1 },
            },
          })
        }
      >
        +
      </Button>
    </div>
  );
}
