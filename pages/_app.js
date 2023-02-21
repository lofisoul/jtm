import { ApolloProvider } from "@apollo/client";
import client from "@/lib/apolloClient";

import "@/styles/globals.css";
import { Hanken_Grotesk } from "@next/font/google";
const hanken = Hanken_Grotesk({ subsets: ["latin"] });

export default function App({ Component, pageProps }) {
  return (
    <ApolloProvider client={client}>
      <style jsx global>{`
        html {
          font-family: ${hanken.style.fontFamily}, sans-serif;
        }
      `}</style>
      <Component {...pageProps} />
    </ApolloProvider>
  );
}
