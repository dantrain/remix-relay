/**
 * @generated SignedSource<<82b637ed5398330bca38d1cfdbf2c65b>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type IndexQuery$variables = Record<PropertyKey, never>;
export type IndexQuery$data = {
  readonly counter: {
    readonly count: number;
    readonly id: string;
  };
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
    "concreteType": "Counter",
    "kind": "LinkedField",
    "name": "counter",
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
        "name": "count",
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
    "cacheID": "f099c3b3148031e7285cee9461942245",
    "id": null,
    "metadata": {},
    "name": "IndexQuery",
    "operationKind": "query",
    "text": "query IndexQuery {\n  counter {\n    id\n    count\n  }\n}\n"
  }
};
})();

(node as any).hash = "e85ed9efeb04a74f111fc79cef7f8068";

export default node;
