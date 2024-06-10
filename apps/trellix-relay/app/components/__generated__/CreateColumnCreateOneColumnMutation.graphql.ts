/**
 * @generated SignedSource<<ab334fbd14e7a39ad97efcfd25a6ad12>>
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
    readonly itemConnection: {
      readonly edges: ReadonlyArray<{
        readonly node: {
          readonly id: string;
        };
      }>;
    };
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
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": (v5/*: any*/),
  "concreteType": "Column",
  "kind": "LinkedField",
  "name": "createOneColumn",
  "plural": false,
  "selections": [
    (v6/*: any*/),
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
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "ColumnItemConnection",
      "kind": "LinkedField",
      "name": "itemConnection",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "concreteType": "ColumnItemConnectionEdge",
          "kind": "LinkedField",
          "name": "edges",
          "plural": true,
          "selections": [
            {
              "alias": null,
              "args": null,
              "concreteType": "Item",
              "kind": "LinkedField",
              "name": "node",
              "plural": false,
              "selections": [
                (v6/*: any*/)
              ],
              "storageKey": null
            }
          ],
          "storageKey": null
        }
      ],
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
      (v7/*: any*/)
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
      (v7/*: any*/),
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
    "cacheID": "23c8b9041f0bc0c075370947df02e558",
    "id": null,
    "metadata": {},
    "name": "CreateColumnCreateOneColumnMutation",
    "operationKind": "mutation",
    "text": "mutation CreateColumnCreateOneColumnMutation(\n  $id: ID!\n  $title: String!\n  $rank: String!\n  $boardId: ID!\n) {\n  createOneColumn(id: $id, title: $title, rank: $rank, boardId: $boardId) {\n    id\n    title\n    rank\n    itemConnection {\n      edges {\n        node {\n          id\n        }\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "0251663fa8dec31d55caa96715e7a49c";

export default node;
