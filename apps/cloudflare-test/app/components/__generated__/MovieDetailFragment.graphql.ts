/**
 * @generated SignedSource<<4d7c9fdccea12f251eade530301275c0>>
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
  readonly likedByViewer: boolean | null | undefined;
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
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "likedByViewer",
      "storageKey": null
    }
  ],
  "type": "Movie",
  "abstractKey": null
};

(node as any).hash = "dee0db011f43f33235bf0a4589b7dad4";

export default node;
