/**
 * @generated SignedSource<<ca4d4b898ea0f3c907e664e9d56e21a6>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type residentSelectQuery$variables = {};
export type residentSelectQuery$data = {
  readonly residents: ReadonlyArray<{
    readonly firstName: string | null;
    readonly id: any;
    readonly lastName: string | null;
  }>;
};
export type residentSelectQuery = {
  response: residentSelectQuery$data;
  variables: residentSelectQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "alias": null,
    "args": null,
    "concreteType": "Resident",
    "kind": "LinkedField",
    "name": "residents",
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
        "name": "firstName",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "lastName",
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
    "name": "residentSelectQuery",
    "selections": (v0/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "residentSelectQuery",
    "selections": (v0/*: any*/)
  },
  "params": {
    "cacheID": "c7d7565b913d9f69397d68b3b0136a48",
    "id": null,
    "metadata": {},
    "name": "residentSelectQuery",
    "operationKind": "query",
    "text": "query residentSelectQuery {\n  residents {\n    id\n    firstName\n    lastName\n  }\n}\n"
  }
};
})();

(node as any).hash = "2a742317f8c5f86373403ec0256ceb1b";

export default node;
