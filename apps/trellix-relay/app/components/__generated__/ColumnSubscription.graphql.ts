/**
 * @generated SignedSource<<1cb25123d7b6ec7d5f7a6444c93974ca>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, GraphQLSubscription } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type ColumnSubscription$variables = {
  id: string;
};
export type ColumnSubscription$data = {
  readonly column: {
    readonly " $fragmentSpreads": FragmentRefs<"ColumnFragment">;
  };
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
  "name": "id",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "ColumnSubscription",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "Column",
        "kind": "LinkedField",
        "name": "column",
        "plural": false,
        "selections": [
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
    "name": "ColumnSubscription",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "Column",
        "kind": "LinkedField",
        "name": "column",
        "plural": false,
        "selections": [
          (v2/*: any*/),
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
                      (v2/*: any*/),
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
      }
    ]
  },
  "params": {
    "cacheID": "2ae9240991755130cba33b1cbd73ddb1",
    "id": null,
    "metadata": {},
    "name": "ColumnSubscription",
    "operationKind": "subscription",
    "text": "subscription ColumnSubscription(\n  $id: ID!\n) {\n  column(id: $id) {\n    ...ColumnFragment\n    id\n  }\n}\n\nfragment ColumnFragment on Column {\n  id\n  title\n  ...ColumnTitleFragment\n  itemConnection {\n    edges {\n      node {\n        id\n        rank\n      }\n    }\n  }\n}\n\nfragment ColumnTitleFragment on Column {\n  id\n  title\n}\n"
  }
};
})();

(node as any).hash = "78ab7aeb36159b0f337eeae3b949678f";

export default node;
