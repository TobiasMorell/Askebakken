/**
 * @generated SignedSource<<3068327a5ba00b684a2f7879de0c0001>>
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
    "name": "unattend",
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
    "name": "toggleAttendanceButtonUnattendMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "toggleAttendanceButtonUnattendMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "58e6d147d36d96434cb50e8b64b42904",
    "id": null,
    "metadata": {},
    "name": "toggleAttendanceButtonUnattendMutation",
    "operationKind": "mutation",
    "text": "mutation toggleAttendanceButtonUnattendMutation(\n  $menuPlanId: UUID!\n  $userId: UUID\n) {\n  unattend(input: {menuPlanId: $menuPlanId, residentId: $userId}) {\n    id\n    participants {\n      firstName\n      lastName\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "872989a1704b4cc2ae7a86a67fe2283d";

export default node;
