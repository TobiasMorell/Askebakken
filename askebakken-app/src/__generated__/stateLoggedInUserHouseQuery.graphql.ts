/**
 * @generated SignedSource<<454cd04101d028d067539a6bc132cc4b>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type stateLoggedInUserHouseQuery$variables = {};
export type stateLoggedInUserHouseQuery$data = {
  readonly me: {
    readonly houseNumber: string;
  };
};
export type stateLoggedInUserHouseQuery = {
  response: stateLoggedInUserHouseQuery$data;
  variables: stateLoggedInUserHouseQuery$variables;
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
    "name": "stateLoggedInUserHouseQuery",
    "selections": (v0/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "stateLoggedInUserHouseQuery",
    "selections": (v0/*: any*/)
  },
  "params": {
    "cacheID": "b6dedbb82c7dfcac885e31def5286262",
    "id": null,
    "metadata": {},
    "name": "stateLoggedInUserHouseQuery",
    "operationKind": "query",
    "text": "query stateLoggedInUserHouseQuery {\n  me {\n    houseNumber\n  }\n}\n"
  }
};
})();

(node as any).hash = "ad200b18694137ed85c2cb3c35cecc60";

export default node;
