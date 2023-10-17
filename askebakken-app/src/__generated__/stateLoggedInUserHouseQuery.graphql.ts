/**
 * @generated SignedSource<<29abc9ea6b1d71b39399369126748e56>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type stateLoggedInUserHouseQuery$variables = {};
export type stateLoggedInUserHouseQuery$data = {
  readonly me: {
    readonly houseNumber: string;
    readonly id: any;
  };
};
export type stateLoggedInUserHouseQuery = {
  response: stateLoggedInUserHouseQuery$data;
  variables: stateLoggedInUserHouseQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "alias": null,
    "args": null,
    "concreteType": "Resident",
    "kind": "LinkedField",
    "name": "me",
    "plural": false,
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
        "name": "houseNumber",
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
    "name": "stateLoggedInUserHouseQuery",
    "selections": (v0/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "stateLoggedInUserHouseQuery",
    "selections": (v0/*: any*/)
  },
  "params": {
    "cacheID": "15f3d634270afc08dcd72e7fcf343832",
    "id": null,
    "metadata": {},
    "name": "stateLoggedInUserHouseQuery",
    "operationKind": "query",
    "text": "query stateLoggedInUserHouseQuery {\n  me {\n    id\n    houseNumber\n  }\n}\n"
  }
};
})();

(node as any).hash = "a5f28ea91380af250d2348206df90b37";

export default node;
