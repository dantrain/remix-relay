/**
 * @generated SignedSource<<f171bc18351835ff98459f053345fe6f>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type CounterDeleteOneCounterMutation$variables = {
  connections: ReadonlyArray<string>;
  id: string;
};
export type CounterDeleteOneCounterMutation$data = {
  readonly deleteOneCounter: {
    readonly id: string;
  } | null | undefined;
};
export type CounterDeleteOneCounterMutation = {
  response: CounterDeleteOneCounterMutation$data;
  variables: CounterDeleteOneCounterMutation$variables;
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
    "name": "CounterDeleteOneCounterMutation",
    "selections": [
      {
        "alias": null,
        "args": (v2/*: any*/),
        "concreteType": "Counter",
        "kind": "LinkedField",
        "name": "deleteOneCounter",
        "plural": false,
        "selections": [
          (v3/*: any*/)
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
    "name": "CounterDeleteOneCounterMutation",
    "selections": [
      {
        "alias": null,
        "args": (v2/*: any*/),
        "concreteType": "Counter",
        "kind": "LinkedField",
        "name": "deleteOneCounter",
        "plural": false,
        "selections": [
          (v3/*: any*/),
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
    "cacheID": "f2f3b43fa1eaa44df92abaf52c4bf725",
    "id": null,
    "metadata": {},
    "name": "CounterDeleteOneCounterMutation",
    "operationKind": "mutation",
    "text": "mutation CounterDeleteOneCounterMutation(\n  $id: ID!\n) {\n  deleteOneCounter(id: $id) {\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "c634dc7e5f1249dd312796f8964c4fea";

export default node;
