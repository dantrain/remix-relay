/**
 * @generated SignedSource<<8b6bc06ed1588af436c3532b188d7f83>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type CreateColumnCreateOneColumnMutation$variables = {
  boardId: string;
  connections: ReadonlyArray<string>;
  id: string;
  rank: string;
  title: string;
};
export type CreateColumnCreateOneColumnMutation$data = {
  readonly createOneColumn: {
    readonly id: string;
    readonly rank: string;
    readonly title: string;
  };
};
export type CreateColumnCreateOneColumnMutation = {
  response: CreateColumnCreateOneColumnMutation$data;
  variables: CreateColumnCreateOneColumnMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "boardId"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "connections"
},
v2 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "id"
},
v3 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "rank"
},
v4 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "title"
},
v5 = [
  {
    "kind": "Variable",
    "name": "boardId",
    "variableName": "boardId"
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
  },
  {
    "kind": "Variable",
    "name": "title",
    "variableName": "title"
  }
],
v6 = {
  "alias": null,
  "args": (v5/*: any*/),
  "concreteType": "Column",
  "kind": "LinkedField",
  "name": "createOneColumn",
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
      "name": "title",
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
};
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/),
      (v2/*: any*/),
      (v3/*: any*/),
      (v4/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "CreateColumnCreateOneColumnMutation",
    "selections": [
      (v6/*: any*/)
    ],
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [
      (v2/*: any*/),
      (v4/*: any*/),
      (v3/*: any*/),
      (v0/*: any*/),
      (v1/*: any*/)
    ],
    "kind": "Operation",
    "name": "CreateColumnCreateOneColumnMutation",
    "selections": [
      (v6/*: any*/),
      {
        "alias": null,
        "args": (v5/*: any*/),
        "filters": null,
        "handle": "appendNode",
        "key": "",
        "kind": "LinkedHandle",
        "name": "createOneColumn",
        "handleArgs": [
          {
            "kind": "Variable",
            "name": "connections",
            "variableName": "connections"
          },
          {
            "kind": "Literal",
            "name": "edgeTypeName",
            "value": "ColumnConnectionEdge"
          }
        ]
      }
    ]
  },
  "params": {
    "cacheID": "41212edec70b1a19dc421cbb57224e74",
    "id": null,
    "metadata": {},
    "name": "CreateColumnCreateOneColumnMutation",
    "operationKind": "mutation",
    "text": "mutation CreateColumnCreateOneColumnMutation(\n  $id: ID!\n  $title: String!\n  $rank: String!\n  $boardId: ID!\n) {\n  createOneColumn(id: $id, title: $title, rank: $rank, boardId: $boardId) {\n    id\n    title\n    rank\n  }\n}\n"
  }
};
})();

(node as any).hash = "5ff37af87faba9cb9e31b5dbdc6c7d84";

export default node;
