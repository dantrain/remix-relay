import { graphql, useFragment } from "react-relay";
import { DeferTestFragment$key } from "./__generated__/DeferTestFragment.graphql";

const fragment = graphql`
  fragment DeferTestFragment on Query {
    test {
      title
    }
  }
`;

type DeferTestProps = {
  dataRef: DeferTestFragment$key;
};

export function DeferTest({ dataRef }: DeferTestProps) {
  const data = useFragment(fragment, dataRef);

  return <pre>{JSON.stringify(data.test?.title, null, 4)}</pre>;
}
