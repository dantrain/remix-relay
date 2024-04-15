/**
 * @generated SignedSource<<bc9ade527a781a8689a4f6078fdd7844>>
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
    }
  ],
  "type": "Movie",
  "abstractKey": null
};

(node as any).hash = "bec1a0a04f88dde70ad167a874a8205c";

export default node;
