require("../styles/globals.less");
import type { AppProps } from "next/app";
import React from "react";

React.useLayoutEffect = React.useEffect;
function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
export default MyApp;
