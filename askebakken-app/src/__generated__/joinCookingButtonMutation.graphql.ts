/**
 * @generated SignedSource<<6491ac8afe8a3a31897928669db7367a>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type joinCookingButtonMutation$variables = {
  date: any;
  residentId?: any | null;
};
export type joinCookingButtonMutation$data = {
  readonly signUpForCooking: {
    readonly chefs: ReadonlyArray<{
      readonly firstName: string | null;
      readonly houseNumber: string;
      readonly id: any;
      readonly lastName: string | null;
    }>;
    readonly date: any;
    readonly id: any;
  };
};
export type joinCookingButtonMutation = {
  response: joinCookingButtonMutation$data;
  variables: joinCookingButtonMutation$variables;
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
    ],
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "joinCookingButtonMutation",
    "selections": (v2/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "joinCookingButtonMutation",
    "selections": (v2/*: any*/)
  },
  "params": {
    "cacheID": "016f708f27f2235b367a9a229e40e774",
    "id": null,
    "metadata": {},
    "name": "joinCookingButtonMutation",
    "operationKind": "mutation",
    "text": "mutation joinCookingButtonMutation(\n  $date: DateTime!\n  $residentId: UUID\n) {\n  signUpForCooking(date: $date, residentId: $residentId) {\n    id\n    date\n    chefs {\n      id\n      firstName\n      lastName\n      houseNumber\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "8c3b007868a59236c1a919d4f3169026";

export default node;
