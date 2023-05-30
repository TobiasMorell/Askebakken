/**
 * @generated SignedSource<<93665a1955572d10a004fa54731d88f5>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type stateResidentsInHouseQuery$variables = {
  houseNumber?: string | null;
};
export type stateResidentsInHouseQuery$data = {
  readonly residents: ReadonlyArray<{
    readonly child: boolean;
    readonly firstName: string | null;
    readonly houseNumber: string;
    readonly id: any;
    readonly lastName: string | null;
  }>;
};
export type stateResidentsInHouseQuery = {
  response: stateResidentsInHouseQuery$data;
  variables: stateResidentsInHouseQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "houseNumber"
  }
],
v1 = [
  {
    "alias": null,
    "args": [
      {
        "fields": [
          {
            "fields": [
              {
                "kind": "Variable",
                "name": "eq",
                "variableName": "houseNumber"
              }
            ],
            "kind": "ObjectValue",
            "name": "houseNumber"
          }
        ],
        "kind": "ObjectValue",
        "name": "where"
      }
    ],
    "concreteType": "Resident",
    "kind": "LinkedField",
    "name": "residents",
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
        "name": "firstName",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "lastName",
        "storageKey": null
      },
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
        "name": "child",
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
    "name": "stateResidentsInHouseQuery",
    "selections": (v1/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "stateResidentsInHouseQuery",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "c8f564e3c096b3b6688fe82ab15c51a1",
    "id": null,
    "metadata": {},
    "name": "stateResidentsInHouseQuery",
    "operationKind": "query",
    "text": "query stateResidentsInHouseQuery(\n  $houseNumber: String\n) {\n  residents(where: {houseNumber: {eq: $houseNumber}}) {\n    id\n    firstName\n    lastName\n    houseNumber\n    child\n  }\n}\n"
  }
};
})();

(node as any).hash = "25d9ed755853c15a46f2e45f2b981d0b";

export default node;
