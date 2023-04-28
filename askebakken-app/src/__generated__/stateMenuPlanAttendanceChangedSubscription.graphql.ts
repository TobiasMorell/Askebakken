/**
 * @generated SignedSource<<b53a1394ffb7c040edaeabcea833ce6b>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, GraphQLSubscription } from 'relay-runtime';
export type stateMenuPlanAttendanceChangedSubscription$variables = {};
export type stateMenuPlanAttendanceChangedSubscription$data = {
  readonly menuPlanAttendanceChanged: {
    readonly attending: boolean;
    readonly menuPlanId: any;
    readonly residentId: any;
  };
};
export type stateMenuPlanAttendanceChangedSubscription = {
  response: stateMenuPlanAttendanceChangedSubscription$data;
  variables: stateMenuPlanAttendanceChangedSubscription$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "alias": null,
    "args": null,
    "concreteType": "AttendanceChangedEventMessage",
    "kind": "LinkedField",
    "name": "menuPlanAttendanceChanged",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "menuPlanId",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "residentId",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "attending",
        "storageKey": null
      }
    ],
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "stateMenuPlanAttendanceChangedSubscription",
    "selections": (v0/*: any*/),
    "type": "Subscriptions",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "stateMenuPlanAttendanceChangedSubscription",
    "selections": (v0/*: any*/)
  },
  "params": {
    "cacheID": "bf8d40eb7e4efa29a88c7749a32e767f",
    "id": null,
    "metadata": {},
    "name": "stateMenuPlanAttendanceChangedSubscription",
    "operationKind": "subscription",
    "text": "subscription stateMenuPlanAttendanceChangedSubscription {\n  menuPlanAttendanceChanged {\n    menuPlanId\n    residentId\n    attending\n  }\n}\n"
  }
};
})();

(node as any).hash = "b0da1913247785004b27e3581296f907";

export default node;
