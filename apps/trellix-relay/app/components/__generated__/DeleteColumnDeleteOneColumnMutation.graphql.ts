/**
 * @generated SignedSource<<13d5c0a2d8bc456a14b0e6e3fca9f7de>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type DeleteColumnDeleteOneColumnMutation$variables = {
  connections: ReadonlyArray<string>;
  id: string;
};
export type DeleteColumnDeleteOneColumnMutation$data = {
  readonly deleteOneColumn: {
    readonly id: string;
  };
};
export type DeleteColumnDeleteOneColumnMutation = {
  response: DeleteColumnDeleteOneColumnMutation$data;
  variables: DeleteColumnDeleteOneColumnMutation$variables;
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
      (v0/*: any*/),
      (v1/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "DeleteColumnDeleteOneColumnMutation",
    "selections": [
      {
        "alias": null,
        "args": (v2/*: any*/),
        "concreteType": "Column",
        "kind": "LinkedField",
        "name": "deleteOneColumn",
        "plural": false,
        "selections": [
          (v3/*: any*/)
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
      (v1/*: any*/),
      (v0/*: any*/)
    ],
    "kind": "Operation",
    "name": "DeleteColumnDeleteOneColumnMutation",
    "selections": [
      {
        "alias": null,
        "args": (v2/*: any*/),
        "concreteType": "Column",
        "kind": "LinkedField",
        "name": "deleteOneColumn",
        "plural": false,
        "selections": [
          (v3/*: any*/),
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
    "cacheID": "884bf3aa2e4f3a5fb10768862bfc6152",
    "id": null,
    "metadata": {},
    "name": "DeleteColumnDeleteOneColumnMutation",
    "operationKind": "mutation",
    "text": "mutation DeleteColumnDeleteOneColumnMutation(\n  $id: ID!\n) {\n  deleteOneColumn(id: $id) {\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "887976ea2de4dfb34c94591fb2953b89";

export default node;
