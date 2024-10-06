/**
 * @generated SignedSource<<cd54d5fb4e9e1afe1bb137bd01f48bf2>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type CounterSetCountMutation$variables = {
  count: number;
  id: string;
};
export type CounterSetCountMutation$data = {
  readonly setCount: {
    readonly " $fragmentSpreads": FragmentRefs<"CounterFragment">;
  } | null | undefined;
};
export type CounterSetCountMutation = {
  response: CounterSetCountMutation$data;
  variables: CounterSetCountMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "count"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "id"
},
v2 = [
  {
    "kind": "Variable",
    "name": "count",
    "variableName": "count"
  },
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "id"
  }
];
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "CounterSetCountMutation",
    "selections": [
      {
        "alias": null,
        "args": (v2/*: any*/),
        "concreteType": "Counter",
        "kind": "LinkedField",
        "name": "setCount",
        "plural": false,
        "selections": [
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "CounterFragment"
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
      (v0/*: any*/)
    ],
    "kind": "Operation",
    "name": "CounterSetCountMutation",
    "selections": [
      {
        "alias": null,
        "args": (v2/*: any*/),
        "concreteType": "Counter",
        "kind": "LinkedField",
        "name": "setCount",
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
    ]
  },
  "params": {
    "cacheID": "63eb48d3917c94b32b250e884e161966",
    "id": null,
    "metadata": {},
    "name": "CounterSetCountMutation",
    "operationKind": "mutation",
    "text": "mutation CounterSetCountMutation(\n  $id: ID!\n  $count: Int!\n) {\n  setCount(id: $id, count: $count) {\n    ...CounterFragment\n    id\n  }\n}\n\nfragment CounterFragment on Counter {\n  id\n  count\n}\n"
  }
};
})();

(node as any).hash = "af45179b61d181cc02fbc384c8b3ade5";

export default node;
