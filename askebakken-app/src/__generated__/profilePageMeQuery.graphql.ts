/**
 * @generated SignedSource<<63a0dc9ca38d78e9d138cb675cc8ec31>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type profilePageMeQuery$variables = {};
export type profilePageMeQuery$data = {
  readonly me: {
    readonly birthDate: any;
    readonly firstName: string | null;
    readonly houseNumber: string;
    readonly lastName: string | null;
    readonly username: string;
  };
};
export type profilePageMeQuery = {
  response: profilePageMeQuery$data;
  variables: profilePageMeQuery$variables;
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
        "name": "username",
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
        "name": "birthDate",
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
    "name": "profilePageMeQuery",
    "selections": (v0/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "profilePageMeQuery",
    "selections": (v0/*: any*/)
  },
  "params": {
    "cacheID": "3a67ce1c978b707c2809b59ea5be26a6",
    "id": null,
    "metadata": {},
    "name": "profilePageMeQuery",
    "operationKind": "query",
    "text": "query profilePageMeQuery {\n  me {\n    firstName\n    lastName\n    username\n    houseNumber\n    birthDate\n  }\n}\n"
  }
};
})();

(node as any).hash = "eb6c583ef542e46ea15fb48cc20a5007";

export default node;
