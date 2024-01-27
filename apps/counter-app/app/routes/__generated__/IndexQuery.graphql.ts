/**
 * @generated SignedSource<<b8a02ea6f305d389a904cdda317de8aa>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type IndexQuery$variables = Record<PropertyKey, never>;
export type IndexQuery$data = {
  readonly " $fragmentSpreads": FragmentRefs<"CounterListFragment">;
};
export type IndexQuery = {
  response: IndexQuery$data;
  variables: IndexQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "IndexQuery",
    "selections": [
      {
        "kind": "Defer",
        "selections": [
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "CounterListFragment"
          }
        ]
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "IndexQuery",
    "selections": [
      {
        "if": null,
        "kind": "Defer",
        "label": "IndexQuery$defer$CounterListFragment",
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
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "count",
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
            "storageKey": null
          }
        ]
      }
    ]
  },
  "params": {
    "cacheID": "c57339fb429be4d3b49915a65b7615f0",
    "id": null,
    "metadata": {},
    "name": "IndexQuery",
    "operationKind": "query",
    "text": "query IndexQuery {\n  ...CounterListFragment @defer(label: \"IndexQuery$defer$CounterListFragment\")\n}\n\nfragment CounterFragment on Counter {\n  id\n  count\n}\n\nfragment CounterListFragment on Query {\n  viewer {\n    id\n    counterConnection {\n      edges {\n        node {\n          id\n          ...CounterFragment\n        }\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "887dbd52a6358ee41fbf45aa73b70ffb";

export default node;
