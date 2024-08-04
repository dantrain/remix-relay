/**
 * @generated SignedSource<<32d44464288dabeb6d323535a7a1fcd9>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type CounterFragment$data = {
  readonly count: number;
  readonly id: string;
  readonly " $fragmentType": "CounterFragment";
};
export type CounterFragment$key = {
  readonly " $data"?: CounterFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"CounterFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "CounterFragment",
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
      "name": "count",
      "storageKey": null
    }
  ],
  "type": "Counter",
  "abstractKey": null
};

(node as any).hash = "a4766aacc98940eefa8d66ce5a340ba0";

export default node;
