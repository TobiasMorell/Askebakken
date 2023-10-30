/**
 * @generated SignedSource<<942549f6fb5ede2171ae3216030c703e>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type joinCookingCardButton_LeaveCookingMutation$variables = {
  date: any;
  resident: any;
};
export type joinCookingCardButton_LeaveCookingMutation$data = {
  readonly removeSignUpForCooking: {
    readonly id: any;
  };
};
export type joinCookingCardButton_LeaveCookingMutation = {
  response: joinCookingCardButton_LeaveCookingMutation$data;
  variables: joinCookingCardButton_LeaveCookingMutation$variables;
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
    "name": "resident"
  }
],
v1 = [
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
        "variableName": "resident"
      },
      {
        "kind": "Literal",
        "name": "retainParticipation",
        "value": true
      }
    ],
    "concreteType": "MenuPlan",
    "kind": "LinkedField",
    "name": "removeSignUpForCooking",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "id",
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
    "name": "joinCookingCardButton_LeaveCookingMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "joinCookingCardButton_LeaveCookingMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "4c4ee6d881a4de9f905c515cc775fa9d",
    "id": null,
    "metadata": {},
    "name": "joinCookingCardButton_LeaveCookingMutation",
    "operationKind": "mutation",
    "text": "mutation joinCookingCardButton_LeaveCookingMutation(\n  $date: DateTime!\n  $resident: UUID!\n) {\n  removeSignUpForCooking(date: $date, residentId: $resident, retainParticipation: true) {\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "02ac586aed2dc8542a0cae887afdd90f";

export default node;
