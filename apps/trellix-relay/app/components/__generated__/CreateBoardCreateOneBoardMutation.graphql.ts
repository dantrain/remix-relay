/**
 * @generated SignedSource<<89ad52ca7cd3a661e1c190bc00353c0d>>
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
  name: string;
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
  "name": "name"
},
v3 = [
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
            "name": "name",
            "storageKey": null
          }
        ],
        "storageKey": null
      },
      {
        "alias": null,
        "args": (v3/*: any*/),
        "filters": null,
        "handle": "appendNode",
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
            "value": "BoardConnectionEdge"
          }
        ]
      }
    ]
  },
  "params": {
    "cacheID": "ad5e67153a5b18096a6fa364a26b203d",
    "id": null,
    "metadata": {},
    "name": "CreateBoardCreateOneBoardMutation",
    "operationKind": "mutation",
    "text": "mutation CreateBoardCreateOneBoardMutation(\n  $id: ID!\n  $name: String!\n) {\n  createOneBoard(id: $id, name: $name) {\n    id\n    ...BoardCardFragment\n  }\n}\n\nfragment BoardCardFragment on Board {\n  id\n  name\n}\n"
  }
};
})();

(node as any).hash = "77ab120681a439a6b408a774f03f544a";

export default node;
