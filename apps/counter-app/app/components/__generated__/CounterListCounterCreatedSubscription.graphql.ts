/**
 * @generated SignedSource<<e0f74e0d21cd45229fe303e6cc95d287>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, GraphQLSubscription } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type CounterListCounterCreatedSubscription$variables = {
  connections: ReadonlyArray<string>;
};
export type CounterListCounterCreatedSubscription$data = {
  readonly counterCreated: {
    readonly id: string;
    readonly " $fragmentSpreads": FragmentRefs<"CounterFragment">;
  };
};
export type CounterListCounterCreatedSubscription = {
  response: CounterListCounterCreatedSubscription$data;
  variables: CounterListCounterCreatedSubscription$variables;
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
    "name": "CounterListCounterCreatedSubscription",
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
    "name": "CounterListCounterCreatedSubscription",
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
            "value": "UserCounterConnectionEdge"
          }
        ]
      }
    ]
  },
  "params": {
    "cacheID": "808f968c325f4eecaec92c19573d104c",
    "id": null,
    "metadata": {},
    "name": "CounterListCounterCreatedSubscription",
    "operationKind": "subscription",
    "text": "subscription CounterListCounterCreatedSubscription {\n  counterCreated {\n    id\n    ...CounterFragment\n  }\n}\n\nfragment CounterFragment on Counter {\n  id\n  count\n}\n"
  }
};
})();

(node as any).hash = "5b209320dec13c8b445a062682c1b9b1";

export default node;
