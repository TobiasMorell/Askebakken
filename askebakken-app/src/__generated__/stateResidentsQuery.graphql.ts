/**
 * @generated SignedSource<<972ef3039113e171cfd61632497e01fd>>
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
    "cacheID": "1e33a84a2b895dd0e9660ac32c349d60",
    "id": null,
    "metadata": {},
    "name": "stateResidentsQuery",
    "operationKind": "query",
    "text": "query stateResidentsQuery {\n  residents {\n    nodes {\n      id\n      firstName\n      lastName\n      houseNumber\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "87d0412e3fd692f2db85fd64c19434de";

export default node;
