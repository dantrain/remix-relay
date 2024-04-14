/**
 * @generated SignedSource<<0c0e87fabc7c042785bb69b6bbd4ff6a>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type DeferTestFragment$data = {
  readonly test: {
    readonly title: string;
  } | null | undefined;
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
      "concreteType": "Test",
      "kind": "LinkedField",
      "name": "test",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "title",
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "type": "Query",
  "abstractKey": null
};

(node as any).hash = "fb33295f396b55614e4ad12c5b1be41b";

export default node;
