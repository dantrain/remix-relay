/**
 * @generated SignedSource<<1143f0ccf973a9be6f2e624ef9de7809>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type ItemFragment$data = {
  readonly columnId: string | null | undefined;
  readonly id: string;
  readonly rank: string | null | undefined;
  readonly title: string | null | undefined;
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
      "name": "title",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "rank",
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

(node as any).hash = "a64350d1e4dedf14eba5771a99da74cb";

export default node;
