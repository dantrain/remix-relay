/**
 * @generated SignedSource<<7d7f9475358a7e3b5d2a4de89c008f06>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type ColumnTitleUpdateOneColumnMutation$variables = {
  id: string;
  title: string;
};
export type ColumnTitleUpdateOneColumnMutation$data = {
  readonly updateOneColumn: {
    readonly id: string;
    readonly title: string | null | undefined;
  } | null | undefined;
};
export type ColumnTitleUpdateOneColumnMutation = {
  response: ColumnTitleUpdateOneColumnMutation$data;
  variables: ColumnTitleUpdateOneColumnMutation$variables;
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
    "concreteType": "Column",
    "kind": "LinkedField",
    "name": "updateOneColumn",
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
    "name": "ColumnTitleUpdateOneColumnMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "ColumnTitleUpdateOneColumnMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "e256d41df08a53f64f70dbd9bf7449b4",
    "id": null,
    "metadata": {},
    "name": "ColumnTitleUpdateOneColumnMutation",
    "operationKind": "mutation",
    "text": "mutation ColumnTitleUpdateOneColumnMutation(\n  $id: ID!\n  $title: String!\n) {\n  updateOneColumn(id: $id, title: $title) {\n    id\n    title\n  }\n}\n"
  }
};
})();

(node as any).hash = "d22830c6914ce5a1cac8fba24096e3a0";

export default node;
