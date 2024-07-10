/**
 * @generated SignedSource<<bd6a7ee47c66490c3c3aff3f384ea973>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type ColumnFragment$data = {
  readonly id: string;
  readonly itemConnection: {
    readonly __id: string;
    readonly edges: ReadonlyArray<{
      readonly node: {
        readonly id: string;
        readonly rank: string | null | undefined;
      } | null | undefined;
    }>;
  } | null | undefined;
  readonly title: string | null | undefined;
  readonly " $fragmentSpreads": FragmentRefs<"ColumnTitleFragment">;
  readonly " $fragmentType": "ColumnFragment";
};
export type ColumnFragment$key = {
  readonly " $data"?: ColumnFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"ColumnFragment">;
};

const node: ReaderFragment = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
};
return {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "ColumnFragment",
  "selections": [
    (v0/*: any*/),
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "title",
      "storageKey": null
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "ColumnTitleFragment"
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "ColumnItemConnection",
      "kind": "LinkedField",
      "name": "itemConnection",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "concreteType": "ColumnItemConnectionEdge",
          "kind": "LinkedField",
          "name": "edges",
          "plural": true,
          "selections": [
            {
              "alias": null,
              "args": null,
              "concreteType": "Item",
              "kind": "LinkedField",
              "name": "node",
              "plural": false,
              "selections": [
                (v0/*: any*/),
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "rank",
                  "storageKey": null
                }
              ],
              "storageKey": null
            }
          ],
          "storageKey": null
        },
        {
          "kind": "ClientExtension",
          "selections": [
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "__id",
              "storageKey": null
            }
          ]
        }
      ],
      "storageKey": null
    }
  ],
  "type": "Column",
  "abstractKey": null
};
})();

(node as any).hash = "231b5b1cae63086376af96e90e677bc8";

export default node;
