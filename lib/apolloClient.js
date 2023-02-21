import { ApolloClient, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
  uri: "https://throbbing-field-310029.us-west-2.aws.cloud.dgraph.io/graphql",
  cache: new InMemoryCache(),
  connectToDevTools: true,
});

export default client;
