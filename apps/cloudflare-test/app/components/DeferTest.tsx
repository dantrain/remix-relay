import { graphql, useFragment } from "react-relay";
import { DeferTestFragment$key } from "./__generated__/DeferTestFragment.graphql";

const fragment = graphql`
  fragment DeferTestFragment on Query {
    movies {
      edges {
        node {
          id
          title
        }
      }
    }
  }
`;

type DeferTestProps = {
  dataRef: DeferTestFragment$key;
};

export function DeferTest({ dataRef }: DeferTestProps) {
  const data = useFragment(fragment, dataRef);

  return (
    <pre>
      {JSON.stringify(
        data.movies.edges.map(({ node }) => node.title),
        null,
        4,
      )}
    </pre>
  );
}
