/**
 * @generated SignedSource<<837aff3d51026fac4315fee9232b5928>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type BoardTitleUpdateOneBoardMutation$variables = {
  id: string;
  title: string;
};
export type BoardTitleUpdateOneBoardMutation$data = {
  readonly updateOneBoard: {
    readonly id: string;
    readonly title: string;
  } | null | undefined;
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
    "cacheID": "1896a9045696dfe3778c4b87f1a1b67e",
    "id": null,
    "metadata": {},
    "name": "BoardTitleUpdateOneBoardMutation",
    "operationKind": "mutation",
    "text": "mutation BoardTitleUpdateOneBoardMutation(\n  $id: ID!\n  $title: String!\n) {\n  updateOneBoard(id: $id, title: $title) {\n    id\n    title\n  }\n}\n"
  }
};
})();

(node as any).hash = "7aac151d48c6573d6014683425cf3362";

export default node;
