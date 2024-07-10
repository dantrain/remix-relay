/**
 * @generated SignedSource<<bc39b144ff1ae6305bfc019cd5aa93ee>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type BoardCardFragment$data = {
  readonly id: string;
  readonly title: string | null | undefined;
  readonly " $fragmentType": "BoardCardFragment";
};
export type BoardCardFragment$key = {
  readonly " $data"?: BoardCardFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"BoardCardFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "BoardCardFragment",
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
  "type": "Board",
  "abstractKey": null
};

(node as any).hash = "4fd8daf249fc36a76b4023ec233e7373";

export default node;
