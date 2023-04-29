/**
 * @generated SignedSource<<e1f62fcb3c10e3ea1a3a51e4b7e13a7d>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type stateMenuPlansQuery$variables = {
  endDate?: any | null;
  startDate?: any | null;
};
export type stateMenuPlansQuery$data = {
  readonly menuPlan: {
    readonly nodes: ReadonlyArray<{
      readonly date: any;
      readonly id: any;
      readonly participants: ReadonlyArray<{
        readonly id: any;
      }>;
      readonly recipes: ReadonlyArray<{
        readonly id: any;
        readonly name: string;
      }>;
    }> | null;
  } | null;
};
export type stateMenuPlansQuery = {
  response: stateMenuPlansQuery$data;
  variables: stateMenuPlansQuery$variables;
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
            "selections": [
              (v2/*: any*/)
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
    "name": "stateMenuPlansQuery",
    "selections": (v3/*: any*/),
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
    "name": "stateMenuPlansQuery",
    "selections": (v3/*: any*/)
  },
  "params": {
    "cacheID": "15c65060a76ea9f4b5c3d8c79229c917",
    "id": null,
    "metadata": {},
    "name": "stateMenuPlansQuery",
    "operationKind": "query",
    "text": "query stateMenuPlansQuery(\n  $startDate: DateTime\n  $endDate: DateTime\n) {\n  menuPlan(where: {and: [{date: {gte: $startDate}}, {date: {lte: $endDate}}]}) {\n    nodes {\n      id\n      date\n      recipes {\n        id\n        name\n      }\n      participants {\n        id\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "3190fcdc9ea5a6b2c857656948fb4c6f";

export default node;
