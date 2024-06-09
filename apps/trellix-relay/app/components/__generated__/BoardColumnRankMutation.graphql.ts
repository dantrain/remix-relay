/**
 * @generated SignedSource<<5dde2881f950dd5a596426a9fb60407e>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type BoardColumnRankMutation$variables = {
  id: string;
  rank?: string | null | undefined;
};
export type BoardColumnRankMutation$data = {
  readonly updateOneColumn: {
    readonly id: string;
    readonly rank: string;
  };
};
export type BoardColumnRankMutation = {
  response: BoardColumnRankMutation$data;
  variables: BoardColumnRankMutation$variables;
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
    "name": "rank"
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
        "name": "rank",
        "variableName": "rank"
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
        "name": "rank",
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
    "name": "BoardColumnRankMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "BoardColumnRankMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "82a274e69c7fb20007f8e23a46bf64ab",
    "id": null,
    "metadata": {},
    "name": "BoardColumnRankMutation",
    "operationKind": "mutation",
    "text": "mutation BoardColumnRankMutation(\n  $id: ID!\n  $rank: String\n) {\n  updateOneColumn(id: $id, rank: $rank) {\n    id\n    rank\n  }\n}\n"
  }
};
})();

(node as any).hash = "2238d81d19fb5f1cc7cad05b8910b197";

export default node;
