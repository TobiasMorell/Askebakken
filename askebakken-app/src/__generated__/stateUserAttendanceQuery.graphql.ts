/**
 * @generated SignedSource<<1ce130a8a2a1d69ff72bf3608ee639b4>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type stateUserAttendanceQuery$variables = {
  userId: any;
};
export type stateUserAttendanceQuery$data = {
  readonly residents: {
    readonly nodes: ReadonlyArray<{
      readonly id: any;
      readonly participatesInIds: ReadonlyArray<any>;
    }> | null;
  } | null;
};
export type stateUserAttendanceQuery = {
  response: stateUserAttendanceQuery$data;
  variables: stateUserAttendanceQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
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
            "fields": [
              {
                "kind": "Variable",
                "name": "eq",
                "variableName": "userId"
              }
            ],
            "kind": "ObjectValue",
            "name": "id"
          }
        ],
        "kind": "ObjectValue",
        "name": "where"
      }
    ],
    "concreteType": "ResidentsConnection",
    "kind": "LinkedField",
    "name": "residents",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "Resident",
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
            "name": "participatesInIds",
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
    "name": "stateUserAttendanceQuery",
    "selections": (v1/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "stateUserAttendanceQuery",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "273fb5a8dda323f07ad1e03ae0bcc01b",
    "id": null,
    "metadata": {},
    "name": "stateUserAttendanceQuery",
    "operationKind": "query",
    "text": "query stateUserAttendanceQuery(\n  $userId: UUID!\n) {\n  residents(where: {id: {eq: $userId}}) {\n    nodes {\n      id\n      participatesInIds\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "1c1b1479ba817e283e4254fe5fe4aca9";

export default node;
