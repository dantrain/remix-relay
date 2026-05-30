/**
 * @generated SignedSource<<8a1364705d8a18b3b3791b2ff4871aa8>>
 * @lightSyntaxTransform
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type ItemSubscription$variables = {
  id: string;
};
export type ItemSubscription$data = {
  readonly item: {
    readonly columnId: string | null | undefined;
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
    "argumentDefinitions": (v0/*:: as any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "ItemSubscription",
    "selections": [
      {
        "alias": null,
        "args": (v1/*:: as any*/),
        "concreteType": "Item",
        "kind": "LinkedField",
        "name": "item",
        "plural": false,
        "selections": [
          (v2/*:: as any*/),
          (v3/*:: as any*/),
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
    "argumentDefinitions": (v0/*:: as any*/),
    "kind": "Operation",
    "name": "ItemSubscription",
    "selections": [
      {
        "alias": null,
        "args": (v1/*:: as any*/),
        "concreteType": "Item",
        "kind": "LinkedField",
        "name": "item",
        "plural": false,
        "selections": [
          (v2/*:: as any*/),
          (v3/*:: as any*/),
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
            "name": "title",
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "fd53b68d095fa852c5306f73d69c85e8",
    "id": null,
    "metadata": {},
    "name": "ItemSubscription",
    "operationKind": "subscription",
    "text": "subscription ItemSubscription(\n  $id: ID!\n) {\n  item(id: $id) {\n    rank\n    columnId\n    ...ItemFragment\n    id\n  }\n}\n\nfragment ItemFragment on Item {\n  id\n  title\n  rank\n  columnId\n}\n"
  }
};
})();

(node as any).hash = "71fed14e597725b51ec84738bfcd88c1";

export default node;
