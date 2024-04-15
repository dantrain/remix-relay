/**
 * @generated SignedSource<<e8f6f0e971df467aaf2b5a83f4db9357>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type MovieReviewFragment$data = {
  readonly criticName: string;
  readonly criticSource: string;
  readonly fresh: boolean;
  readonly quote: string;
  readonly " $fragmentType": "MovieReviewFragment";
};
export type MovieReviewFragment$key = {
  readonly " $data"?: MovieReviewFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"MovieReviewFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "MovieReviewFragment",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "quote",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "fresh",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "criticName",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "criticSource",
      "storageKey": null
    }
  ],
  "type": "Review",
  "abstractKey": null
};

(node as any).hash = "55bdc6c4b476ec13054353237d1c8167";

export default node;
