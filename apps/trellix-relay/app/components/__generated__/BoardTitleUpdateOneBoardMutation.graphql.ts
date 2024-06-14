/**
 * @generated SignedSource<<b9bfd649826988086614c072730675a8>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type BoardTitleUpdateOneBoardMutation$variables = {
  id: string;
  name: string;
};
export type BoardTitleUpdateOneBoardMutation$data = {
  readonly updateOneBoard: {
    readonly id: string;
    readonly name: string;
  };
};
export type BoardTitleUpdateOneBoardMutation = {
  response: BoardTitleUpdateOneBoardMutation$data;
  variables: BoardTitleUpdateOneBoardMutation$variables;
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
    "name": "name"
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
        "name": "name",
        "variableName": "name"
      }
    ],
    "concreteType": "Board",
    "kind": "LinkedField",
    "name": "updateOneBoard",
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
    "name": "BoardTitleUpdateOneBoardMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "BoardTitleUpdateOneBoardMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "086fcb4585680fb23f2e27c95102ae88",
    "id": null,
    "metadata": {},
    "name": "BoardTitleUpdateOneBoardMutation",
    "operationKind": "mutation",
    "text": "mutation BoardTitleUpdateOneBoardMutation(\n  $id: ID!\n  $name: String!\n) {\n  updateOneBoard(id: $id, name: $name) {\n    id\n    name\n  }\n}\n"
  }
};
})();

(node as any).hash = "0c19d00fd126d6fcc38d30dfaa8e344f";

export default node;
