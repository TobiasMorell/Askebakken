/**
 * @generated SignedSource<<665d2f9eec29b83aa4e332696dbe06b4>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type loggedInUser_MeQuery$variables = {};
export type loggedInUser_MeQuery$data = {
  readonly me: {
    readonly firstName: string | null;
    readonly id: any;
    readonly lastName: string | null;
  };
};
export type loggedInUser_MeQuery = {
  response: loggedInUser_MeQuery$data;
  variables: loggedInUser_MeQuery$variables;
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
    "name": "loggedInUser_MeQuery",
    "selections": (v0/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "loggedInUser_MeQuery",
    "selections": (v0/*: any*/)
  },
  "params": {
    "cacheID": "5ad4f37f9a8554b7be25f813226180ad",
    "id": null,
    "metadata": {},
    "name": "loggedInUser_MeQuery",
    "operationKind": "query",
    "text": "query loggedInUser_MeQuery {\n  me {\n    id\n    firstName\n    lastName\n  }\n}\n"
  }
};
})();

(node as any).hash = "0351c2b045807d888d20401dcc6247eb";

export default node;
