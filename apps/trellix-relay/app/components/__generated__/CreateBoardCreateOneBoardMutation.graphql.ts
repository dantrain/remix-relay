/**
 * @generated SignedSource<<36c7dfab40699524677e0a2b456fe0f6>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type CreateBoardCreateOneBoardMutation$variables = {
  connections: ReadonlyArray<string>;
  id: string;
  title: string;
};
export type CreateBoardCreateOneBoardMutation$data = {
  readonly createOneBoard: {
    readonly id: string;
    readonly " $fragmentSpreads": FragmentRefs<"BoardCardFragment">;
  };
};
export type CreateBoardCreateOneBoardMutation = {
  response: CreateBoardCreateOneBoardMutation$data;
  variables: CreateBoardCreateOneBoardMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "connections"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "id"
},
v2 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "title"
},
v3 = [
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
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/),
      (v2/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "CreateBoardCreateOneBoardMutation",
    "selections": [
      {
        "alias": null,
        "args": (v3/*: any*/),
        "concreteType": "Board",
        "kind": "LinkedField",
        "name": "createOneBoard",
        "plural": false,
        "selections": [
          (v4/*: any*/),
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "BoardCardFragment"
          }
        ],
        "storageKey": null
      }
    ],
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [
      (v1/*: any*/),
      (v2/*: any*/),
      (v0/*: any*/)
    ],
    "kind": "Operation",
    "name": "CreateBoardCreateOneBoardMutation",
    "selections": [
      {
        "alias": null,
        "args": (v3/*: any*/),
        "concreteType": "Board",
        "kind": "LinkedField",
        "name": "createOneBoard",
        "plural": false,
        "selections": [
          (v4/*: any*/),
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "title",
            "storageKey": null
          }
        ],
        "storageKey": null
      },
      {
        "alias": null,
        "args": (v3/*: any*/),
        "filters": null,
        "handle": "prependNode",
        "key": "",
        "kind": "LinkedHandle",
        "name": "createOneBoard",
        "handleArgs": [
          {
            "kind": "Variable",
            "name": "connections",
            "variableName": "connections"
          },
          {
            "kind": "Literal",
            "name": "edgeTypeName",
            "value": "UserBoardConnectionEdge"
          }
        ]
      }
    ]
  },
  "params": {
    "cacheID": "9db8200039856b5968b407e05fb8a418",
    "id": null,
    "metadata": {},
    "name": "CreateBoardCreateOneBoardMutation",
    "operationKind": "mutation",
    "text": "mutation CreateBoardCreateOneBoardMutation(\n  $id: ID!\n  $title: String!\n) {\n  createOneBoard(id: $id, title: $title) {\n    id\n    ...BoardCardFragment\n  }\n}\n\nfragment BoardCardFragment on Board {\n  id\n  title\n}\n"
  }
};
})();

(node as any).hash = "656fdf5928c3a1dafabffb1ddc01c45d";

export default node;
