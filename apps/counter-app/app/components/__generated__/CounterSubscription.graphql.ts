/**
 * @generated SignedSource<<c4200182c2da330134728d996b764483>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type CounterSubscription$variables = {
  id: string;
};
export type CounterSubscription$data = {
  readonly counter: {
    readonly " $fragmentSpreads": FragmentRefs<"CounterFragment">;
  } | null | undefined;
};
export type CounterSubscription = {
  response: CounterSubscription$data;
  variables: CounterSubscription$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "id"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "id"
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "CounterSubscription",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "Counter",
        "kind": "LinkedField",
        "name": "counter",
        "plural": false,
        "selections": [
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
    "name": "CounterSubscription",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "Counter",
        "kind": "LinkedField",
        "name": "counter",
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
    ]
  },
  "params": {
    "cacheID": "536e54d46821345ade13af479e1ef433",
    "id": null,
    "metadata": {},
    "name": "CounterSubscription",
    "operationKind": "subscription",
    "text": "subscription CounterSubscription(\n  $id: ID!\n) {\n  counter(id: $id) {\n    ...CounterFragment\n    id\n  }\n}\n\nfragment CounterFragment on Counter {\n  id\n  count\n}\n"
  }
};
})();

(node as any).hash = "4caa542300a2a2a6f05b4557557ab622";

export default node;
