/**
 * @generated SignedSource<<01c799ff4ac806a0d1c607424ee5ad61>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type topBarMeQuery$variables = {};
export type topBarMeQuery$data = {
  readonly me: {
    readonly firstName: string | null;
    readonly lastName: string | null;
  };
};
export type topBarMeQuery = {
  response: topBarMeQuery$data;
  variables: topBarMeQuery$variables;
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
    "name": "topBarMeQuery",
    "selections": (v0/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "topBarMeQuery",
    "selections": (v0/*: any*/)
  },
  "params": {
    "cacheID": "00e930dda159a6bf9cf7fa312121194d",
    "id": null,
    "metadata": {},
    "name": "topBarMeQuery",
    "operationKind": "query",
    "text": "query topBarMeQuery {\n  me {\n    firstName\n    lastName\n  }\n}\n"
  }
};
})();

(node as any).hash = "a9e9980041a0dbbc80cca71746a53d58";

export default node;
