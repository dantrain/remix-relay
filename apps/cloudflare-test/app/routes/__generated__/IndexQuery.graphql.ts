/**
 * @generated SignedSource<<b9c524b63cd33ae154d1b06bcc692828>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type IndexQuery$variables = Record<PropertyKey, never>;
export type IndexQuery$data = {
  readonly hello: string;
  readonly " $fragmentSpreads": FragmentRefs<"DeferTestFragment">;
};
export type IndexQuery = {
  response: IndexQuery$data;
  variables: IndexQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "hello",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "IndexQuery",
    "selections": [
      (v0/*: any*/),
      {
        "kind": "Defer",
        "selections": [
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "DeferTestFragment"
          }
        ]
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "IndexQuery",
    "selections": [
      (v0/*: any*/),
      {
        "if": null,
        "kind": "Defer",
        "label": "IndexQuery$defer$DeferTestFragment",
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "Test",
            "kind": "LinkedField",
            "name": "test",
            "plural": false,
            "selections": [
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
                "name": "id",
                "storageKey": null
              }
            ],
            "storageKey": null
          }
        ]
      }
    ]
  },
  "params": {
    "cacheID": "d34058d31da03e4c5ebe7ae3bfa67541",
    "id": null,
    "metadata": {},
    "name": "IndexQuery",
    "operationKind": "query",
    "text": "query IndexQuery {\n  hello\n  ...DeferTestFragment @defer(label: \"IndexQuery$defer$DeferTestFragment\")\n}\n\nfragment DeferTestFragment on Query {\n  test {\n    title\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "1f46ba4e802454621c6d2107c29fc3fb";

export default node;
