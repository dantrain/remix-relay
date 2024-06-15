/**
 * @generated SignedSource<<cfe446ef01806d8bef8eb25bc39c043e>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type ColumnTitleFragment$data = {
  readonly id: string;
  readonly title: string;
  readonly " $fragmentType": "ColumnTitleFragment";
};
export type ColumnTitleFragment$key = {
  readonly " $data"?: ColumnTitleFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"ColumnTitleFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "ColumnTitleFragment",
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
  "type": "Column",
  "abstractKey": null
};

(node as any).hash = "fc2bb735fd1db5b54cff3e412199fc32";

export default node;
