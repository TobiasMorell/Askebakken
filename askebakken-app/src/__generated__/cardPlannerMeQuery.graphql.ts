/**
 * @generated SignedSource<<d0f06cab766eedb042e99784c2aea122>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type cardPlannerMeQuery$variables = {};
export type cardPlannerMeQuery$data = {
  readonly me: {
    readonly firstName: string | null;
    readonly id: any;
    readonly lastName: string | null;
  };
};
export type cardPlannerMeQuery = {
  response: cardPlannerMeQuery$data;
  variables: cardPlannerMeQuery$variables;
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
];
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "cardPlannerMeQuery",
    "selections": (v0/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "cardPlannerMeQuery",
    "selections": (v0/*: any*/)
  },
  "params": {
    "cacheID": "475597cc1f94139c4fbd920b36e0e12d",
    "id": null,
    "metadata": {},
    "name": "cardPlannerMeQuery",
    "operationKind": "query",
    "text": "query cardPlannerMeQuery {\n  me {\n    id\n    firstName\n    lastName\n  }\n}\n"
  }
};
})();

(node as any).hash = "35e03c9033a21a58094103d3c0cd9019";

export default node;
