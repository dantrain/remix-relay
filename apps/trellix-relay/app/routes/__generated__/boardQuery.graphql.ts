/**
 * @generated SignedSource<<a6a7d51e3715830dbd437755d9968307>>
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
    "cacheID": "d733f7aad807daa011ec638f02361319",
    "id": null,
    "metadata": {},
    "name": "boardQuery",
    "operationKind": "query",
    "text": "query boardQuery(\n  $id: ID!\n) {\n  board(id: $id) {\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "46f1e3a1a4d461a1ddeb7cac7cc3f03b";

export default node;
