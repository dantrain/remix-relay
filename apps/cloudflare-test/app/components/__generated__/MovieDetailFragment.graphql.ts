/**
 * @generated SignedSource<<7d2df11c04f0632997099f61393a2e8a>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type MovieDetailFragment$data = {
  readonly audienceScore: number;
  readonly criticScore: number;
  readonly criticsConsensus: string;
  readonly imgUrl: string;
  readonly title: string;
  readonly " $fragmentSpreads": FragmentRefs<"LikeButtonFragment">;
  readonly " $fragmentType": "MovieDetailFragment";
};
export type MovieDetailFragment$key = {
  readonly " $data"?: MovieDetailFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"MovieDetailFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "MovieDetailFragment",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "title",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "criticScore",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "audienceScore",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "criticsConsensus",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "imgUrl",
      "storageKey": null
    },
    {
      "kind": "Defer",
      "selections": [
        {
          "args": null,
          "kind": "FragmentSpread",
          "name": "LikeButtonFragment"
        }
      ]
    }
  ],
  "type": "Movie",
  "abstractKey": null
};

(node as any).hash = "2a2886dedfd178a678dde2900a177a6b";

export default node;
