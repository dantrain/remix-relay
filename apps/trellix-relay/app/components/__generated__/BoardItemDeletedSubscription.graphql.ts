/**
 * @generated SignedSource<<8a6b3fe678b07176ab4edf8bb3066f2e>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, GraphQLSubscription } from 'relay-runtime';
export type BoardItemDeletedSubscription$variables = {
  connections: ReadonlyArray<string>;
};
export type BoardItemDeletedSubscription$data = {
  readonly itemDeleted: {
    readonly id: string;
  } | null | undefined;
};
export type BoardItemDeletedSubscription = {
  response: BoardItemDeletedSubscription$data;
  variables: BoardItemDeletedSubscription$variables;
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
    "name": "BoardItemDeletedSubscription",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "Item",
        "kind": "LinkedField",
        "name": "itemDeleted",
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
    "name": "BoardItemDeletedSubscription",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "Item",
        "kind": "LinkedField",
        "name": "itemDeleted",
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
    "cacheID": "9dd36e4bc35613d5368990ff823ccee0",
    "id": null,
    "metadata": {},
    "name": "BoardItemDeletedSubscription",
    "operationKind": "subscription",
    "text": "subscription BoardItemDeletedSubscription {\n  itemDeleted {\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "bcedafe912237b99250629e27d8cc117";

export default node;
