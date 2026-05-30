/**
 * @generated SignedSource<<e3f68425ec012e4010ee03611b772b31>>
 * @lightSyntaxTransform
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type BoardColumnDeletedSubscription$variables = {
  connections: ReadonlyArray<string>;
};
export type BoardColumnDeletedSubscription$data = {
  readonly columnDeleted: {
    readonly id: string;
  } | null | undefined;
};
export type BoardColumnDeletedSubscription = {
  response: BoardColumnDeletedSubscription$data;
  variables: BoardColumnDeletedSubscription$variables;
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
    "argumentDefinitions": (v0/*:: as any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "BoardColumnDeletedSubscription",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "Column",
        "kind": "LinkedField",
        "name": "columnDeleted",
        "plural": false,
        "selections": [
          (v1/*:: as any*/)
        ],
        "storageKey": null
      }
    ],
    "type": "Subscription",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*:: as any*/),
    "kind": "Operation",
    "name": "BoardColumnDeletedSubscription",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "Column",
        "kind": "LinkedField",
        "name": "columnDeleted",
        "plural": false,
        "selections": [
          (v1/*:: as any*/),
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
    "cacheID": "391cdb623d448175e84b723fca8227f9",
    "id": null,
    "metadata": {},
    "name": "BoardColumnDeletedSubscription",
    "operationKind": "subscription",
    "text": "subscription BoardColumnDeletedSubscription {\n  columnDeleted {\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "977455e57e6afabed5b4e4e241c703d7";

export default node;
