/**
 * @generated SignedSource<<aef3d849a514e466033973aa7c990371>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type plannerPageResidentsQuery$variables = {};
export type plannerPageResidentsQuery$data = {
  readonly residents: {
    readonly nodes: ReadonlyArray<{
      readonly firstName: string | null;
      readonly houseNumber: string;
      readonly id: any;
      readonly lastName: string | null;
    }> | null;
  } | null;
};
export type plannerPageResidentsQuery = {
  response: plannerPageResidentsQuery$data;
  variables: plannerPageResidentsQuery$variables;
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
    "name": "plannerPageResidentsQuery",
    "selections": (v0/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "plannerPageResidentsQuery",
    "selections": (v0/*: any*/)
  },
  "params": {
    "cacheID": "fb07111f9de3f720ae86b0843633c52f",
    "id": null,
    "metadata": {},
    "name": "plannerPageResidentsQuery",
    "operationKind": "query",
    "text": "query plannerPageResidentsQuery {\n  residents {\n    nodes {\n      id\n      firstName\n      lastName\n      houseNumber\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "019fc3fa82521759acab3011f3e40f3d";

export default node;
