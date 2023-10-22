/**
 * @generated SignedSource<<319b505113f3d137ffc83e3899904c8c>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type menuPlannerState_ResidentsQuery$variables = {};
export type menuPlannerState_ResidentsQuery$data = {
  readonly residents: {
    readonly nodes: ReadonlyArray<{
      readonly child: boolean;
      readonly firstName: string | null;
      readonly houseNumber: string;
      readonly id: any;
      readonly lastName: string | null;
    }> | null;
  } | null;
};
export type menuPlannerState_ResidentsQuery = {
  response: menuPlannerState_ResidentsQuery$data;
  variables: menuPlannerState_ResidentsQuery$variables;
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
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "child",
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
    "name": "menuPlannerState_ResidentsQuery",
    "selections": (v0/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "menuPlannerState_ResidentsQuery",
    "selections": (v0/*: any*/)
  },
  "params": {
    "cacheID": "73b1cb3fc70827c3c9ee239db79685d8",
    "id": null,
    "metadata": {},
    "name": "menuPlannerState_ResidentsQuery",
    "operationKind": "query",
    "text": "query menuPlannerState_ResidentsQuery {\n  residents {\n    nodes {\n      id\n      firstName\n      lastName\n      houseNumber\n      child\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "57e8b042c5076c3cbccd1b4de812b95f";

export default node;
