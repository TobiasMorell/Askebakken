/**
 * @generated SignedSource<<837c8e98e9ca047b1c92d422e3868f6e>>
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
    "storageKey": "residents(first:50)"
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
    "cacheID": "dff3242d799ddb18c4b3dcbfaf010315",
    "id": null,
    "metadata": {},
    "name": "menuPlannerState_ResidentsQuery",
    "operationKind": "query",
    "text": "query menuPlannerState_ResidentsQuery {\n  residents(first: 50) {\n    nodes {\n      id\n      firstName\n      lastName\n      houseNumber\n      child\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "2662878f93acda76ed5838e77f3612a3";

export default node;
