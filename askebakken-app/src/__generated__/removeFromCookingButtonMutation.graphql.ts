/**
 * @generated SignedSource<<3390f5c54105ac6eefbea9c9eae0d846>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type removeFromCookingButtonMutation$variables = {
  date: any;
  residentId?: any | null;
  retainParticipation?: boolean | null;
};
export type removeFromCookingButtonMutation$data = {
  readonly removeSignUpForCooking: {
    readonly chefs: ReadonlyArray<{
      readonly firstName: string | null;
      readonly id: any;
      readonly lastName: string | null;
    }>;
    readonly date: any;
    readonly id: any;
  };
};
export type removeFromCookingButtonMutation = {
  response: removeFromCookingButtonMutation$data;
  variables: removeFromCookingButtonMutation$variables;
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
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "retainParticipation"
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
      },
      {
        "kind": "Variable",
        "name": "retainParticipation",
        "variableName": "retainParticipation"
      }
    ],
    "concreteType": "MenuPlan",
    "kind": "LinkedField",
    "name": "removeSignUpForCooking",
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
    "name": "removeFromCookingButtonMutation",
    "selections": (v2/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "removeFromCookingButtonMutation",
    "selections": (v2/*: any*/)
  },
  "params": {
    "cacheID": "41d7a41cc24823a89e9f64b498d9434d",
    "id": null,
    "metadata": {},
    "name": "removeFromCookingButtonMutation",
    "operationKind": "mutation",
    "text": "mutation removeFromCookingButtonMutation(\n  $date: DateTime!\n  $residentId: UUID\n  $retainParticipation: Boolean\n) {\n  removeSignUpForCooking(date: $date, residentId: $residentId, retainParticipation: $retainParticipation) {\n    id\n    date\n    chefs {\n      id\n      firstName\n      lastName\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "841d86852df592eca3af59323fa1c775";

export default node;
