/**
 * @generated SignedSource<<d98c8c44cc562619165cfaac0aed5d1a>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, GraphQLSubscription } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type BoardColumnCreatedSubscription$variables = {
  connections: ReadonlyArray<string>;
};
export type BoardColumnCreatedSubscription$data = {
  readonly columnCreated: {
    readonly id: string;
    readonly " $fragmentSpreads": FragmentRefs<"ColumnFragment">;
  };
};
export type BoardColumnCreatedSubscription = {
  response: BoardColumnCreatedSubscription$data;
  variables: BoardColumnCreatedSubscription$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "connections"
  }
],
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "BoardColumnCreatedSubscription",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "Column",
        "kind": "LinkedField",
        "name": "columnCreated",
        "plural": false,
        "selections": [
          (v1/*: any*/),
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
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "BoardColumnCreatedSubscription",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "Column",
        "kind": "LinkedField",
        "name": "columnCreated",
        "plural": false,
        "selections": [
          (v1/*: any*/),
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
                      (v1/*: any*/),
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
      },
      {
        "alias": null,
        "args": null,
        "filters": null,
        "handle": "appendNode",
        "key": "",
        "kind": "LinkedHandle",
        "name": "columnCreated",
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
    "cacheID": "c1381e0da1c8ff1357b497503ea55281",
    "id": null,
    "metadata": {},
    "name": "BoardColumnCreatedSubscription",
    "operationKind": "subscription",
    "text": "subscription BoardColumnCreatedSubscription {\n  columnCreated {\n    id\n    ...ColumnFragment\n  }\n}\n\nfragment ColumnFragment on Column {\n  id\n  title\n  ...ColumnTitleFragment\n  itemConnection {\n    edges {\n      node {\n        id\n        rank\n      }\n    }\n  }\n}\n\nfragment ColumnTitleFragment on Column {\n  id\n  title\n}\n"
  }
};
})();

(node as any).hash = "c0a297e188dbb39e337726c0f057e0c6";

export default node;
