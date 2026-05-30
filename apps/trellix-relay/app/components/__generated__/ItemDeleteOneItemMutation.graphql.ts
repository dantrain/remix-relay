/**
 * @generated SignedSource<<d7dce842a01c499add0fe24c8837ea52>>
 * @lightSyntaxTransform
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type ItemDeleteOneItemMutation$variables = {
  connections: ReadonlyArray<string>;
  id: string;
};
export type ItemDeleteOneItemMutation$data = {
  readonly deleteOneItem: {
    readonly id: string;
  } | null | undefined;
};
export type ItemDeleteOneItemMutation = {
  response: ItemDeleteOneItemMutation$data;
  variables: ItemDeleteOneItemMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "connections"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "id"
},
v2 = [
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "id"
  }
],
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*:: as any*/),
      (v1/*:: as any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "ItemDeleteOneItemMutation",
    "selections": [
      {
        "alias": null,
        "args": (v2/*:: as any*/),
        "concreteType": "Item",
        "kind": "LinkedField",
        "name": "deleteOneItem",
        "plural": false,
        "selections": [
          (v3/*:: as any*/)
        ],
        "storageKey": null
      }
    ],
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [
      (v1/*:: as any*/),
      (v0/*:: as any*/)
    ],
    "kind": "Operation",
    "name": "ItemDeleteOneItemMutation",
    "selections": [
      {
        "alias": null,
        "args": (v2/*:: as any*/),
        "concreteType": "Item",
        "kind": "LinkedField",
        "name": "deleteOneItem",
        "plural": false,
        "selections": [
          (v3/*:: as any*/),
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
    "cacheID": "31b288d911258bcedca74bdb21719b5a",
    "id": null,
    "metadata": {},
    "name": "ItemDeleteOneItemMutation",
    "operationKind": "mutation",
    "text": "mutation ItemDeleteOneItemMutation(\n  $id: ID!\n) {\n  deleteOneItem(id: $id) {\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "717ddfae16cb725245f979cd1cc90bf7";

export default node;
