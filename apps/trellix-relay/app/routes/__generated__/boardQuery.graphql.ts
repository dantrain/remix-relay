/**
 * @generated SignedSource<<645e7b2c246807af402ffe89383b5813>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type boardQuery$variables = {
  id: string;
};
export type boardQuery$data = {
  readonly board: {
    readonly id: string;
    readonly title: string;
    readonly " $fragmentSpreads": FragmentRefs<"BoardFragment" | "BoardTitleFragment">;
  };
  readonly viewer: {
    readonly id: string;
  };
};
export type boardQuery = {
  response: boardQuery$data;
  variables: boardQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "id"
  }
],
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v2 = {
  "alias": null,
  "args": null,
  "concreteType": "User",
  "kind": "LinkedField",
  "name": "viewer",
  "plural": false,
  "selections": [
    (v1/*: any*/)
  ],
  "storageKey": null
},
v3 = [
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "id"
  }
],
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "title",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "rank",
  "storageKey": null
},
v6 = {
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
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "boardQuery",
    "selections": [
      (v2/*: any*/),
      {
        "alias": null,
        "args": (v3/*: any*/),
        "concreteType": "Board",
        "kind": "LinkedField",
        "name": "board",
        "plural": false,
        "selections": [
          (v1/*: any*/),
          (v4/*: any*/),
          {
            "kind": "Defer",
            "selections": [
              {
                "args": null,
                "kind": "FragmentSpread",
                "name": "BoardTitleFragment"
              }
            ]
          },
          {
            "kind": "Defer",
            "selections": [
              {
                "args": null,
                "kind": "FragmentSpread",
                "name": "BoardFragment"
              }
            ]
          }
        ],
        "storageKey": null
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "boardQuery",
    "selections": [
      (v2/*: any*/),
      {
        "alias": null,
        "args": (v3/*: any*/),
        "concreteType": "Board",
        "kind": "LinkedField",
        "name": "board",
        "plural": false,
        "selections": [
          (v1/*: any*/),
          (v4/*: any*/),
          {
            "if": null,
            "kind": "Defer",
            "label": "boardQuery$defer$BoardTitleFragment",
            "selections": [
              (v1/*: any*/),
              (v4/*: any*/)
            ]
          },
          {
            "if": null,
            "kind": "Defer",
            "label": "boardQuery$defer$BoardFragment",
            "selections": [
              (v1/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "BoardColumnConnection",
                "kind": "LinkedField",
                "name": "columnConnection",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "BoardColumnConnectionEdge",
                    "kind": "LinkedField",
                    "name": "edges",
                    "plural": true,
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "Column",
                        "kind": "LinkedField",
                        "name": "node",
                        "plural": false,
                        "selections": [
                          (v1/*: any*/),
                          (v5/*: any*/),
                          (v4/*: any*/),
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
                                      (v5/*: any*/),
                                      (v4/*: any*/),
                                      {
                                        "alias": null,
                                        "args": null,
                                        "kind": "ScalarField",
                                        "name": "columnId",
                                        "storageKey": null
                                      }
                                    ],
                                    "storageKey": null
                                  }
                                ],
                                "storageKey": null
                              },
                              (v6/*: any*/)
                            ],
                            "storageKey": null
                          }
                        ],
                        "storageKey": null
                      }
                    ],
                    "storageKey": null
                  },
                  (v6/*: any*/)
                ],
                "storageKey": null
              }
            ]
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "1c99e3b770dfd863921bfb5100cd3a43",
    "id": null,
    "metadata": {},
    "name": "boardQuery",
    "operationKind": "query",
    "text": "query boardQuery(\n  $id: ID!\n) {\n  viewer {\n    id\n  }\n  board(id: $id) {\n    id\n    title\n    ...BoardTitleFragment @defer(label: \"boardQuery$defer$BoardTitleFragment\")\n    ...BoardFragment @defer(label: \"boardQuery$defer$BoardFragment\")\n  }\n}\n\nfragment BoardFragment on Board {\n  id\n  columnConnection {\n    edges {\n      node {\n        id\n        rank\n        ...ColumnFragment\n        itemConnection {\n          edges {\n            node {\n              id\n              rank\n              ...ItemFragment\n            }\n          }\n        }\n      }\n    }\n  }\n}\n\nfragment BoardTitleFragment on Board {\n  id\n  title\n}\n\nfragment ColumnFragment on Column {\n  id\n  title\n  ...ColumnTitleFragment\n  itemConnection {\n    edges {\n      node {\n        id\n        rank\n      }\n    }\n  }\n}\n\nfragment ColumnTitleFragment on Column {\n  id\n  title\n}\n\nfragment ItemFragment on Item {\n  id\n  title\n  rank\n  columnId\n}\n"
  }
};
})();

(node as any).hash = "6618b2967673055a5162b5b8a406fce4";

export default node;
