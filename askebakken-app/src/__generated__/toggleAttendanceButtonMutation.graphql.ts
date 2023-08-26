/**
 * @generated SignedSource<<f082afe3d60ba3c548259a5261a71285>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type toggleAttendanceButtonMutation$variables = {
  menuPlanId: any;
  userId?: any | null;
};
export type toggleAttendanceButtonMutation$data = {
  readonly toggleAttendance: {
    readonly id: any;
    readonly participants: ReadonlyArray<{
      readonly firstName: string | null;
      readonly id: any;
      readonly lastName: string | null;
    }>;
  };
};
export type toggleAttendanceButtonMutation = {
  response: toggleAttendanceButtonMutation$data;
  variables: toggleAttendanceButtonMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "menuPlanId"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "userId"
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
        "fields": [
          {
            "kind": "Variable",
            "name": "menuPlanId",
            "variableName": "menuPlanId"
          },
          {
            "kind": "Variable",
            "name": "residentId",
            "variableName": "userId"
          }
        ],
        "kind": "ObjectValue",
        "name": "input"
      }
    ],
    "concreteType": "MenuPlan",
    "kind": "LinkedField",
    "name": "toggleAttendance",
    "plural": false,
    "selections": [
      (v1/*: any*/),
      {
        "alias": null,
        "args": null,
        "concreteType": "Resident",
        "kind": "LinkedField",
        "name": "participants",
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
    "name": "toggleAttendanceButtonMutation",
    "selections": (v2/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "toggleAttendanceButtonMutation",
    "selections": (v2/*: any*/)
  },
  "params": {
    "cacheID": "ec94c87c4f1f5a5f937de84752528431",
    "id": null,
    "metadata": {},
    "name": "toggleAttendanceButtonMutation",
    "operationKind": "mutation",
    "text": "mutation toggleAttendanceButtonMutation(\n  $menuPlanId: UUID!\n  $userId: UUID\n) {\n  toggleAttendance(input: {menuPlanId: $menuPlanId, residentId: $userId}) {\n    id\n    participants {\n      id\n      firstName\n      lastName\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "e961f42afb2eb5aeef9eeb8339bc4de7";

export default node;
