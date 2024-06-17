/**
 * @generated SignedSource<<ca67f1779166089358ed9fb1148ddae8>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, GraphQLSubscription } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type BoardItemCreatedSubscription$variables = Record<PropertyKey, never>;
export type BoardItemCreatedSubscription$data = {
  readonly itemCreated: {
    readonly columnId: string;
    readonly id: string;
    readonly " $fragmentSpreads": FragmentRefs<"ItemFragment">;
  };
};
export type BoardItemCreatedSubscription = {
  response: BoardItemCreatedSubscription$data;
  variables: BoardItemCreatedSubscription$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "columnId",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "BoardItemCreatedSubscription",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "Item",
        "kind": "LinkedField",
        "name": "itemCreated",
        "plural": false,
        "selections": [
          (v0/*: any*/),
          (v1/*: any*/),
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "ItemFragment"
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
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "BoardItemCreatedSubscription",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "Item",
        "kind": "LinkedField",
        "name": "itemCreated",
        "plural": false,
        "selections": [
          (v0/*: any*/),
          (v1/*: any*/),
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "title",
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "8f7602e5620d507d5e6ab6d4ad3850d1",
    "id": null,
    "metadata": {},
    "name": "BoardItemCreatedSubscription",
    "operationKind": "subscription",
    "text": "subscription BoardItemCreatedSubscription {\n  itemCreated {\n    id\n    columnId\n    ...ItemFragment\n  }\n}\n\nfragment ItemFragment on Item {\n  id\n  title\n  columnId\n}\n"
  }
};
})();

(node as any).hash = "d5f3d4c053edbc6fbaa111d0aed84734";

export default node;
