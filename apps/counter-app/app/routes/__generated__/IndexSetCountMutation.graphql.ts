/**
 * @generated SignedSource<<585627cea9b13eb2c96698d365a3b1f3>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type IndexSetCountMutation$variables = {
  count: number;
};
export type IndexSetCountMutation$data = {
  readonly setCount: {
    readonly count: number;
    readonly id: string;
  };
};
export type IndexSetCountMutation = {
  response: IndexSetCountMutation$data;
  variables: IndexSetCountMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "count"
  }
],
v1 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "count",
        "variableName": "count"
      }
    ],
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
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "IndexSetCountMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "IndexSetCountMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "3dbca128af1f1f78203e4d723d689ef4",
    "id": null,
    "metadata": {},
    "name": "IndexSetCountMutation",
    "operationKind": "mutation",
    "text": "mutation IndexSetCountMutation(\n  $count: Int!\n) {\n  setCount(count: $count) {\n    id\n    count\n  }\n}\n"
  }
};
})();

(node as any).hash = "b61efaa3612430fe03c5431de6b67582";

export default node;
