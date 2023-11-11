/**
 * @generated SignedSource<<37b5c063c37ae305f3b5c34da9a95660>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type menuPlannerState_MenuPlansQuery$variables = {
  endDate: any;
  startDate: any;
};
export type menuPlannerState_MenuPlansQuery$data = {
  readonly menuPlan: {
    readonly nodes: ReadonlyArray<{
      readonly chefs: ReadonlyArray<{
        readonly id: any;
      }>;
      readonly date: any;
      readonly guests: ReadonlyArray<{
        readonly houseNumber: string;
        readonly numberOfAdultGuests: number;
        readonly numberOfChildGuests: number;
      }>;
      readonly id: any;
      readonly participants: ReadonlyArray<{
        readonly id: any;
      }>;
      readonly recipes: ReadonlyArray<{
        readonly category: string;
        readonly id: any;
        readonly name: string;
      }>;
      readonly thumbnail: string | null;
    }> | null;
  } | null;
};
export type menuPlannerState_MenuPlansQuery = {
  response: menuPlannerState_MenuPlansQuery$data;
  variables: menuPlannerState_MenuPlansQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "endDate"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "startDate"
},
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v3 = [
  (v2/*: any*/)
],
v4 = [
  {
    "alias": null,
    "args": [
      {
        "fields": [
          {
            "items": [
              {
                "fields": [
                  {
                    "fields": [
                      {
                        "kind": "Variable",
                        "name": "gte",
                        "variableName": "startDate"
                      }
                    ],
                    "kind": "ObjectValue",
                    "name": "date"
                  }
                ],
                "kind": "ObjectValue",
                "name": "and.0"
              },
              {
                "fields": [
                  {
                    "fields": [
                      {
                        "kind": "Variable",
                        "name": "lte",
                        "variableName": "endDate"
                      }
                    ],
                    "kind": "ObjectValue",
                    "name": "date"
                  }
                ],
                "kind": "ObjectValue",
                "name": "and.1"
              }
            ],
            "kind": "ListValue",
            "name": "and"
          }
        ],
        "kind": "ObjectValue",
        "name": "where"
      }
    ],
    "concreteType": "MenuPlanConnection",
    "kind": "LinkedField",
    "name": "menuPlan",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "MenuPlan",
        "kind": "LinkedField",
        "name": "nodes",
        "plural": true,
        "selections": [
          (v2/*: any*/),
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
            "kind": "ScalarField",
            "name": "thumbnail",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "Recipe",
            "kind": "LinkedField",
            "name": "recipes",
            "plural": true,
            "selections": [
              (v2/*: any*/),
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "name",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "category",
                "storageKey": null
              }
            ],
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "Resident",
            "kind": "LinkedField",
            "name": "participants",
            "plural": true,
            "selections": (v3/*: any*/),
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "Resident",
            "kind": "LinkedField",
            "name": "chefs",
            "plural": true,
            "selections": (v3/*: any*/),
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
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "menuPlannerState_MenuPlansQuery",
    "selections": (v4/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [
      (v1/*: any*/),
      (v0/*: any*/)
    ],
    "kind": "Operation",
    "name": "menuPlannerState_MenuPlansQuery",
    "selections": (v4/*: any*/)
  },
  "params": {
    "cacheID": "30c9c5d1cdf1a3502fd22fe3a1413466",
    "id": null,
    "metadata": {},
    "name": "menuPlannerState_MenuPlansQuery",
    "operationKind": "query",
    "text": "query menuPlannerState_MenuPlansQuery(\n  $startDate: DateTime!\n  $endDate: DateTime!\n) {\n  menuPlan(where: {and: [{date: {gte: $startDate}}, {date: {lte: $endDate}}]}) {\n    nodes {\n      id\n      date\n      thumbnail\n      recipes {\n        id\n        name\n        category\n      }\n      participants {\n        id\n      }\n      chefs {\n        id\n      }\n      guests {\n        houseNumber\n        numberOfAdultGuests\n        numberOfChildGuests\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "816b01320d0783eb7eac4b80a9af268f";

export default node;
