/**
 * @generated SignedSource<<0517e52c0e5430ccb456fa55f13a2db4>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type joinCookingCardButton_JoinMutation$variables = {
  date: any;
  residentId?: any | null;
};
export type joinCookingCardButton_JoinMutation$data = {
  readonly signUpForCooking: {
    readonly chefs: ReadonlyArray<{
      readonly firstName: string | null;
      readonly id: any;
      readonly lastName: string | null;
    }>;
    readonly date: any;
    readonly id: any;
  };
};
export type joinCookingCardButton_JoinMutation = {
  response: joinCookingCardButton_JoinMutation$data;
  variables: joinCookingCardButton_JoinMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "date"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "residentId"
  }
],
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v2 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "date",
        "variableName": "date"
      },
      {
        "kind": "Variable",
        "name": "residentId",
        "variableName": "residentId"
      }
    ],
    "concreteType": "MenuPlan",
    "kind": "LinkedField",
    "name": "signUpForCooking",
    "plural": false,
    "selections": [
      (v1/*: any*/),
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "date",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "concreteType": "Resident",
        "kind": "LinkedField",
        "name": "chefs",
        "plural": true,
        "selections": [
          (v1/*: any*/),
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
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "joinCookingCardButton_JoinMutation",
    "selections": (v2/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "joinCookingCardButton_JoinMutation",
    "selections": (v2/*: any*/)
  },
  "params": {
    "cacheID": "4c99a282cc598e15fd4148a024c7c82d",
    "id": null,
    "metadata": {},
    "name": "joinCookingCardButton_JoinMutation",
    "operationKind": "mutation",
    "text": "mutation joinCookingCardButton_JoinMutation(\n  $date: DateTime!\n  $residentId: UUID\n) {\n  signUpForCooking(date: $date, residentId: $residentId) {\n    id\n    date\n    chefs {\n      id\n      firstName\n      lastName\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "8e7b5369fe5ada81dce4546f9d1b445c";

export default node;
