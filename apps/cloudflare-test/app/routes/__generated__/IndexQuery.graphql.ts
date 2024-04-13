/**
 * @generated SignedSource<<d27671d10eca9772af3c7a45dadd063e>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type IndexQuery$variables = Record<PropertyKey, never>;
export type IndexQuery$data = {
  readonly hello: string;
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
    "name": "hello",
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
    "cacheID": "d748e32d7b08f2a0bf40cf7f646ba7d6",
    "id": null,
    "metadata": {},
    "name": "IndexQuery",
    "operationKind": "query",
    "text": "query IndexQuery {\n  hello\n}\n"
  }
};
})();

(node as any).hash = "f938201dc23f810bdc1800dce5c5f6db";

export default node;
