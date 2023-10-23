/**
 * @generated SignedSource<<0917a9bb47b12d8bb1d85838f7529738>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type menuPlannerState_ResidentsInHouseQuery$variables = {
  houseNumber?: string | null;
};
export type menuPlannerState_ResidentsInHouseQuery$data = {
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
export type menuPlannerState_ResidentsInHouseQuery = {
  response: menuPlannerState_ResidentsInHouseQuery$data;
  variables: menuPlannerState_ResidentsInHouseQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "houseNumber"
  }
],
v1 = [
  {
    "alias": null,
    "args": [
      {
        "fields": [
          {
            "fields": [
              {
                "kind": "Variable",
                "name": "eq",
                "variableName": "houseNumber"
              }
            ],
            "kind": "ObjectValue",
            "name": "houseNumber"
          }
        ],
        "kind": "ObjectValue",
        "name": "where"
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
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "menuPlannerState_ResidentsInHouseQuery",
    "selections": (v1/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "menuPlannerState_ResidentsInHouseQuery",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "aa000fe2079f63479c52d5ed6c155c8b",
    "id": null,
    "metadata": {},
    "name": "menuPlannerState_ResidentsInHouseQuery",
    "operationKind": "query",
    "text": "query menuPlannerState_ResidentsInHouseQuery(\n  $houseNumber: String\n) {\n  residents(where: {houseNumber: {eq: $houseNumber}}) {\n    nodes {\n      id\n      firstName\n      lastName\n      houseNumber\n      child\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "7adf4d252254c2bc2a5afd85f54ea453";

export default node;
