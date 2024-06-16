/**
 * @generated SignedSource<<5c5e68d3e7323702a36649b006f9f302>>
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
    readonly columnId: string;
    readonly rank: string;
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
  "name": "columnId",
  "storageKey": null
};
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
          (v2/*: any*/),
          (v3/*: any*/),
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
          (v2/*: any*/),
          (v3/*: any*/),
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
    "cacheID": "95ebb5464cfd150259e84e6e6843b2f4",
    "id": null,
    "metadata": {},
    "name": "ItemSubscription",
    "operationKind": "subscription",
    "text": "subscription ItemSubscription(\n  $id: ID!\n) {\n  item(id: $id) {\n    rank\n    columnId\n    ...ItemFragment\n    id\n  }\n}\n\nfragment ItemFragment on Item {\n  id\n  text\n  columnId\n}\n"
  }
};
})();

(node as any).hash = "71fed14e597725b51ec84738bfcd88c1";

export default node;
