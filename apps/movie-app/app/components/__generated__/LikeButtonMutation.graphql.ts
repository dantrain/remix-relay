/**
 * @generated SignedSource<<1d6ff6e64dc8fcbe844be6e803336ac8>>
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
    readonly liked: boolean;
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
        "name": "liked",
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
    "cacheID": "3a5dd2e8e527e7b033a8228a2f75ad4d",
    "id": null,
    "metadata": {},
    "name": "LikeButtonMutation",
    "operationKind": "mutation",
    "text": "mutation LikeButtonMutation(\n  $id: ID!\n  $liked: Boolean!\n) {\n  setLikedMovie(id: $id, liked: $liked) {\n    id\n    liked\n  }\n}\n"
  }
};
})();

(node as any).hash = "664e86f0c7d91b82bd7492ee43729d90";

export default node;
