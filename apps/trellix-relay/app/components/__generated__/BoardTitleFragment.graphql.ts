/**
 * @generated SignedSource<<266eee388903090b51274ac44d970a70>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
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
