/**
 * @generated SignedSource<<875df1a23a0cbfdfa98eac2c4ac4ca13>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type CreateItemCreateOneItemMutation$variables = {
  columnId: string;
  connections: ReadonlyArray<string>;
  id: string;
  rank: string;
  title: string;
};
export type CreateItemCreateOneItemMutation$data = {
  readonly createOneItem: {
    readonly columnId: string;
    readonly id: string;
    readonly rank: string;
    readonly title: string;
    readonly " $fragmentSpreads": FragmentRefs<"ItemFragment">;
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
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "rank",
  "storageKey": null
},
v8 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "title",
  "storageKey": null
},
v9 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "columnId",
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
      {
        "alias": null,
        "args": (v5/*: any*/),
        "concreteType": "Item",
        "kind": "LinkedField",
        "name": "createOneItem",
        "plural": false,
        "selections": [
          (v6/*: any*/),
          (v7/*: any*/),
          (v8/*: any*/),
          (v9/*: any*/),
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "ItemFragment"
          }
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
      (v2/*: any*/),
      (v0/*: any*/),
      (v4/*: any*/),
      (v3/*: any*/),
      (v1/*: any*/)
    ],
    "kind": "Operation",
    "name": "CreateItemCreateOneItemMutation",
    "selections": [
      {
        "alias": null,
        "args": (v5/*: any*/),
        "concreteType": "Item",
        "kind": "LinkedField",
        "name": "createOneItem",
        "plural": false,
        "selections": [
          (v6/*: any*/),
          (v7/*: any*/),
          (v8/*: any*/),
          (v9/*: any*/)
        ],
        "storageKey": null
      },
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
    "cacheID": "24f5f4c28016755d30d69bed7b5183aa",
    "id": null,
    "metadata": {},
    "name": "CreateItemCreateOneItemMutation",
    "operationKind": "mutation",
    "text": "mutation CreateItemCreateOneItemMutation(\n  $id: ID!\n  $columnId: ID!\n  $title: String!\n  $rank: String!\n) {\n  createOneItem(id: $id, columnId: $columnId, title: $title, rank: $rank) {\n    id\n    rank\n    title\n    columnId\n    ...ItemFragment\n  }\n}\n\nfragment ItemFragment on Item {\n  id\n  title\n  rank\n  columnId\n}\n"
  }
};
})();

(node as any).hash = "c2eca5bf7ec4876fa24708f957ac6225";

export default node;
