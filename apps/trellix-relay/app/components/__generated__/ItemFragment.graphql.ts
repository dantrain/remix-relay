/**
 * @generated SignedSource<<e1c8c7a6191315c664f324d2f488dad2>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type ItemFragment$data = {
  readonly columnId: string;
  readonly id: string;
  readonly text: string;
  readonly " $fragmentType": "ItemFragment";
};
export type ItemFragment$key = {
  readonly " $data"?: ItemFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"ItemFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "ItemFragment",
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
      "name": "text",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "columnId",
      "storageKey": null
    }
  ],
  "type": "Item",
  "abstractKey": null
};

(node as any).hash = "e35f5ce6f9863b8e5df362cdd0d8884b";

export default node;
