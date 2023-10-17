/**
 * @generated SignedSource<<0540c70f2d0a5bafb4f20a2077353f6c>>
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
      readonly child: boolean;
      readonly firstName: string | null;
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
    "cacheID": "316120ac61abf376413d96eebb1ccdc2",
    "id": null,
    "metadata": {},
    "name": "residentSelectQuery",
    "operationKind": "query",
    "text": "query residentSelectQuery {\n  residents {\n    nodes {\n      id\n      firstName\n      lastName\n      child\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "59740c4be128e6ad3790839b83ef9973";

export default node;
