/**
 * @generated SignedSource<<8c2bd725b254798ccbb1099c2456f237>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type weekPlanGuestsUpsertGuestsMutation$variables = {
  adults?: number | null;
  children?: number | null;
  houseNumber: string;
  menuPlanId: any;
};
export type weekPlanGuestsUpsertGuestsMutation$data = {
  readonly upsertGuests: {
    readonly guests: ReadonlyArray<{
      readonly houseNumber: string;
      readonly numberOfAdultGuests: number;
      readonly numberOfChildGuests: number;
    }>;
  };
};
export type weekPlanGuestsUpsertGuestsMutation = {
  response: weekPlanGuestsUpsertGuestsMutation$data;
  variables: weekPlanGuestsUpsertGuestsMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "adults"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "children"
},
v2 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "houseNumber"
},
v3 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "menuPlanId"
},
v4 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "houseNumber",
        "variableName": "houseNumber"
      },
      {
        "kind": "Variable",
        "name": "menuPlanId",
        "variableName": "menuPlanId"
      },
      {
        "kind": "Variable",
        "name": "numberOfAdultGuests",
        "variableName": "adults"
      },
      {
        "kind": "Variable",
        "name": "numberOfChildGuests",
        "variableName": "children"
      }
    ],
    "concreteType": "MenuPlan",
    "kind": "LinkedField",
    "name": "upsertGuests",
    "plural": false,
    "selections": [
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
];
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/),
      (v2/*: any*/),
      (v3/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "weekPlanGuestsUpsertGuestsMutation",
    "selections": (v4/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [
      (v2/*: any*/),
      (v3/*: any*/),
      (v0/*: any*/),
      (v1/*: any*/)
    ],
    "kind": "Operation",
    "name": "weekPlanGuestsUpsertGuestsMutation",
    "selections": (v4/*: any*/)
  },
  "params": {
    "cacheID": "32280243df574f84dcd549ac94cb0e3f",
    "id": null,
    "metadata": {},
    "name": "weekPlanGuestsUpsertGuestsMutation",
    "operationKind": "mutation",
    "text": "mutation weekPlanGuestsUpsertGuestsMutation(\n  $houseNumber: String!\n  $menuPlanId: UUID!\n  $adults: Int\n  $children: Int\n) {\n  upsertGuests(houseNumber: $houseNumber, menuPlanId: $menuPlanId, numberOfAdultGuests: $adults, numberOfChildGuests: $children) {\n    guests {\n      houseNumber\n      numberOfAdultGuests\n      numberOfChildGuests\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "b5e234f873cb04566c4d09bd5af5d310";

export default node;
