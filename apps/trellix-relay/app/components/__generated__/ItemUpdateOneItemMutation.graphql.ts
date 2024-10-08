/**
 * @generated SignedSource<<27d3f20aca0084e8a95e96880d3c3941>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type ItemUpdateOneItemMutation$variables = {
  id: string;
  title?: string | null | undefined;
};
export type ItemUpdateOneItemMutation$data = {
  readonly updateOneItem: {
    readonly id: string;
    readonly title: string;
  } | null | undefined;
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
    "name": "title"
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
        "name": "title",
        "variableName": "title"
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
        "name": "title",
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
    "cacheID": "2f8d7db1ffe744b227d9058810906cbc",
    "id": null,
    "metadata": {},
    "name": "ItemUpdateOneItemMutation",
    "operationKind": "mutation",
    "text": "mutation ItemUpdateOneItemMutation(\n  $id: ID!\n  $title: String\n) {\n  updateOneItem(id: $id, title: $title) {\n    id\n    title\n  }\n}\n"
  }
};
})();

(node as any).hash = "9252c057f3bc4bb034c8c9ba2e155b15";

export default node;
