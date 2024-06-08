/**
 * @generated SignedSource<<2cb0dbfe29337716c14e9cfa88ad5256>>
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
  title: string;
};
export type CreateColumnCreateOneColumnMutation$data = {
  readonly createOneColumn: {
    readonly id: string;
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
  "name": "title"
},
v4 = [
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
    "name": "title",
    "variableName": "title"
  }
],
v5 = {
  "alias": null,
  "args": (v4/*: any*/),
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
      (v3/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "CreateColumnCreateOneColumnMutation",
    "selections": [
      (v5/*: any*/)
    ],
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [
      (v2/*: any*/),
      (v3/*: any*/),
      (v0/*: any*/),
      (v1/*: any*/)
    ],
    "kind": "Operation",
    "name": "CreateColumnCreateOneColumnMutation",
    "selections": [
      (v5/*: any*/),
      {
        "alias": null,
        "args": (v4/*: any*/),
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
    "cacheID": "1399e2c9aa0a48f509ba7f6f576e82a4",
    "id": null,
    "metadata": {},
    "name": "CreateColumnCreateOneColumnMutation",
    "operationKind": "mutation",
    "text": "mutation CreateColumnCreateOneColumnMutation(\n  $id: ID!\n  $title: String!\n  $boardId: ID!\n) {\n  createOneColumn(id: $id, title: $title, boardId: $boardId) {\n    id\n    title\n  }\n}\n"
  }
};
})();

(node as any).hash = "7f40043438aa0b36dfb1189ea6d3f38d";

export default node;
