/**
 * @generated SignedSource<<8f45bd1506bb5d14d818919f4fb2ee9f>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type stateResidentsQuery$variables = {};
export type stateResidentsQuery$data = {
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
export type stateResidentsQuery = {
  response: stateResidentsQuery$data;
  variables: stateResidentsQuery$variables;
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
    "name": "stateResidentsQuery",
    "selections": (v0/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "stateResidentsQuery",
    "selections": (v0/*: any*/)
  },
  "params": {
    "cacheID": "2338ed89d0e75151141f545a927f4ee6",
    "id": null,
    "metadata": {},
    "name": "stateResidentsQuery",
    "operationKind": "query",
    "text": "query stateResidentsQuery {\n  residents {\n    nodes {\n      id\n      firstName\n      lastName\n      houseNumber\n      child\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "a820b200d7dfba70e9b0278bb963b4fb";

export default node;
