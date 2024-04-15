/**
 * @generated SignedSource<<7fe00ac27c58ce9da39fcc8b3759ec05>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type MovieLinkFragment$data = {
  readonly boxOffice: string;
  readonly criticScore: number;
  readonly slug: string;
  readonly title: string;
  readonly " $fragmentType": "MovieLinkFragment";
};
export type MovieLinkFragment$key = {
  readonly " $data"?: MovieLinkFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"MovieLinkFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "MovieLinkFragment",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "slug",
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
      "name": "criticScore",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "boxOffice",
      "storageKey": null
    }
  ],
  "type": "Movie",
  "abstractKey": null
};

(node as any).hash = "73aa285b1a284b1faf69131d40fed103";

export default node;
