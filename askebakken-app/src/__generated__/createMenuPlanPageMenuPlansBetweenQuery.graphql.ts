/**
 * @generated SignedSource<<399f57f476161fed1980cd6d6ba9dedb>>
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
      readonly thumbnail: string | null;
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
    "cacheID": "6664733d782c3afd5b7f4f34991da157",
    "id": null,
    "metadata": {},
    "name": "createMenuPlanPageMenuPlansBetweenQuery",
    "operationKind": "query",
    "text": "query createMenuPlanPageMenuPlansBetweenQuery(\n  $fromDate: DateTime!\n  $toDate: DateTime!\n) {\n  menuPlan(where: {and: [{date: {gte: $fromDate}}, {date: {lte: $toDate}}]}) {\n    nodes {\n      id\n      date\n      thumbnail\n      recipes {\n        name\n        category\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "29d58c9f400f3996d5bda60ae5e9ad00";

export default node;
