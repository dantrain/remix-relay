/**
 * @generated SignedSource<<e2c9bd19a7e14a6fefb4ed95848568eb>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type DeferTestFragment$data = {
  readonly movies: {
    readonly edges: ReadonlyArray<{
      readonly node: {
        readonly id: string;
        readonly title: string;
      };
    }>;
  };
  readonly " $fragmentType": "DeferTestFragment";
};
export type DeferTestFragment$key = {
  readonly " $data"?: DeferTestFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"DeferTestFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "DeferTestFragment",
  "selections": [
    {
      "alias": null,
      "args": null,
      "concreteType": "QueryMoviesConnection",
      "kind": "LinkedField",
      "name": "movies",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "concreteType": "QueryMoviesConnectionEdge",
          "kind": "LinkedField",
          "name": "edges",
          "plural": true,
          "selections": [
            {
              "alias": null,
              "args": null,
              "concreteType": "Movie",
              "kind": "LinkedField",
              "name": "node",
              "plural": false,
              "selections": [
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "id",
                  "storageKey": null
                },
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "title",
                  "storageKey": null
                }
              ],
              "storageKey": null
            }
          ],
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "type": "Query",
  "abstractKey": null
};

(node as any).hash = "37c4d93491f0e93a30182bbc6c69625d";

export default node;
