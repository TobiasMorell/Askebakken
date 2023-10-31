/**
 * @generated SignedSource<<d44a3c85d5f63f20832d808de924407f>>
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
    "args": null,
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
    "cacheID": "f6f16c1e8a9ad76aa66cf8cb8a6ac502",
    "id": null,
    "metadata": {},
    "name": "residentSelectQuery",
    "operationKind": "query",
    "text": "query residentSelectQuery {\n  residents {\n    nodes {\n      id\n      firstName\n      lastName\n      houseNumber\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "8d3da7f3c006ca460364f55ccb603390";

export default node;
