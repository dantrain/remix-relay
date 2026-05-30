/**
 * @generated SignedSource<<1f99a2928cf79e790ce957f16a83e507>>
 * @lightSyntaxTransform
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type BoardCardDeleteOneBoardMutation$variables = {
  connections: ReadonlyArray<string>;
  id: string;
};
export type BoardCardDeleteOneBoardMutation$data = {
  readonly deleteOneBoard: {
    readonly id: string;
  } | null | undefined;
};
export type BoardCardDeleteOneBoardMutation = {
  response: BoardCardDeleteOneBoardMutation$data;
  variables: BoardCardDeleteOneBoardMutation$variables;
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
v2 = [
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "id"
  }
],
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*:: as any*/),
      (v1/*:: as any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "BoardCardDeleteOneBoardMutation",
    "selections": [
      {
        "alias": null,
        "args": (v2/*:: as any*/),
        "concreteType": "Board",
        "kind": "LinkedField",
        "name": "deleteOneBoard",
        "plural": false,
        "selections": [
          (v3/*:: as any*/)
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
      (v1/*:: as any*/),
      (v0/*:: as any*/)
    ],
    "kind": "Operation",
    "name": "BoardCardDeleteOneBoardMutation",
    "selections": [
      {
        "alias": null,
        "args": (v2/*:: as any*/),
        "concreteType": "Board",
        "kind": "LinkedField",
        "name": "deleteOneBoard",
        "plural": false,
        "selections": [
          (v3/*:: as any*/),
          {
            "alias": null,
            "args": null,
            "filters": null,
            "handle": "deleteEdge",
            "key": "",
            "kind": "ScalarHandle",
            "name": "id",
            "handleArgs": [
              {
                "kind": "Variable",
                "name": "connections",
                "variableName": "connections"
              }
            ]
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "7201b337715e6d2cd82b13b23387b17d",
    "id": null,
    "metadata": {},
    "name": "BoardCardDeleteOneBoardMutation",
    "operationKind": "mutation",
    "text": "mutation BoardCardDeleteOneBoardMutation(\n  $id: ID!\n) {\n  deleteOneBoard(id: $id) {\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "eacb2543890b39d3a5c2d23044b17df9";

export default node;
