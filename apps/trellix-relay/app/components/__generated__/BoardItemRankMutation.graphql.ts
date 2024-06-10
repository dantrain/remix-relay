/**
 * @generated SignedSource<<d517244001a3484f11117c3ad2cbf0a8>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type BoardItemRankMutation$variables = {
  columnId: string;
  id: string;
  rank: string;
};
export type BoardItemRankMutation$data = {
  readonly updateOneItem: {
    readonly id: string;
    readonly rank: string;
  };
};
export type BoardItemRankMutation = {
  response: BoardItemRankMutation$data;
  variables: BoardItemRankMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "columnId"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "id"
},
v2 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "rank"
},
v3 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "columnId",
        "variableName": "columnId"
      },
      {
        "kind": "Variable",
        "name": "id",
        "variableName": "id"
      },
      {
        "kind": "Variable",
        "name": "rank",
        "variableName": "rank"
      }
    ],
    "concreteType": "Item",
    "kind": "LinkedField",
    "name": "updateOneItem",
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
        "name": "rank",
        "storageKey": null
      }
    ],
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/),
      (v2/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "BoardItemRankMutation",
    "selections": (v3/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [
      (v1/*: any*/),
      (v2/*: any*/),
      (v0/*: any*/)
    ],
    "kind": "Operation",
    "name": "BoardItemRankMutation",
    "selections": (v3/*: any*/)
  },
  "params": {
    "cacheID": "714dea6d4ae00ba0d9d9ee43350ef18b",
    "id": null,
    "metadata": {},
    "name": "BoardItemRankMutation",
    "operationKind": "mutation",
    "text": "mutation BoardItemRankMutation(\n  $id: ID!\n  $rank: String!\n  $columnId: ID!\n) {\n  updateOneItem(id: $id, rank: $rank, columnId: $columnId) {\n    id\n    rank\n  }\n}\n"
  }
};
})();

(node as any).hash = "15593cf97437768405f37389b5cf999a";

export default node;
