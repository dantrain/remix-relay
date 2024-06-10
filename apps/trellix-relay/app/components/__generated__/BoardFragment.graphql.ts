/**
 * @generated SignedSource<<16458dc36c1fe60616419252f75d26c8>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type BoardFragment$data = {
  readonly columnConnection: {
    readonly __id: string;
    readonly edges: ReadonlyArray<{
      readonly node: {
        readonly id: string;
        readonly itemConnection: {
          readonly __id: string;
          readonly edges: ReadonlyArray<{
            readonly node: {
              readonly id: string;
              readonly rank: string;
              readonly " $fragmentSpreads": FragmentRefs<"ItemFragment">;
            };
          }>;
        };
        readonly rank: string;
        readonly title: string;
        readonly " $fragmentSpreads": FragmentRefs<"ColumnFragment">;
      };
    }>;
  };
  readonly id: string;
  readonly " $fragmentType": "BoardFragment";
};
export type BoardFragment$key = {
  readonly " $data"?: BoardFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"BoardFragment">;
};

const node: ReaderFragment = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "rank",
  "storageKey": null
},
v2 = {
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
};
return {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "BoardFragment",
  "selections": [
    (v0/*: any*/),
    {
      "alias": null,
      "args": null,
      "concreteType": "BoardColumnConnection",
      "kind": "LinkedField",
      "name": "columnConnection",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "concreteType": "BoardColumnConnectionEdge",
          "kind": "LinkedField",
          "name": "edges",
          "plural": true,
          "selections": [
            {
              "alias": null,
              "args": null,
              "concreteType": "Column",
              "kind": "LinkedField",
              "name": "node",
              "plural": false,
              "selections": [
                (v0/*: any*/),
                (v1/*: any*/),
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
                  "name": "ColumnFragment"
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
                            (v1/*: any*/),
                            {
                              "args": null,
                              "kind": "FragmentSpread",
                              "name": "ItemFragment"
                            }
                          ],
                          "storageKey": null
                        }
                      ],
                      "storageKey": null
                    },
                    (v2/*: any*/)
                  ],
                  "storageKey": null
                }
              ],
              "storageKey": null
            }
          ],
          "storageKey": null
        },
        (v2/*: any*/)
      ],
      "storageKey": null
    }
  ],
  "type": "Board",
  "abstractKey": null
};
})();

(node as any).hash = "b99d1938969a472fd4d7c637f4cd78cc";

export default node;
