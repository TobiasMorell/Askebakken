/**
 * @generated SignedSource<<995b61eaeb15b33df73841de912b68f0>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type stateResidentsInHouseQuery$variables = {
  houseNumber?: string | null;
};
export type stateResidentsInHouseQuery$data = {
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
export type stateResidentsInHouseQuery = {
  response: stateResidentsInHouseQuery$data;
  variables: stateResidentsInHouseQuery$variables;
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
    "name": "stateResidentsInHouseQuery",
    "selections": (v1/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "stateResidentsInHouseQuery",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "e5ffe19759d6ad1ab0bc73cc4cf19af0",
    "id": null,
    "metadata": {},
    "name": "stateResidentsInHouseQuery",
    "operationKind": "query",
    "text": "query stateResidentsInHouseQuery(\n  $houseNumber: String\n) {\n  residents(where: {houseNumber: {eq: $houseNumber}}) {\n    nodes {\n      id\n      firstName\n      lastName\n      houseNumber\n      child\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "ba51729639f4577f31838092399f3179";

export default node;
