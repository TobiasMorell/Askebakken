/**
 * @generated SignedSource<<8b4bfd5ec380c9494ef94bcdb297a42e>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, GraphQLSubscription } from 'relay-runtime';
export type menuPlannerState_MenuPlanUpdatedSubscription$variables = {};
export type menuPlannerState_MenuPlanUpdatedSubscription$data = {
  readonly menuPlanUpdated: {
    readonly updatedMenuPlan: {
      readonly chefs: ReadonlyArray<{
        readonly firstName: string | null;
        readonly id: any;
        readonly lastName: string | null;
      }>;
      readonly guests: ReadonlyArray<{
        readonly houseNumber: string;
        readonly numberOfAdultGuests: number;
        readonly numberOfChildGuests: number;
      }>;
      readonly id: any;
      readonly participants: ReadonlyArray<{
        readonly firstName: string | null;
        readonly id: any;
        readonly lastName: string | null;
      }>;
    };
  };
};
export type menuPlannerState_MenuPlanUpdatedSubscription = {
  response: menuPlannerState_MenuPlanUpdatedSubscription$data;
  variables: menuPlannerState_MenuPlanUpdatedSubscription$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v1 = [
  (v0/*: any*/),
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
v2 = [
  {
    "alias": null,
    "args": null,
    "concreteType": "MenuPlanUpdatedEventMessage",
    "kind": "LinkedField",
    "name": "menuPlanUpdated",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "MenuPlan",
        "kind": "LinkedField",
        "name": "updatedMenuPlan",
        "plural": false,
        "selections": [
          (v0/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "Resident",
            "kind": "LinkedField",
            "name": "participants",
            "plural": true,
            "selections": (v1/*: any*/),
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "Resident",
            "kind": "LinkedField",
            "name": "chefs",
            "plural": true,
            "selections": (v1/*: any*/),
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "Guest",
            "kind": "LinkedField",
            "name": "guests",
            "plural": true,
            "selections": [
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "houseNumber",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "numberOfAdultGuests",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "numberOfChildGuests",
                "storageKey": null
              }
            ],
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
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "menuPlannerState_MenuPlanUpdatedSubscription",
    "selections": (v2/*: any*/),
    "type": "Subscriptions",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "menuPlannerState_MenuPlanUpdatedSubscription",
    "selections": (v2/*: any*/)
  },
  "params": {
    "cacheID": "2d95b128e2190b468b6edd59dccb3f1f",
    "id": null,
    "metadata": {},
    "name": "menuPlannerState_MenuPlanUpdatedSubscription",
    "operationKind": "subscription",
    "text": "subscription menuPlannerState_MenuPlanUpdatedSubscription {\n  menuPlanUpdated {\n    updatedMenuPlan {\n      id\n      participants {\n        id\n        firstName\n        lastName\n      }\n      chefs {\n        id\n        firstName\n        lastName\n      }\n      guests {\n        houseNumber\n        numberOfAdultGuests\n        numberOfChildGuests\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "06b2a2ade83bec0b58b777ba6a74fa6b";

export default node;
