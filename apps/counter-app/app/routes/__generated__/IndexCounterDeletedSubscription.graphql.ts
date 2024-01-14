/**
 * @generated SignedSource<<5e77cd2f255faa9e660721ca95d2eb4b>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, GraphQLSubscription } from 'relay-runtime';
export type IndexCounterDeletedSubscription$variables = {
  connections: ReadonlyArray<string>;
};
export type IndexCounterDeletedSubscription$data = {
  readonly counterDeleted: {
    readonly id: string;
  };
};
export type IndexCounterDeletedSubscription = {
  response: IndexCounterDeletedSubscription$data;
  variables: IndexCounterDeletedSubscription$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "connections"
  }
],
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "IndexCounterDeletedSubscription",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "Counter",
        "kind": "LinkedField",
        "name": "counterDeleted",
        "plural": false,
        "selections": [
          (v1/*: any*/)
        ],
        "storageKey": null
      }
    ],
    "type": "Subscription",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "IndexCounterDeletedSubscription",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "Counter",
        "kind": "LinkedField",
        "name": "counterDeleted",
        "plural": false,
        "selections": [
          (v1/*: any*/),
          {
            "alias": null,
            "args": null,
            "filters": null,
            "handle": "deleteEdge",
            "key": "",
            "kind": "ScalarHandle",
            "name": "id",
            "handleArgs": [
              {
                "kind": "Variable",
                "name": "connections",
                "variableName": "connections"
              }
            ]
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "b37a93f3bb8fab4256d1617e65411580",
    "id": null,
    "metadata": {},
    "name": "IndexCounterDeletedSubscription",
    "operationKind": "subscription",
    "text": "subscription IndexCounterDeletedSubscription {\n  counterDeleted {\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "9d9aa7eb6f4a07f1f28cc1f0d94481c0";

export default node;
