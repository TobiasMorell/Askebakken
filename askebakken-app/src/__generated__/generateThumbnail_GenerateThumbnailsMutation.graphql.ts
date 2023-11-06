/**
 * @generated SignedSource<<ccbc7ddb6ee4832f37869c6c4bc65e33>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type generateThumbnail_GenerateThumbnailsMutation$variables = {
  menuPlanId: any;
  numberOfThumbnails: number;
  thumbnailSize: number;
};
export type generateThumbnail_GenerateThumbnailsMutation$data = {
  readonly generateThumbnail: {
    readonly thumbnailUrls: ReadonlyArray<string>;
  };
};
export type generateThumbnail_GenerateThumbnailsMutation = {
  response: generateThumbnail_GenerateThumbnailsMutation$data;
  variables: generateThumbnail_GenerateThumbnailsMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "menuPlanId"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "numberOfThumbnails"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "thumbnailSize"
  }
],
v1 = [
  {
    "alias": null,
    "args": [
      {
        "fields": [
          {
            "kind": "Variable",
            "name": "menuPlanId",
            "variableName": "menuPlanId"
          },
          {
            "kind": "Variable",
            "name": "numberOfThumbnails",
            "variableName": "numberOfThumbnails"
          },
          {
            "kind": "Variable",
            "name": "thumbnailSize",
            "variableName": "thumbnailSize"
          }
        ],
        "kind": "ObjectValue",
        "name": "request"
      }
    ],
    "concreteType": "GenerateMenuPlanThumbnailResult",
    "kind": "LinkedField",
    "name": "generateThumbnail",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "thumbnailUrls",
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
    "name": "generateThumbnail_GenerateThumbnailsMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "generateThumbnail_GenerateThumbnailsMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "da3e10f086a168b0b43cf63400b11b16",
    "id": null,
    "metadata": {},
    "name": "generateThumbnail_GenerateThumbnailsMutation",
    "operationKind": "mutation",
    "text": "mutation generateThumbnail_GenerateThumbnailsMutation(\n  $menuPlanId: UUID!\n  $numberOfThumbnails: Int!\n  $thumbnailSize: Int!\n) {\n  generateThumbnail(request: {menuPlanId: $menuPlanId, numberOfThumbnails: $numberOfThumbnails, thumbnailSize: $thumbnailSize}) {\n    thumbnailUrls\n  }\n}\n"
  }
};
})();

(node as any).hash = "59b0886e1ac0833a18fd262533e97d9a";

export default node;
