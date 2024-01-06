/**
 * @generated SignedSource<<30de9f6ae7c8761e922baebacebd05bb>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type LikeButtonFragment$data = {
  readonly id: string;
  readonly liked: boolean;
  readonly " $fragmentType": "LikeButtonFragment";
};
export type LikeButtonFragment$key = {
  readonly " $data"?: LikeButtonFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"LikeButtonFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "LikeButtonFragment",
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
      "name": "liked",
      "storageKey": null
    }
  ],
  "type": "Movie",
  "abstractKey": null
};

(node as any).hash = "1623b2c79375c5e36b5d55e0b4c983e9";

export default node;
