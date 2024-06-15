/**
 * @generated SignedSource<<e220e7e93f46a459fbb5d7b5a4603524>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type ItemUpdateOneItemMutation$variables = {
  id: string;
  text?: string | null | undefined;
};
export type ItemUpdateOneItemMutation$data = {
  readonly updateOneItem: {
    readonly id: string;
    readonly text: string;
  };
};
export type ItemUpdateOneItemMutation = {
  response: ItemUpdateOneItemMutation$data;
  variables: ItemUpdateOneItemMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "id"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "text"
  }
],
v1 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "id",
        "variableName": "id"
      },
      {
        "kind": "Variable",
        "name": "text",
        "variableName": "text"
      }
    ],
    "concreteType": "Item",
    "kind": "LinkedField",
    "name": "updateOneItem",
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
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "ItemUpdateOneItemMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "ItemUpdateOneItemMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "3956596f38c838acac81d29024327c6a",
    "id": null,
    "metadata": {},
    "name": "ItemUpdateOneItemMutation",
    "operationKind": "mutation",
    "text": "mutation ItemUpdateOneItemMutation(\n  $id: ID!\n  $text: String\n) {\n  updateOneItem(id: $id, text: $text) {\n    id\n    text\n  }\n}\n"
  }
};
})();

(node as any).hash = "3e18e63581fd23938e40853214d3d07d";

export default node;
