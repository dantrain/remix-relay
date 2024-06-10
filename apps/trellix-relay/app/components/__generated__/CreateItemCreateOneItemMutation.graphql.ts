/**
 * @generated SignedSource<<17a0e77ac3beae4962ba638fdde3d8c5>>
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
  text: string;
};
export type CreateItemCreateOneItemMutation$data = {
  readonly createOneItem: {
    readonly id: string;
    readonly rank: string;
    readonly text: string;
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
  "name": "text"
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
    "name": "text",
    "variableName": "text"
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
      "name": "text",
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
    "cacheID": "1a8e211361e2a628386181512d687bc7",
    "id": null,
    "metadata": {},
    "name": "CreateItemCreateOneItemMutation",
    "operationKind": "mutation",
    "text": "mutation CreateItemCreateOneItemMutation(\n  $id: ID!\n  $columnId: ID!\n  $text: String!\n  $rank: String!\n) {\n  createOneItem(id: $id, columnId: $columnId, text: $text, rank: $rank) {\n    id\n    rank\n    text\n  }\n}\n"
  }
};
})();

(node as any).hash = "3f95fe0c9929d91e32b3a970b14b9508";

export default node;
