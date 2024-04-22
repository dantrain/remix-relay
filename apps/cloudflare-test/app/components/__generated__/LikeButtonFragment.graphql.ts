/**
 * @generated SignedSource<<47a2d2db0302fa247d0d2dc310cc79e1>>
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
  readonly likedByViewer: boolean | null | undefined;
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
      "name": "likedByViewer",
      "storageKey": null
    }
  ],
  "type": "Movie",
  "abstractKey": null
};

(node as any).hash = "652827e3f5cb1e2a87b706951571267d";

export default node;
