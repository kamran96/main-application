import React from 'react';
import ReactDOM from 'react-dom';
import App from './app/app';

declare global {
  interface Window {
    renderBankReconcilation: (containerId: string) => void;
    unmountBankReconcilation: (containerId: string) => void;
  }
}

window.renderBankReconcilation = (containerId) => {
  ReactDOM.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
    document.getElementById(containerId)
  );
};

window.unmountBankReconcilation = (containerId) => {
  const el = document.getElementById(containerId);
  if (!el) {
    return;
  }

  ReactDOM.unmountComponentAtNode(el);
};
