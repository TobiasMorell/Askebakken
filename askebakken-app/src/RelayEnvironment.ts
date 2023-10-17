import {
  Environment,
  Network,
  RecordSource,
  Store,
  Observable,
  FetchFunction,
  SubscribeFunction,
} from "relay-runtime";
import { createClient } from "graphql-ws";
import { getAuthToken } from "./state/token";

const HTTP_ENDPOINT = import.meta.env.VITE_GRAPHQL_ENDPOINT;
const WEBSOCKET_ENDPOINT = import.meta.env.VITE_GRAPHQL_WEBSOCKET_ENDPOINT;

const fetchFn: FetchFunction = async (request, variables) => {
  const token = getAuthToken();

  const resp = await fetch(HTTP_ENDPOINT, {
    method: "POST",
    mode: "cors",
    headers: {
      Accept:
        "application/graphql-response+json; charset=utf-8, application/json; charset=utf-8",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      "Access-Control-Allow-Origin": "*",
      // <-- Additional headers like 'Authorization' would go here
    },
    body: JSON.stringify({
      query: request.text, // <-- The GraphQL document composed by Relay
      variables,
    }),
  });

  return await resp.json();
};

let subscribeFn: SubscribeFunction;

if (typeof window !== "undefined") {
  // We only want to setup subscriptions if we are on the client.
  const subscriptionsClient = createClient({
    url: WEBSOCKET_ENDPOINT,
  });

  subscribeFn = (request, variables) => {
    // To understand why we return Observable.create<any>,
    // please see: https://github.com/enisdenjo/graphql-ws/issues/316#issuecomment-1047605774
    return Observable.create<any>((sink) => {
      if (!request.text) {
        return sink.error(new Error("Operation text cannot be empty"));
      }

      return subscriptionsClient.subscribe(
        {
          operationName: request.name,
          query: request.text,
          variables,
        },
        sink
      );
    });
  };
}

function createRelayEnvironment() {
  return new Environment({
    network: Network.create(fetchFn, subscribeFn),
    store: new Store(new RecordSource()),
  });
}

export const RelayEnvironment = createRelayEnvironment();
