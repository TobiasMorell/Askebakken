/**
 * @generated SignedSource<<98f4686f6945d1383cc5c451944a0b85>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type toggleAttendanceButtonAttendMutation$variables = {
  menuPlanId: any;
  userId?: any | null;
};
export type toggleAttendanceButtonAttendMutation$data = {
  readonly attend: {
    readonly id: any;
    readonly participants: ReadonlyArray<{
      readonly firstName: string | null;
      readonly lastName: string | null;
    }>;
  };
};
export type toggleAttendanceButtonAttendMutation = {
  response: toggleAttendanceButtonAttendMutation$data;
  variables: toggleAttendanceButtonAttendMutation$variables;
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
v1 = [
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
    "name": "attend",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "id",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "concreteType": "Resident",
        "kind": "LinkedField",
        "name": "participants",
        "plural": true,
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
    ],
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "toggleAttendanceButtonAttendMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "toggleAttendanceButtonAttendMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "55354930f8b7f1b19e6a325a61d5688d",
    "id": null,
    "metadata": {},
    "name": "toggleAttendanceButtonAttendMutation",
    "operationKind": "mutation",
    "text": "mutation toggleAttendanceButtonAttendMutation(\n  $menuPlanId: UUID!\n  $userId: UUID\n) {\n  attend(input: {menuPlanId: $menuPlanId, residentId: $userId}) {\n    id\n    participants {\n      firstName\n      lastName\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "0b1a2ca850ee2425e835334afea52824";

export default node;
