/**
 * @generated SignedSource<<89c64b7ea261ca4d7fa0effa57e9382e>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type loginPageAuthenticateMutation$variables = {
  password: string;
  username: string;
};
export type loginPageAuthenticateMutation$data = {
  readonly authenticate: {
    readonly token: string;
  };
};
export type loginPageAuthenticateMutation = {
  response: loginPageAuthenticateMutation$data;
  variables: loginPageAuthenticateMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "password"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "username"
},
v2 = [
  {
    "alias": null,
    "args": [
      {
        "fields": [
          {
            "kind": "Variable",
            "name": "password",
            "variableName": "password"
          },
          {
            "kind": "Variable",
            "name": "username",
            "variableName": "username"
          }
        ],
        "kind": "ObjectValue",
        "name": "authenticateInput"
      }
    ],
    "concreteType": "AuthenticateResult",
    "kind": "LinkedField",
    "name": "authenticate",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "token",
        "storageKey": null
      }
    ],
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "loginPageAuthenticateMutation",
    "selections": (v2/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [
      (v1/*: any*/),
      (v0/*: any*/)
    ],
    "kind": "Operation",
    "name": "loginPageAuthenticateMutation",
    "selections": (v2/*: any*/)
  },
  "params": {
    "cacheID": "c6b42b9fcb8099b2e2d9ce34556f1985",
    "id": null,
    "metadata": {},
    "name": "loginPageAuthenticateMutation",
    "operationKind": "mutation",
    "text": "mutation loginPageAuthenticateMutation(\n  $username: String!\n  $password: String!\n) {\n  authenticate(authenticateInput: {username: $username, password: $password}) {\n    token\n  }\n}\n"
  }
};
})();

(node as any).hash = "e885bc98f58fb4134af2b813d64fa063";

export default node;
