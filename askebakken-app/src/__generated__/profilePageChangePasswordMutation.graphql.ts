/**
 * @generated SignedSource<<aba0e9519ab02ee45a08f7a09ff8c3de>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type profilePageChangePasswordMutation$variables = {
  newPassword: string;
  oldPassword: string;
  username: string;
};
export type profilePageChangePasswordMutation$data = {
  readonly changePassword: {
    readonly success: boolean;
  };
};
export type profilePageChangePasswordMutation = {
  response: profilePageChangePasswordMutation$data;
  variables: profilePageChangePasswordMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "newPassword"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "oldPassword"
},
v2 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "username"
},
v3 = [
  {
    "alias": null,
    "args": [
      {
        "fields": [
          {
            "kind": "Variable",
            "name": "newPassword",
            "variableName": "newPassword"
          },
          {
            "kind": "Variable",
            "name": "oldPassword",
            "variableName": "oldPassword"
          },
          {
            "kind": "Variable",
            "name": "username",
            "variableName": "username"
          }
        ],
        "kind": "ObjectValue",
        "name": "input"
      }
    ],
    "concreteType": "SuccessResult",
    "kind": "LinkedField",
    "name": "changePassword",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "success",
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
      (v1/*: any*/),
      (v2/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "profilePageChangePasswordMutation",
    "selections": (v3/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [
      (v1/*: any*/),
      (v0/*: any*/),
      (v2/*: any*/)
    ],
    "kind": "Operation",
    "name": "profilePageChangePasswordMutation",
    "selections": (v3/*: any*/)
  },
  "params": {
    "cacheID": "0b088a1763c8ae542edb49ff20710035",
    "id": null,
    "metadata": {},
    "name": "profilePageChangePasswordMutation",
    "operationKind": "mutation",
    "text": "mutation profilePageChangePasswordMutation(\n  $oldPassword: String!\n  $newPassword: String!\n  $username: String!\n) {\n  changePassword(input: {oldPassword: $oldPassword, newPassword: $newPassword, username: $username}) {\n    success\n  }\n}\n"
  }
};
})();

(node as any).hash = "e1aeedf7eccba515702ba0bf7dc2a609";

export default node;
