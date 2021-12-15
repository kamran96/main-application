import './index.css';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

import { FC } from 'react';
import { QueryClientProvider, QueryClient } from 'react-query';

import AppContainer from '../Containers/App/AppContainer';
import { GlobalManager } from '../hooks/globalContext/globalManager';
import { GlobalStylesWrapper } from './globalStyles';

/* Ant design css */
// import "antd/dist/antd.css";
// const rqConfig = {
//   queries: {
//     staleTime: 1000 * 2 * 60, // that's one min.
//     cacheTime: 1000 * 10 * 60, // those're 10 mins.
//   },
// };

const queryClient = new QueryClient();

const App: FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <GlobalStylesWrapper>
        <GlobalManager>
          <AppContainer />
        </GlobalManager>
      </GlobalStylesWrapper>
    </QueryClientProvider>
  );
};

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
