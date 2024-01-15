/**
 * @generated SignedSource<<8d3960d707e7169bd40a7c8e1c8e8fe2>>
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

const node: ConcreteRequest = {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "IndexQuery",
    "selections": [
      {
        "args": null,
        "kind": "FragmentSpread",
        "name": "CounterListFragment"
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
        "concreteType": "QueryCounterConnection",
        "kind": "LinkedField",
        "name": "counterConnection",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "QueryCounterConnectionEdge",
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
  "params": {
    "cacheID": "cbf8bd68a6ac88fd66fe1079b53db208",
    "id": null,
    "metadata": {},
    "name": "IndexQuery",
    "operationKind": "query",
    "text": "query IndexQuery {\n  ...CounterListFragment\n}\n\nfragment CounterFragment on Counter {\n  id\n  count\n}\n\nfragment CounterListFragment on Query {\n  counterConnection {\n    edges {\n      node {\n        id\n        ...CounterFragment\n      }\n    }\n  }\n}\n"
  }
};

(node as any).hash = "831811ae6d0bf3e6782bb095599b6fae";

export default node;
