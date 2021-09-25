import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom';
import { BrowserRouter, Switch } from 'react-router-dom';

import App from './app/app';
import { sentryInit } from './utils/integrations';


/* integrations */

sentryInit();

// require("dotenv").config


ReactDOM.render(
  <StrictMode>
    <BrowserRouter>
     <Switch>
     <App />
     </Switch>
    </BrowserRouter>
  </StrictMode>,
  document.getElementById('root')
);
