/**
 * @generated SignedSource<<827ac38c59b244ebeb7c074918652ccb>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, GraphQLSubscription } from 'relay-runtime';
export type CounterListCounterDeletedSubscription$variables = {
  connections: ReadonlyArray<string>;
};
export type CounterListCounterDeletedSubscription$data = {
  readonly counterDeleted: {
    readonly id: string;
  };
};
export type CounterListCounterDeletedSubscription = {
  response: CounterListCounterDeletedSubscription$data;
  variables: CounterListCounterDeletedSubscription$variables;
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
    "name": "CounterListCounterDeletedSubscription",
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
    "name": "CounterListCounterDeletedSubscription",
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
    "cacheID": "036139a05d283135f4853ead7652e0f0",
    "id": null,
    "metadata": {},
    "name": "CounterListCounterDeletedSubscription",
    "operationKind": "subscription",
    "text": "subscription CounterListCounterDeletedSubscription {\n  counterDeleted {\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "71468d9556ec578f3e75e70e3eb8179e";

export default node;
