/**
 * @generated SignedSource<<e105236a83207ea5cb14ce95b421ecf2>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type IndexQuery$variables = Record<PropertyKey, never>;
export type IndexQuery$data = {
  readonly movies: ReadonlyArray<{
    readonly boxOffice: string;
    readonly criticScore: number;
    readonly id: string;
    readonly title: string;
  }>;
};
export type IndexQuery = {
  response: IndexQuery$data;
  variables: IndexQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "alias": null,
    "args": null,
    "concreteType": "Movie",
    "kind": "LinkedField",
    "name": "movies",
    "plural": true,
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
        "name": "criticScore",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "title",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "boxOffice",
        "storageKey": null
      }
    ],
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "IndexQuery",
    "selections": (v0/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "IndexQuery",
    "selections": (v0/*: any*/)
  },
  "params": {
    "cacheID": "4ae0a926cc0307f368e082b5a41bdb3e",
    "id": null,
    "metadata": {},
    "name": "IndexQuery",
    "operationKind": "query",
    "text": "query IndexQuery {\n  movies {\n    id\n    criticScore\n    title\n    boxOffice\n  }\n}\n"
  }
};
})();

(node as any).hash = "9d2e56f4ed6a2a90c179b8d84feb586d";

export default node;
