/**
 * @generated SignedSource<<d6f3af8f85ebfba335749cac9d5a0a4a>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type residentSelectQuery$variables = {};
export type residentSelectQuery$data = {
  readonly residents: {
    readonly nodes: ReadonlyArray<{
      readonly firstName: string | null;
      readonly houseNumber: string;
      readonly id: any;
      readonly lastName: string | null;
    }> | null;
  } | null;
};
export type residentSelectQuery = {
  response: residentSelectQuery$data;
  variables: residentSelectQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Literal",
        "name": "first",
        "value": 50
      }
    ],
    "concreteType": "ResidentsConnection",
    "kind": "LinkedField",
    "name": "residents",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "Resident",
        "kind": "LinkedField",
        "name": "nodes",
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
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "houseNumber",
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ],
    "storageKey": "residents(first:50)"
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
    "cacheID": "2e1dd8adf6b3aeab378d47d6e960c14d",
    "id": null,
    "metadata": {},
    "name": "residentSelectQuery",
    "operationKind": "query",
    "text": "query residentSelectQuery {\n  residents(first: 50) {\n    nodes {\n      id\n      firstName\n      lastName\n      houseNumber\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "fdaf1734f5c8f41764ca4244d271a774";

export default node;
