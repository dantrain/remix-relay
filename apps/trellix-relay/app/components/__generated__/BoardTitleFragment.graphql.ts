/**
 * @generated SignedSource<<0802e49d57258cb078fa240ccd9cc05d>>
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
  readonly name: string;
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
      "name": "name",
      "storageKey": null
    }
  ],
  "type": "Board",
  "abstractKey": null
};

(node as any).hash = "b03a4e0c68b926d72fe843602a9138dd";

export default node;
