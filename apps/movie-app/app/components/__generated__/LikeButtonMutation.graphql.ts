/**
 * @generated SignedSource<<8c85925dc77a8cdaf5c13c4cca94826c>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type LikeButtonMutation$variables = {
  id: string;
  liked: boolean;
};
export type LikeButtonMutation$data = {
  readonly setLikedMovie: {
    readonly id: string;
    readonly likedByViewer: boolean | null | undefined;
  };
};
export type LikeButtonMutation = {
  response: LikeButtonMutation$data;
  variables: LikeButtonMutation$variables;
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
    "name": "liked"
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
        "name": "liked",
        "variableName": "liked"
      }
    ],
    "concreteType": "Movie",
    "kind": "LinkedField",
    "name": "setLikedMovie",
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
        "name": "likedByViewer",
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
    "name": "LikeButtonMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "LikeButtonMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "c96d60584bac1acda979b09546ab816b",
    "id": null,
    "metadata": {},
    "name": "LikeButtonMutation",
    "operationKind": "mutation",
    "text": "mutation LikeButtonMutation(\n  $id: ID!\n  $liked: Boolean!\n) {\n  setLikedMovie(id: $id, liked: $liked) {\n    id\n    likedByViewer\n  }\n}\n"
  }
};
})();

(node as any).hash = "87490031ee59f5e0b28482dea5db99d0";

export default node;
