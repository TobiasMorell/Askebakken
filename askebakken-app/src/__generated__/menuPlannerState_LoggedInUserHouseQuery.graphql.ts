/**
 * @generated SignedSource<<0ad3bc4964473ba7f5e19147301e297d>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type menuPlannerState_LoggedInUserHouseQuery$variables = {};
export type menuPlannerState_LoggedInUserHouseQuery$data = {
  readonly me: {
    readonly houseNumber: string;
    readonly id: any;
  };
};
export type menuPlannerState_LoggedInUserHouseQuery = {
  response: menuPlannerState_LoggedInUserHouseQuery$data;
  variables: menuPlannerState_LoggedInUserHouseQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "alias": null,
    "args": null,
    "concreteType": "Resident",
    "kind": "LinkedField",
    "name": "me",
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
        "kind": "ScalarField",
        "name": "houseNumber",
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
    "name": "menuPlannerState_LoggedInUserHouseQuery",
    "selections": (v0/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "menuPlannerState_LoggedInUserHouseQuery",
    "selections": (v0/*: any*/)
  },
  "params": {
    "cacheID": "7df3a24138be05f99e71bc07c0f488bb",
    "id": null,
    "metadata": {},
    "name": "menuPlannerState_LoggedInUserHouseQuery",
    "operationKind": "query",
    "text": "query menuPlannerState_LoggedInUserHouseQuery {\n  me {\n    id\n    houseNumber\n  }\n}\n"
  }
};
})();

(node as any).hash = "d73057ebc7b762a42b5e315681b67aff";

export default node;
