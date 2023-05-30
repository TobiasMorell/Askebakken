/**
 * @generated SignedSource<<5b6536438b094ac0a235215a780b2a31>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type stateResidentsQuery$variables = {};
export type stateResidentsQuery$data = {
  readonly residents: ReadonlyArray<{
    readonly child: boolean;
    readonly firstName: string | null;
    readonly houseNumber: string;
    readonly id: any;
    readonly lastName: string | null;
  }>;
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
    "concreteType": "Resident",
    "kind": "LinkedField",
    "name": "residents",
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
    "cacheID": "1b20acdbce41ebd4b342b63e34104d46",
    "id": null,
    "metadata": {},
    "name": "stateResidentsQuery",
    "operationKind": "query",
    "text": "query stateResidentsQuery {\n  residents {\n    id\n    firstName\n    lastName\n    houseNumber\n    child\n  }\n}\n"
  }
};
})();

(node as any).hash = "426d86ca8ab9db94b96fddab0068012a";

export default node;
