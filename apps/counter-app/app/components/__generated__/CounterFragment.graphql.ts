/**
 * @generated SignedSource<<494cc51b0b97c589f40d9ba8788c0f1c>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
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
