/**
 * @generated SignedSource<<2bfaf9ade409b714fe2c5114f482ec89>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type boardQuery$variables = {
  id: string;
};
export type boardQuery$data = {
  readonly board: {
    readonly id: string;
    readonly name: string;
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
v1 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "id",
        "variableName": "id"
      }
    ],
    "concreteType": "Board",
    "kind": "LinkedField",
    "name": "board",
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
        "name": "name",
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
    "name": "boardQuery",
    "selections": (v1/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "boardQuery",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "dc8e80981af4702a0b387fb44fab5bd0",
    "id": null,
    "metadata": {},
    "name": "boardQuery",
    "operationKind": "query",
    "text": "query boardQuery(\n  $id: ID!\n) {\n  board(id: $id) {\n    id\n    name\n  }\n}\n"
  }
};
})();

(node as any).hash = "a2bfa09ef2d3eaf6908f7bb4c19037b8";

export default node;
