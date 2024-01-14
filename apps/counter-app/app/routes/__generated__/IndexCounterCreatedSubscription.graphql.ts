/**
 * @generated SignedSource<<9ad7813f04c04b77419f6e99fd4165c9>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, GraphQLSubscription } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type IndexCounterCreatedSubscription$variables = {
  connections: ReadonlyArray<string>;
};
export type IndexCounterCreatedSubscription$data = {
  readonly counterCreated: {
    readonly id: string;
    readonly " $fragmentSpreads": FragmentRefs<"CounterFragment">;
  };
};
export type IndexCounterCreatedSubscription = {
  response: IndexCounterCreatedSubscription$data;
  variables: IndexCounterCreatedSubscription$variables;
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
    "name": "IndexCounterCreatedSubscription",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "Counter",
        "kind": "LinkedField",
        "name": "counterCreated",
        "plural": false,
        "selections": [
          (v1/*: any*/),
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "CounterFragment"
          }
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
    "name": "IndexCounterCreatedSubscription",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "Counter",
        "kind": "LinkedField",
        "name": "counterCreated",
        "plural": false,
        "selections": [
          (v1/*: any*/),
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "count",
            "storageKey": null
          }
        ],
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "filters": null,
        "handle": "appendNode",
        "key": "",
        "kind": "LinkedHandle",
        "name": "counterCreated",
        "handleArgs": [
          {
            "kind": "Variable",
            "name": "connections",
            "variableName": "connections"
          },
          {
            "kind": "Literal",
            "name": "edgeTypeName",
            "value": "CounterConnectionEdge"
          }
        ]
      }
    ]
  },
  "params": {
    "cacheID": "ef948bec593c9990720c92e671a55f4f",
    "id": null,
    "metadata": {},
    "name": "IndexCounterCreatedSubscription",
    "operationKind": "subscription",
    "text": "subscription IndexCounterCreatedSubscription {\n  counterCreated {\n    id\n    ...CounterFragment\n  }\n}\n\nfragment CounterFragment on Counter {\n  id\n  count\n}\n"
  }
};
})();

(node as any).hash = "c883671407f6a3acadf676e0c3088723";

export default node;
