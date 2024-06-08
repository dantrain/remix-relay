/**
 * @generated SignedSource<<07f2639dc4c408c47900f702403ff431>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type ColumnFragment$data = {
  readonly id: string;
  readonly title: string;
  readonly " $fragmentType": "ColumnFragment";
};
export type ColumnFragment$key = {
  readonly " $data"?: ColumnFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"ColumnFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "ColumnFragment",
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

(node as any).hash = "e1ca11642ab20506331a918e8613d5ab";

export default node;
