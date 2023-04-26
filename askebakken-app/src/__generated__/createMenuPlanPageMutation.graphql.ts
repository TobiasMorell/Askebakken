/**
 * @generated SignedSource<<102377692d44f87577f3554d68c999c8>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type CreateWeekPlanInput = {
  friday: ReadonlyArray<CreateRecipeInput>;
  fromDate: any;
  monday: ReadonlyArray<CreateRecipeInput>;
  thursday: ReadonlyArray<CreateRecipeInput>;
  tuesday: ReadonlyArray<CreateRecipeInput>;
  wednesday: ReadonlyArray<CreateRecipeInput>;
};
export type CreateRecipeInput = {
  category: string;
  name: string;
};
export type createMenuPlanPageMutation$variables = {
  input: CreateWeekPlanInput;
};
export type createMenuPlanPageMutation$data = {
  readonly createWeekPlan: ReadonlyArray<{
    readonly id: any;
  }>;
};
export type createMenuPlanPageMutation = {
  response: createMenuPlanPageMutation$data;
  variables: createMenuPlanPageMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "input"
  }
],
v1 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "createWeekPlan",
        "variableName": "input"
      }
    ],
    "concreteType": "MenuPlan",
    "kind": "LinkedField",
    "name": "createWeekPlan",
    "plural": true,
    "selections": [
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "id",
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
    "name": "createMenuPlanPageMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "createMenuPlanPageMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "ccb7ef30b4ee0dcfa6e4c19b4d100852",
    "id": null,
    "metadata": {},
    "name": "createMenuPlanPageMutation",
    "operationKind": "mutation",
    "text": "mutation createMenuPlanPageMutation(\n  $input: CreateWeekPlanInput!\n) {\n  createWeekPlan(createWeekPlan: $input) {\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "7917d6005fe7991b39eb59ff79999785";

export default node;
