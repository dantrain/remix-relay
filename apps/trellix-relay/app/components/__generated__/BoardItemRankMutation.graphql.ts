/**
 * @generated SignedSource<<003cc6e648a3170764b26c61ec6088ce>>
 * @lightSyntaxTransform
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type BoardItemRankMutation$variables = {
  columnId: string;
  id: string;
  rank: string;
};
export type BoardItemRankMutation$data = {
  readonly updateOneItem: {
    readonly columnId: string | null | undefined;
    readonly rank: string;
  } | null | undefined;
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
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "rank",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "columnId",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*:: as any*/),
      (v1/*:: as any*/),
      (v2/*:: as any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "BoardItemRankMutation",
    "selections": [
      {
        "alias": null,
        "args": (v3/*:: as any*/),
        "concreteType": "Item",
        "kind": "LinkedField",
        "name": "updateOneItem",
        "plural": false,
        "selections": [
          (v4/*:: as any*/),
          (v5/*:: as any*/)
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
      (v2/*:: as any*/),
      (v0/*:: as any*/)
    ],
    "kind": "Operation",
    "name": "BoardItemRankMutation",
    "selections": [
      {
        "alias": null,
        "args": (v3/*:: as any*/),
        "concreteType": "Item",
        "kind": "LinkedField",
        "name": "updateOneItem",
        "plural": false,
        "selections": [
          (v4/*:: as any*/),
          (v5/*:: as any*/),
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "id",
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "cf6952e9ac110f8580793693dcafe831",
    "id": null,
    "metadata": {},
    "name": "BoardItemRankMutation",
    "operationKind": "mutation",
    "text": "mutation BoardItemRankMutation(\n  $id: ID!\n  $rank: String!\n  $columnId: ID!\n) {\n  updateOneItem(id: $id, rank: $rank, columnId: $columnId) {\n    rank\n    columnId\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "820d80ebee8e73b0108accdbb3cf8785";

export default node;
