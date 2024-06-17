/**
 * @generated SignedSource<<401180e1cd7a23525d3a5c7bac364142>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type CreateItemCreateOneItemMutation$variables = {
  columnId: string;
  connections: ReadonlyArray<string>;
  id: string;
  rank: string;
  title: string;
};
export type CreateItemCreateOneItemMutation$data = {
  readonly createOneItem: {
    readonly id: string;
    readonly rank: string;
    readonly title: string;
  };
};
export type CreateItemCreateOneItemMutation = {
  response: CreateItemCreateOneItemMutation$data;
  variables: CreateItemCreateOneItemMutation$variables;
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
  "concreteType": "Item",
  "kind": "LinkedField",
  "name": "createOneItem",
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
      (v3/*: any*/),
      (v4/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "CreateItemCreateOneItemMutation",
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
      (v0/*: any*/),
      (v4/*: any*/),
      (v3/*: any*/),
      (v1/*: any*/)
    ],
    "kind": "Operation",
    "name": "CreateItemCreateOneItemMutation",
    "selections": [
      (v6/*: any*/),
      {
        "alias": null,
        "args": (v5/*: any*/),
        "filters": null,
        "handle": "appendNode",
        "key": "",
        "kind": "LinkedHandle",
        "name": "createOneItem",
        "handleArgs": [
          {
            "kind": "Variable",
            "name": "connections",
            "variableName": "connections"
          },
          {
            "kind": "Literal",
            "name": "edgeTypeName",
            "value": "ColumnItemConnectionEdge"
          }
        ]
      }
    ]
  },
  "params": {
    "cacheID": "53cb7b64180d3f54b60dbe38379c3a2a",
    "id": null,
    "metadata": {},
    "name": "CreateItemCreateOneItemMutation",
    "operationKind": "mutation",
    "text": "mutation CreateItemCreateOneItemMutation(\n  $id: ID!\n  $columnId: ID!\n  $title: String!\n  $rank: String!\n) {\n  createOneItem(id: $id, columnId: $columnId, title: $title, rank: $rank) {\n    id\n    rank\n    title\n  }\n}\n"
  }
};
})();

(node as any).hash = "8985e98f4d2fcb7364fea68f1ffe156a";

export default node;
