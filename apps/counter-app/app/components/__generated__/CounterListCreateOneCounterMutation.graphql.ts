/**
 * @generated SignedSource<<5a6dc456185c0d07d99d91590120ceaa>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type CounterListCreateOneCounterMutation$variables = {
  connections: ReadonlyArray<string>;
  id: string;
};
export type CounterListCreateOneCounterMutation$data = {
  readonly createOneCounter: {
    readonly id: string;
    readonly " $fragmentSpreads": FragmentRefs<"CounterFragment">;
  };
};
export type CounterListCreateOneCounterMutation = {
  response: CounterListCreateOneCounterMutation$data;
  variables: CounterListCreateOneCounterMutation$variables;
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
      (v0/*: any*/),
      (v1/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "CounterListCreateOneCounterMutation",
    "selections": [
      {
        "alias": null,
        "args": (v2/*: any*/),
        "concreteType": "Counter",
        "kind": "LinkedField",
        "name": "createOneCounter",
        "plural": false,
        "selections": [
          (v3/*: any*/),
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
    "name": "CounterListCreateOneCounterMutation",
    "selections": [
      {
        "alias": null,
        "args": (v2/*: any*/),
        "concreteType": "Counter",
        "kind": "LinkedField",
        "name": "createOneCounter",
        "plural": false,
        "selections": [
          (v3/*: any*/),
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "count",
            "storageKey": null
          }
        ],
        "storageKey": null
      },
      {
        "alias": null,
        "args": (v2/*: any*/),
        "filters": null,
        "handle": "appendNode",
        "key": "",
        "kind": "LinkedHandle",
        "name": "createOneCounter",
        "handleArgs": [
          {
            "kind": "Variable",
            "name": "connections",
            "variableName": "connections"
          },
          {
            "kind": "Literal",
            "name": "edgeTypeName",
            "value": "UserCounterConnectionEdge"
          }
        ]
      }
    ]
  },
  "params": {
    "cacheID": "059afebf23c601e393c908d208cd7519",
    "id": null,
    "metadata": {},
    "name": "CounterListCreateOneCounterMutation",
    "operationKind": "mutation",
    "text": "mutation CounterListCreateOneCounterMutation(\n  $id: ID!\n) {\n  createOneCounter(id: $id) {\n    id\n    ...CounterFragment\n  }\n}\n\nfragment CounterFragment on Counter {\n  id\n  count\n}\n"
  }
};
})();

(node as any).hash = "6e92d95fa47ac320e83f204e3ab4b7fe";

export default node;
