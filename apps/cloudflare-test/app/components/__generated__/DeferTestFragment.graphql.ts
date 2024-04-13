/**
 * @generated SignedSource<<49d088d0fbc06c382ae4647450953879>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type DeferTestFragment$data = {
  readonly slow: string;
  readonly " $fragmentType": "DeferTestFragment";
};
export type DeferTestFragment$key = {
  readonly " $data"?: DeferTestFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"DeferTestFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "DeferTestFragment",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "slow",
      "storageKey": null
    }
  ],
  "type": "Query",
  "abstractKey": null
};

(node as any).hash = "0e61dc4663b4c02b83b1913b9a3d46ef";

export default node;
