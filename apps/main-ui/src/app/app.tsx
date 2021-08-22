import React, { FC } from "react";
import ReactDOM from "react-dom";
import "./index.css";
import AppContainer from "../Containers/App/AppContainer";
import { ReactQueryConfigProvider } from "react-query";

/* Ant design css */
// import "antd/dist/antd.css";
import { GlobalManager } from "../hooks/globalContext/globalManager";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { sentryInit } from "../utils/integrations";

const rqConfig = {
  queries: {
    staleTime: 1000 * 2 * 60, // that's one min.
    cacheTime: 1000 * 10 * 60, // those're 10 mins.
  },
};

const App:FC = ()=>{

  return(
<ReactQueryConfigProvider config={rqConfig}>
      <GlobalManager>
        <AppContainer />
      </GlobalManager>
    </ReactQueryConfigProvider>
  )
}

export default App;

// ReactDOM.render(
//   <React.StrictMode>
//     {/* <ReactQueryCacheProvider queryCache={queryCache}> */}
    
//     {/* </ReactQueryCacheProvider> */}
//   </React.StrictMode>,
//   document.getElementById("root")
// );

// // If you want your app to work offline and load faster, you can change
// // unregister() to register() below. Note this comes with some pitfalls.
// // Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();
