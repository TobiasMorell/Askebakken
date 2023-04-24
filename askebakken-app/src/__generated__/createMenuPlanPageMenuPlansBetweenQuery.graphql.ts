/**
 * @generated SignedSource<<a41dd33ba540bb7c84a159f3e002900b>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type createMenuPlanPageMenuPlansBetweenQuery$variables = {
  fromDate: any;
  toDate: any;
};
export type createMenuPlanPageMenuPlansBetweenQuery$data = {
  readonly menuPlan: {
    readonly nodes: ReadonlyArray<{
      readonly date: any;
      readonly id: any;
      readonly recipes: ReadonlyArray<{
        readonly category: string;
        readonly name: string;
      }>;
    }> | null;
  } | null;
};
export type createMenuPlanPageMenuPlansBetweenQuery = {
  response: createMenuPlanPageMenuPlansBetweenQuery$data;
  variables: createMenuPlanPageMenuPlansBetweenQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "fromDate"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "toDate"
  }
],
v1 = [
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
                        "variableName": "fromDate"
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
                        "variableName": "toDate"
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
    "name": "createMenuPlanPageMenuPlansBetweenQuery",
    "selections": (v1/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "createMenuPlanPageMenuPlansBetweenQuery",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "ee23ae4d393a487b1e189e33cd68afb7",
    "id": null,
    "metadata": {},
    "name": "createMenuPlanPageMenuPlansBetweenQuery",
    "operationKind": "query",
    "text": "query createMenuPlanPageMenuPlansBetweenQuery(\n  $fromDate: DateTime!\n  $toDate: DateTime!\n) {\n  menuPlan(where: {and: [{date: {gte: $fromDate}}, {date: {lte: $toDate}}]}) {\n    nodes {\n      id\n      date\n      recipes {\n        name\n        category\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "df929c5efa07e617a2c7e42c88377fe9";

export default node;
