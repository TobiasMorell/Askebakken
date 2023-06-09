/**
 * @generated SignedSource<<01d54a5a95d6835eccdc48937f561a6d>>
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
    "cacheID": "497aa2f27e96294ca442244c08450dfb",
    "id": null,
    "metadata": {},
    "name": "residentSelectQuery",
    "operationKind": "query",
    "text": "query residentSelectQuery {\n  residents {\n    nodes {\n      id\n      firstName\n      lastName\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "71b6e3661b355bed8fd89d44e8b34fb9";

export default node;
