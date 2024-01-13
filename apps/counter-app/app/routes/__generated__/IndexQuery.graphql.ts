/**
 * @generated SignedSource<<1fc85f3cdb692db5769616c5f8eea6fe>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type IndexQuery$variables = Record<PropertyKey, never>;
export type IndexQuery$data = {
  readonly count: number;
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
    "kind": "ScalarField",
    "name": "count",
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
    "cacheID": "48566729e5ddcc46bbf51efab2f79157",
    "id": null,
    "metadata": {},
    "name": "IndexQuery",
    "operationKind": "query",
    "text": "query IndexQuery {\n  count\n}\n"
  }
};
})();

(node as any).hash = "5bd202c7987e0335b5736becda5892ae";

export default node;
