/**
 * @generated SignedSource<<d75f64b2c2b8430a6e378eceb22e1246>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type IndexQuery$variables = Record<PropertyKey, never>;
export type IndexQuery$data = {
  readonly viewer: {
    readonly " $fragmentSpreads": FragmentRefs<"CounterListFragment">;
  };
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
        "alias": null,
        "args": null,
        "concreteType": "User",
        "kind": "LinkedField",
        "name": "viewer",
        "plural": false,
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
        "storageKey": null
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
        "alias": null,
        "args": null,
        "concreteType": "User",
        "kind": "LinkedField",
        "name": "viewer",
        "plural": false,
        "selections": [
          {
            "if": null,
            "kind": "Defer",
            "label": "IndexQuery$defer$CounterListFragment",
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
            ]
          },
          (v0/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "837bcd24e3d4f0c85b864c25cf223129",
    "id": null,
    "metadata": {},
    "name": "IndexQuery",
    "operationKind": "query",
    "text": "query IndexQuery {\n  viewer {\n    ...CounterListFragment @defer(label: \"IndexQuery$defer$CounterListFragment\")\n    id\n  }\n}\n\nfragment CounterFragment on Counter {\n  id\n  count\n}\n\nfragment CounterListFragment on User {\n  id\n  counterConnection {\n    edges {\n      node {\n        id\n        ...CounterFragment\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "a839ddf860def501ba0d4604859da263";

export default node;
