/**
 * @generated SignedSource<<d08f66a93613969a33215fb2e31ab17a>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type forgotPasswordPageForgotPasswordMutation$variables = {
  username: string;
};
export type forgotPasswordPageForgotPasswordMutation$data = {
  readonly forgotPassword: {
    readonly success: boolean;
  };
};
export type forgotPasswordPageForgotPasswordMutation = {
  response: forgotPasswordPageForgotPasswordMutation$data;
  variables: forgotPasswordPageForgotPasswordMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "username"
  }
],
v1 = [
  {
    "alias": null,
    "args": [
      {
        "fields": [
          {
            "kind": "Variable",
            "name": "username",
            "variableName": "username"
          }
        ],
        "kind": "ObjectValue",
        "name": "forgotPasswordInput"
      }
    ],
    "concreteType": "SuccessResult",
    "kind": "LinkedField",
    "name": "forgotPassword",
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
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "forgotPasswordPageForgotPasswordMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "forgotPasswordPageForgotPasswordMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "bc14f5de7dbe759b9ba085b95a46d168",
    "id": null,
    "metadata": {},
    "name": "forgotPasswordPageForgotPasswordMutation",
    "operationKind": "mutation",
    "text": "mutation forgotPasswordPageForgotPasswordMutation(\n  $username: String!\n) {\n  forgotPassword(forgotPasswordInput: {username: $username}) {\n    success\n  }\n}\n"
  }
};
})();

(node as any).hash = "f2c7e66226a4bab9e526c851ad97584a";

export default node;
