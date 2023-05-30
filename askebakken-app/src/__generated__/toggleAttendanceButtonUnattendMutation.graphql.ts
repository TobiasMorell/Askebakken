/**
 * @generated SignedSource<<238988cd50869854b9a36051d20b4eb1>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type toggleAttendanceButtonUnattendMutation$variables = {
  menuPlanId: any;
  userId?: any | null;
};
export type toggleAttendanceButtonUnattendMutation$data = {
  readonly unattend: {
    readonly id: any;
    readonly participants: ReadonlyArray<{
      readonly firstName: string | null;
      readonly id: any;
      readonly lastName: string | null;
    }>;
  };
};
export type toggleAttendanceButtonUnattendMutation = {
  response: toggleAttendanceButtonUnattendMutation$data;
  variables: toggleAttendanceButtonUnattendMutation$variables;
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
    "name": "unattend",
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
    "name": "toggleAttendanceButtonUnattendMutation",
    "selections": (v2/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "toggleAttendanceButtonUnattendMutation",
    "selections": (v2/*: any*/)
  },
  "params": {
    "cacheID": "155d12b8daf508a8de7e3b8ec4925ddb",
    "id": null,
    "metadata": {},
    "name": "toggleAttendanceButtonUnattendMutation",
    "operationKind": "mutation",
    "text": "mutation toggleAttendanceButtonUnattendMutation(\n  $menuPlanId: UUID!\n  $userId: UUID\n) {\n  unattend(input: {menuPlanId: $menuPlanId, residentId: $userId}) {\n    id\n    participants {\n      id\n      firstName\n      lastName\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "fd2653633af33a57c838eaf767b0e6e7";

export default node;
