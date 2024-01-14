/**
 * @generated SignedSource<<196f309d086c3af2098aeff1fb49d6f5>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, GraphQLSubscription } from 'relay-runtime';
export type IndexSubscription$variables = Record<PropertyKey, never>;
export type IndexSubscription$data = {
  readonly counter: {
    readonly count: number;
  };
};
export type IndexSubscription = {
  response: IndexSubscription$data;
  variables: IndexSubscription$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "count",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "IndexSubscription",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "Counter",
        "kind": "LinkedField",
        "name": "counter",
        "plural": false,
        "selections": [
          (v0/*: any*/)
        ],
        "storageKey": null
      }
    ],
    "type": "Subscription",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "IndexSubscription",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "Counter",
        "kind": "LinkedField",
        "name": "counter",
        "plural": false,
        "selections": [
          (v0/*: any*/),
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "id",
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "58668863b6213191f1ed5dff4d81162d",
    "id": null,
    "metadata": {},
    "name": "IndexSubscription",
    "operationKind": "subscription",
    "text": "subscription IndexSubscription {\n  counter {\n    count\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "82db1286e5fa3f47c49e383b3d2287e6";

export default node;
