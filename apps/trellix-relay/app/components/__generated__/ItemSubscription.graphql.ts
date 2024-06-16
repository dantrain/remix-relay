/**
 * @generated SignedSource<<a861f1b6731f31aab192339c737fd36e>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, GraphQLSubscription } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type ItemSubscription$variables = {
  id: string;
};
export type ItemSubscription$data = {
  readonly item: {
    readonly " $fragmentSpreads": FragmentRefs<"ItemFragment">;
  };
};
export type ItemSubscription = {
  response: ItemSubscription$data;
  variables: ItemSubscription$variables;
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
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "ItemSubscription",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "Item",
        "kind": "LinkedField",
        "name": "item",
        "plural": false,
        "selections": [
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
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "ItemSubscription",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "Item",
        "kind": "LinkedField",
        "name": "item",
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
            "name": "text",
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "a8bcc6bdf18a3215c0253f6bae719839",
    "id": null,
    "metadata": {},
    "name": "ItemSubscription",
    "operationKind": "subscription",
    "text": "subscription ItemSubscription(\n  $id: ID!\n) {\n  item(id: $id) {\n    ...ItemFragment\n    id\n  }\n}\n\nfragment ItemFragment on Item {\n  id\n  text\n}\n"
  }
};
})();

(node as any).hash = "ec03e07c26e403fb53755b823c8c3c8e";

export default node;
