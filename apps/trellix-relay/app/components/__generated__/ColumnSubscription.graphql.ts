/**
 * @generated SignedSource<<15b897f7123f6cbd732b84e65f4809f0>>
 * @lightSyntaxTransform
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type ColumnSubscription$variables = {
  id: string;
};
export type ColumnSubscription$data = {
  readonly column: {
    readonly rank: string;
    readonly " $fragmentSpreads": FragmentRefs<"ColumnFragment">;
  } | null | undefined;
};
export type ColumnSubscription = {
  response: ColumnSubscription$data;
  variables: ColumnSubscription$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "id"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "id"
  }
],
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "rank",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*:: as any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "ColumnSubscription",
    "selections": [
      {
        "alias": null,
        "args": (v1/*:: as any*/),
        "concreteType": "Column",
        "kind": "LinkedField",
        "name": "column",
        "plural": false,
        "selections": [
          (v2/*:: as any*/),
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "ColumnFragment"
          }
        ],
        "storageKey": null
      }
    ],
    "type": "Subscription",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*:: as any*/),
    "kind": "Operation",
    "name": "ColumnSubscription",
    "selections": [
      {
        "alias": null,
        "args": (v1/*:: as any*/),
        "concreteType": "Column",
        "kind": "LinkedField",
        "name": "column",
        "plural": false,
        "selections": [
          (v2/*:: as any*/),
          (v3/*:: as any*/),
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
                      (v3/*:: as any*/),
                      (v2/*:: as any*/)
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": null
              },
              {
                "kind": "ClientExtension",
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "__id",
                    "storageKey": null
                  }
                ]
              }
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "8860b68e6e29c7bef441d2b983b15125",
    "id": null,
    "metadata": {},
    "name": "ColumnSubscription",
    "operationKind": "subscription",
    "text": "subscription ColumnSubscription(\n  $id: ID!\n) {\n  column(id: $id) {\n    rank\n    ...ColumnFragment\n    id\n  }\n}\n\nfragment ColumnFragment on Column {\n  id\n  title\n  ...ColumnTitleFragment\n  itemConnection {\n    edges {\n      node {\n        id\n        rank\n      }\n    }\n  }\n}\n\nfragment ColumnTitleFragment on Column {\n  id\n  title\n}\n"
  }
};
})();

(node as any).hash = "7bdcecbf0dfdb0082676ab841ef375cb";

export default node;
