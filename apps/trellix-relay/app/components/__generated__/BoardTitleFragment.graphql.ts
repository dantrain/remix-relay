/**
 * @generated SignedSource<<f19abbd37ef189035d8b760d5f377743>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type BoardTitleFragment$data = {
  readonly id: string;
  readonly title: string;
  readonly " $fragmentType": "BoardTitleFragment";
};
export type BoardTitleFragment$key = {
  readonly " $data"?: BoardTitleFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"BoardTitleFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "BoardTitleFragment",
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
  "type": "Board",
  "abstractKey": null
};

(node as any).hash = "ae169cdef3293c60d26bfc3024fecfe0";

export default node;
