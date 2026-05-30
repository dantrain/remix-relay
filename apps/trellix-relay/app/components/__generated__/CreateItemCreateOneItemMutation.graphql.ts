/**
 * @generated SignedSource<<11486e86706c99097ac34fc0e861a88b>>
 * @lightSyntaxTransform
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
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
    readonly columnId: string | null | undefined;
    readonly id: string;
    readonly rank: string;
    readonly title: string;
    readonly " $fragmentSpreads": FragmentRefs<"ItemFragment">;
  } | null | undefined;
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
      (v0/*:: as any*/),
      (v1/*:: as any*/),
      (v2/*:: as any*/),
      (v3/*:: as any*/),
      (v4/*:: as any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "CreateItemCreateOneItemMutation",
    "selections": [
      {
        "alias": null,
        "args": (v5/*:: as any*/),
        "concreteType": "Item",
        "kind": "LinkedField",
        "name": "createOneItem",
        "plural": false,
        "selections": [
          (v6/*:: as any*/),
          (v7/*:: as any*/),
          (v8/*:: as any*/),
          (v9/*:: as any*/),
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
      (v2/*:: as any*/),
      (v0/*:: as any*/),
      (v4/*:: as any*/),
      (v3/*:: as any*/),
      (v1/*:: as any*/)
    ],
    "kind": "Operation",
    "name": "CreateItemCreateOneItemMutation",
    "selections": [
      {
        "alias": null,
        "args": (v5/*:: as any*/),
        "concreteType": "Item",
        "kind": "LinkedField",
        "name": "createOneItem",
        "plural": false,
        "selections": [
          (v6/*:: as any*/),
          (v7/*:: as any*/),
          (v8/*:: as any*/),
          (v9/*:: as any*/)
        ],
        "storageKey": null
      },
      {
        "alias": null,
        "args": (v5/*:: as any*/),
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
