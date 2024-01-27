/**
 * @generated SignedSource<<a85acb00073e7b45985ee899cb9d9c9e>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type CounterListFragment$data = {
  readonly viewer: {
    readonly counterConnection: {
      readonly __id: string;
      readonly edges: ReadonlyArray<{
        readonly node: {
          readonly id: string;
          readonly " $fragmentSpreads": FragmentRefs<"CounterFragment">;
        };
      }>;
    };
    readonly id: string;
  };
  readonly " $fragmentType": "CounterListFragment";
};
export type CounterListFragment$key = {
  readonly " $data"?: CounterListFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"CounterListFragment">;
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
  "name": "CounterListFragment",
  "selections": [
    {
      "alias": null,
      "args": null,
      "concreteType": "User",
      "kind": "LinkedField",
      "name": "viewer",
      "plural": false,
      "selections": [
        (v0/*: any*/),
        {
          "alias": null,
          "args": null,
          "concreteType": "UserCounterConnection",
          "kind": "LinkedField",
          "name": "counterConnection",
          "plural": false,
          "selections": [
            {
              "alias": null,
              "args": null,
              "concreteType": "UserCounterConnectionEdge",
              "kind": "LinkedField",
              "name": "edges",
              "plural": true,
              "selections": [
                {
                  "alias": null,
                  "args": null,
                  "concreteType": "Counter",
                  "kind": "LinkedField",
                  "name": "node",
                  "plural": false,
                  "selections": [
                    (v0/*: any*/),
                    {
                      "args": null,
                      "kind": "FragmentSpread",
                      "name": "CounterFragment"
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
      "storageKey": null
    }
  ],
  "type": "Query",
  "abstractKey": null
};
})();

(node as any).hash = "c6eb279736a93aa98758e9da540d815c";

export default node;
